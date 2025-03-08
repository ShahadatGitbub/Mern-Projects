import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import transporter from "../config/nodemailer.js";


//sign up
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        console.log("Missing fields in request body");
        return res.json({ success: false, message: "All Fields are required!" });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log(" User already exists with email:", email);
            return res.json({ success: false, message: "User already exists!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Token creation
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiry
        });

        //sending welcome message using nodemailer
        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "welcome to my website", // Subject line
            text: `your account has been created with email id : ${email}`// plain text body
            //html: "<b>Hello world?</b>", // html body
        }

        await transporter.sendMail(mailoptions);


        return res.json({ success: true, message: "You have successfully registered!" });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};



// User Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Email!" });
        }

        //matching the password of user with password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Wrong password! Please enter the correct password." });
        }

        // Token creation
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7-day expiry
        });

        return res.status(200).json({ success: true, message: "You have successfully logged in!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }
};




// User Logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        return res.status(200).json({ success: true, message: "You have successfully logged out!" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }
};





//send verification email to user email
export const sendVerificationOtp = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await userModel.findById(userId);
        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Your account is already verified!" })
        }

        //if not verified send otp to verify

        const otp = String(Math.floor(100000 + Math.random() * 900000)) //6 digit otp
        user.verifyOtp = otp; //saving otp in user data in database
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; //expire in 24hours

        await user.save();

        //sending otp to user email using nodemailer
        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Email Verification", // Subject line
            text: `Your verification OTP is ${otp}. Verify your email using this OTP`// plain text body
            //html: "<b>Hello world?</b>", // html body
        }

        await transporter.sendMail(mailoptions);
        return res.json({ success: true, message: "Verification OTP sent to your email!" });

    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });

    }
}





//Email verification by otp

export const verifyEmailByOTP = async (req, res) => {

    const { userId, otp } = req.body; //user will send otp only through body, user will not send userId, so we will use middleware and token to recieve userId send from body

    if (!userId || !otp) {
        return res.json({ success: false, message: "Missing details!" });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        //wrong otp
        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.json({ success: false, message: "Wrong OTP! Please Enter correct OTP" });
        }

        //otp expired
        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired, Verify Again!" });
        }


        //otp not expired, so verify email
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();
        return res.json({ success: true, message: "Your Email is verified successfully!" });
    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }
}




//check if the user is authenticated or not

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }
}






//send password reset otp
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: "Email is Required!" })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found!" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000)) //6 digit otp
        user.resetOtp = otp; //saving otp in user data in database
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; //expire in 15 minutes

        await user.save();

        //sending otp to user email using nodemailer
        const mailoptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP", // Subject line
            text: `Your Reset Password OTP is ${otp}. Reset your Password using this OTP`// plain text body
            //html: "<b>Hello world?</b>", // we can send good html page to email by this
        }

        await transporter.sendMail(mailoptions);
        return res.json({ success: true, message: "Password Reset OTP sent to your email!" });

    }

    catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }

}




//reset password

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.json({ success: false, message: "All fields are required!" })
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User Not found!" })
        }

        //wrong otp
        if (user.resetOtp === '' || user.resetOtp !== otp) {
            return res.json({ success: false, message: "Wrong OTP! Please Enter correct OTP" });
        }

        //otp expired
        if (user.resetOtpExpireAt < Date.now()) {  
            return res.json({ success: false, message: "OTP Expired! Send reset OTP again!" });
        }


        //otp not expired, so reset password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({ success: true, message: "Password has been reset successfully!" });
    }


    catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });

    }
}