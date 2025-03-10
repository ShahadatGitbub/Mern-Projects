import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subjectName: { type: String, required: true },
    attended: { type: Number, default: 0 },
    missed: { type: Number, default: 0 }
});

const Subject = mongoose.models.Subject || mongoose.model("Subject", subjectSchema);

export default Subject;
