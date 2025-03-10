import Subject from "../models/subjectModel.js";

// subjectsController.js
export const addSubject = async (req, res) => {
    try {
      const { userId, subjectName, attended, missed } = req.body;
  
      if (!userId || !subjectName) {
        return res.status(400).json({ message: "User ID and subject name are required" });
      }
  
      const newSubject = new Subject({
        userId,
        subjectName,
        attended: attended || 0, // Default to 0 if not provided
        missed: missed || 0     // Default to 0 if not provided
      });
  
      await newSubject.save();
      
  
      res.status(201).json({ success: true, message: "Subject added successfully", subject: newSubject });
    } catch (error) {
      
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };



export const deleteSubject = async (req, res) => {
    try {

        const { userId } = req.body;  // Extract userId from request body
        const { subjectId } = req.params;  // Extract subjectId from URL params

        if (!subjectId) {
            return res.status(400).json({ message: "Subject ID is required" });
        }

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const subject = await Subject.findOneAndDelete({ _id: subjectId, userId });

        if (!subject) {
            return res.status(404).json({ message: "Subject not found or unauthorized" });
        }

        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
        console.error("Error in deleteSubject:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const updateSubject = async (req, res) => {
    try {
      const { subjectId, attended, missed } = req.body;
  
      if (!subjectId) {
        return res.status(400).json({ message: "Subject ID is required" });
      }
  
      const subject = await Subject.findByIdAndUpdate(
        subjectId,
        { attended, missed },
        { new: true }
      );
  
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
  
      res.status(200).json({ success: true, subject });
    } catch (error) {
      console.error("Error in updateSubject:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  // Assuming this is in a file like subjectsController.js
export const getAllSubjects = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const subjects = await Subject.find({ userId });

        res.status(200).json({ success: true, subjects });
    } catch (error) {
        console.error("Error in getAllSubjects:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};