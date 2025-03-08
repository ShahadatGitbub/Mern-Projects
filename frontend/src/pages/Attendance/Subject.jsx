import React, { useState, useEffect } from 'react';
import './Subject.css';

const Subject = ({ id, title, attended, missed, fetchSubjects }) => {
  const [attendedClass, setAttendedClass] = useState(attended);
  const [missedClass, setMissedClass] = useState(missed);
  const [progress, setProgress] = useState(0);
  const [strokeColor, setStrokeColor] = useState("#4caf50");
  const [comment, setComment] = useState("");
  const [percentage, setPercentage] = useState(0);

  const resetAttendance = () => {
    setAttendedClass(0);
    setMissedClass(0);
  };

  const deleteSubject = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log("Subject deleted successfully");
        fetchSubjects(); // Refresh subject list after deletion
      } else {
        console.error('Failed to delete subject');
      }
    } catch (error) {
      console.error('Error deleting subject:', error);
    }
  };

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
          <button onClick={() => setAttendedClass(prev => prev + 1)}>+</button>
          <button onClick={() => setMissedClass(prev => prev + 1)}>-</button>
        </div>
        <div className="reset-subject-btn">
          <button onClick={resetAttendance}>Reset</button>
        </div>
        <div className="remove-subject-btn">
          <button onClick={deleteSubject}>Delete</button>
        </div>
      </div>
    </div>
  );
};

export default Subject;
