import userModel from "../models/userModel.js";

export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.body; // userId is added from the authentication middleware

        if (!userId) {
            return res.json({ success: false, message: "User not found!" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found!" });
        }

        return res.json({
            success: true,
            userData : {
                name : user.name,
                isAccountVerified : user.isAccountVerified,
            }
        });

    } 
    
    catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }
};
