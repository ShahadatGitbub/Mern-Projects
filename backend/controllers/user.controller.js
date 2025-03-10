import userModel from "../models/userModel.js";
import profilePicModel from "../models/userProfileModel.js";
import fs from "fs";
import path from "path";



export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.body; // userId is added from the authentication middleware

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required!" });
        }

        const user = await userModel.findById(userId).select("_id name isAccountVerified email profilePic");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found!" });
        }

        return res.status(200).json({
            success: true,
            userData: {
                _id: user._id,  // ✅ Add this so frontend gets userId
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: process.env.NODE_ENV === "production" ? "Something went wrong!" : error.message
        });
    }
};


export const uploadProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded!" });
        }

        const profile_pic = `${req.file.filename}`;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required!" });
        }

       const profilePic = new profilePicModel({
            userId:req.body.userId,
            filename: profile_pic
        });

        await profilePic.save();

        return res.status(200).json({
            success: true, 
            filename: profile_pic, // ✅ Send filename to frontend
            message: "Profile picture uploaded successfully!" 
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error!", error: error.message });
    }
};

export const updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded!" });
        }

        const profile_pic = req.file.filename;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required!" });
        }

        const profilePic = await profilePicModel.findOne({ userId });

        if (!profilePic) {
            return res.status(404).json({ success: false, message: "Profile picture not found!" });
        }

        // Delete the old profile picture
        const oldProfilePic = profilePic.filename;
        fs.unlinkSync(path.join(process.cwd(), "uploads/users", oldProfilePic));

        // Update the profile picture
        profilePic.filename = profile_pic;
        await profilePic.save();

        return res.status(200).json({
            success: true,
            message: "Profile picture updated successfully!",
            filename: profile_pic // ✅ Send updated filename
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error!", error: error.message });
    }
};


export const deleteProfilePic = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required!" });
        }

        const profilePic = await profilePicModel.findOne({ userId });

        if (!profilePic) {
            return res.status(404).json({ success: false, message: "Profile picture not found!" });
        }

        // Delete the profile picture
        const oldProfilePic = profilePic.filename;
        fs.unlinkSync(path.join(process.cwd(), "uploads/users", oldProfilePic));

        await profilePicModel.findByIdAndDelete(profilePic._id);

        return res.status(200).json({ success: true, message: "Profile picture deleted successfully!" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error!", error: error.message });
    }
}


export const getProfilePic = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required!" });
        }

        const profilePic = await profilePicModel.findOne({ userId});
        if (!profilePic) {
            return res.status(404).json({ success: false, message: "Profile picture not found!" });
        }

        return res.status(200).json({ success: true, filename: profilePic.filename });

    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error!", error: error
        });
    }
}