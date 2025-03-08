import React, { useState, useEffect } from 'react';
import './AttendanceManagement.css'; 
import Subject from './Subject';
import AddSubjectForm from './AddSubjectForm';

const AttendanceManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/subjects');
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

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
        {subjects.map((subject) => (
          <Subject
            key={subject.id} // Ensure unique key
            id={subject.id}
            title={subject.subject_name}
            attended={subject.classes_attended}
            missed={subject.classes_missed}
            fetchSubjects={fetchSubjects} // Refresh the list after delete
          />
        ))}
      </div>

      <AddSubjectForm isOpen={isModalOpen} closeModal={() => setIsModalOpen(false)} fetchSubjects={fetchSubjects} />
    </div>
  );
};

export default AttendanceManagement;
