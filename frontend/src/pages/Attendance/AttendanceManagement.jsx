import React, { useState, useEffect, useContext } from "react";
import "./AttendanceManagement.css"; 
import Subject from "./Subject";
import AddSubjectForm from "./AddSubjectForm";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AttendanceManagement = () => {
  const { backendUrl, userId } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.post(`${backendUrl}/api/subjects/get-all-subjects`, {
        userId: userId // Send userId in the request body
      });
      
      if (response.data.success) {
        setSubjects(response.data.subjects);
      } else {
        toast.error("No subjects found");
      }
    } catch (error) {
      console.error("Error fetching subjects:", error.response?.status, error.message);
      if (error.response?.status === 404) {
        toast.error("Subjects endpoint not found. Check server setup.");
      } else {
        toast.error("Failed to load subjects: " + error.message);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSubjects();
    }
  }, [userId]);

  return (
    <div className="attendance-container"> 
      <div className="attendance-header">
        <div>
          <h2 className="title">Attendance Management</h2>
          <p className="datetime">{new Date().toLocaleString()}</p>
        </div>
        <button className="add-subject-button" onClick={() => setIsModalOpen(true)}>
          Add Subject
        </button>
      </div>
      <hr />

      <div className="subjects-container">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <Subject
              key={subject._id}
              id={subject._id}
              title={subject.subjectName}
              attended={subject.attended}
              missed={subject.missed}
              fetchSubjects={fetchSubjects}
            />
          ))
        ) : (
          <p>No subjects added yet.</p>
        )}
      </div>

      <AddSubjectForm 
        isOpen={isModalOpen} 
        closeModal={() => setIsModalOpen(false)} 
        fetchSubjects={fetchSubjects}
      />
    </div>
  );
};

export default AttendanceManagement;