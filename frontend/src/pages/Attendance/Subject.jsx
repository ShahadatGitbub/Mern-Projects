import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import './Subject.css'
import { AppContext } from '../../context/AppContext';
import axios from 'axios';

const Subject = ({ id, title, attended, missed, fetchSubjects }) => {
  const [attendedClass, setAttendedClass] = useState(attended);
  const [missedClass, setMissedClass] = useState(missed);
  const [progress, setProgress] = useState(0);
  const [strokeColor, setStrokeColor] = useState("#4caf50");
  const [comment, setComment] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showResetPopup, setShowResetPopup] = useState(false); // New state for reset popup
  const [loading, setLoading] = useState(false); // Loading state for both delete and reset
  const { backendUrl, userId } = useContext(AppContext);

  // Function to update subject in backend
  const updateSubject = async (newAttended, newMissed) => {
    try {
      const response = await axios.post(`${backendUrl}/api/subjects/update-subject`, {
        subjectId: id,
        attended: newAttended,
        missed: newMissed
      });
    } catch (error) {
      console.error("Error updating subject:", error);
      toast.error("Error updating attendance");
    }
  };

  // Handle incrementing attended classes
  const handleAttendedIncrement = () => {
    const newAttended = attendedClass + 1;
    setAttendedClass(newAttended);
    updateSubject(newAttended, missedClass);
  };

  // Handle incrementing missed classes
  const handleMissedIncrement = () => {
    const newMissed = missedClass + 1;
    setMissedClass(newMissed);
    updateSubject(attendedClass, newMissed);
  };

  // Show reset popup instead of resetting directly
  const resetAttendance = () => {
    setShowResetPopup(true);
  };

  // Confirm reset and update backend
  const confirmReset = async () => {
    setLoading(true); // Start loading
    try {
      await updateSubject(0, 0); // Update backend with reset values
      setAttendedClass(0);
      setMissedClass(0);
      toast.success("Attendance reset successfully");
      setShowResetPopup(false);
    } catch (error) {
      console.error("Error resetting attendance:", error);
      toast.error("Error resetting attendance");
      setShowResetPopup(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Delete subject from backend
  const confirmDelete = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.delete(`${backendUrl}/api/subjects/delete-subject/${id}`, {
        data: { userId } // Send userId in the body
      });
      if (response.data.message === "Subject deleted successfully") {
        toast.success("Subject deleted successfully");
        fetchSubjects(); // Refresh subject list in parent component
        setShowDeletePopup(false);
      } else {
        toast.error("Failed to delete subject");
      }
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error(error.response?.data?.message || "Error deleting subject");
      setShowDeletePopup(false);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Calculate percentage, progress, and comments
  useEffect(() => {
    const totalClass = attendedClass + missedClass;

    if (totalClass === 0) {
      setPercentage(0);
      setProgress(0);
      setComment("");
      return;
    }

    const calculatedPercentage = ((attendedClass / totalClass) * 100).toFixed(2);
    setPercentage(calculatedPercentage);

    if (calculatedPercentage < 75) {
      setStrokeColor("#f44336");
    } else if (calculatedPercentage == 75) {
      setStrokeColor("#ffeb3b");
    } else {
      setStrokeColor("#4caf50");
    }

    const requiredAttended = Math.ceil(0.75 * totalClass);

    if (calculatedPercentage == 75) {
      setComment("You must attend the next class!");
    } else if (calculatedPercentage < 75) {
      let needToAttend = requiredAttended - attendedClass;
      setComment(`You must attend the next ${needToAttend} class${needToAttend !== 1 ? 'es' : ''}!`);
    } else {
      let maxMissable = Math.floor((attendedClass / 0.75) - totalClass);
      if (maxMissable > 0) {
        setComment(`You can miss the next ${maxMissable} class${maxMissable !== 1 ? 'es' : ''}!`);
      } else {
        setComment("You must attend next class!");
      }
    }

    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    setProgress((calculatedPercentage / 100) * circumference);
  }, [attendedClass, missedClass]);

  return (
    <div className="subject-box">
      <div className="subject-title">
        <h2>{title}</h2>
      </div>

      <div className="attendance-data-container">
        <div className="attendance-data">
          <p><b>Attended :</b> <span>{attendedClass}</span></p>
          <p><b>Missed :</b> <span>{missedClass}</span></p>
          <p><b>Total :</b> <span>{attendedClass + missedClass}</span></p>
        </div>

        <div className="attendance-report-circle">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#ddd" strokeWidth="8" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={strokeColor}
              strokeWidth="8"
              fill="none"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 - progress}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="55" textAnchor="middle">{percentage}%</text>
          </svg>
        </div>
      </div>

      <div className="comment-box">
        <p>{comment}</p>
      </div>

      <div className="attendance-control-btns">
        <div className="attendace-btns">
          <button onClick={handleAttendedIncrement}>+</button>
          <button onClick={handleMissedIncrement}>-</button>
        </div>
        <div className="reset-subject-btn">
          <button onClick={resetAttendance}>Reset</button> {/* Trigger reset popup */}
        </div>
        <div className="remove-subject-btn">
          <button onClick={() => setShowDeletePopup(true)}>Delete</button>
        </div>
      </div>

      {showDeletePopup && (
        <div className="delete-popup">
          <div className="delete-popup-content">
            <h3>Are you sure you want to delete this subject?</h3>
            <p>This action cannot be undone.</p>
            <div className="delete-popup-buttons">
              <button 
                className="cancel-btn" 
                onClick={() => setShowDeletePopup(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn" 
                onClick={confirmDelete}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetPopup && (
        <div className="delete-popup reset-popup"> {/* Reuse delete-popup with a new class */}
          <div className="delete-popup-content reset-popup-content">
            <h3>Are you sure you want to reset attendance?</h3>
            <p>This will set attended and missed classes to 0.</p>
            <div className="delete-popup-buttons">
              <button 
                className="cancel-btn" 
                onClick={() => setShowResetPopup(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className="confirm-btn reset-confirm-btn" 
                onClick={confirmReset}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subject;