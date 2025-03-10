import mongoose from "mongoose";

const profilePicSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    filename: { type: String, required: true }, // Stores the uploaded image filename
    uploadedAt: { type: Date, default: Date.now }
});

const ProfilePic = mongoose.models.ProfilePic || mongoose.model("ProfilePic", profilePicSchema);

export default ProfilePic;
