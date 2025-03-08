import jwt from "jsonwebtoken"

//this function is used to add userId in body of api request


const userAuthentication = async (req,res,next) =>{
    const {token} = req.cookies;

    if(!token){
        return res.json({success:false, message: "You are not authorised! login again"})
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if(decodedToken.id){ //this id was created in "const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });"

            req.body.userId = decodedToken.id; //adding userId in body to get this id in verifictation email and otp function
        }
        
        else{
            return res.json({success:false, message: "You are not authorised! login again"})
        }

        next();

    } 
    
    catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }
}

export default userAuthentication;