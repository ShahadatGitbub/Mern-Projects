import express from "express";
import userAuthentication from "../middlewares/userAuth.js";
import multer from "multer";
import { getUserDetails,uploadProfilePic, updateProfilePic, deleteProfilePic, getProfilePic} from "../controllers/user.controller.js";

const userRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/users",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage});

// Get user details
userRouter.get('/user-details', userAuthentication, getUserDetails);

userRouter.post('/upload-profile-pic',userAuthentication, upload.single("profilePic"), uploadProfilePic);

// Update profile picture
userRouter.put('/update-profile-pic',userAuthentication, upload.single("profilePic"), updateProfilePic);

// Delete profile picture
userRouter.delete('/delete-profile-pic',userAuthentication, deleteProfilePic);

userRouter.get('/get-profile-pic/:userId',userAuthentication, getProfilePic);



export default userRouter;
