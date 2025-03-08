import React, { useState } from 'react';
import styles from './AddSubjectForm.module.css';
import add from '../../assets/add.png';
import remove from '../../assets/remove_icon_red.png';

const AddSubjectForm = ({ isOpen, closeModal, fetchSubjects }) => {
  const [subjectName, setSubjectName] = useState('');
  const [attended, setAttended] = useState(0);
  const [missed, setMissed] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjectName.trim() === '') return;

    const newSubject = {
      subject_name: subjectName,
      classes_attended: attended,
      classes_missed: missed,
    };

    try {
      const response = await fetch('http://localhost:5000/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubject),
      });

      if (response.ok) {
        fetchSubjects(); // Refresh subjects
        closeModal();
        setSubjectName('');
        setAttended(0);
        setMissed(0);
      } else {
        console.error('Failed to add subject');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    isOpen && (
      <div className={styles.addSubjectModalOverlay}>
        <div className={styles.addSubjectModalContainer}>
          <h2>Add Subject</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.addSubjectInputField}>
              <input
                type="text"
                placeholder="Enter Subject Name"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                required
              />
            </div>
            <div className={styles.addSubjectAttendanceControls}>
              <div className={styles.attendanceControl}>
                <div className={styles.btnContainer}>
                  <button type="button" onClick={() => setAttended(Math.max(0, attended - 1))}>
                    <img src={remove} alt="Remove" />
                  </button>
                  <span className={styles.attendanceCount}>{attended}</span>
                  <button type="button" onClick={() => setAttended(attended + 1)}>
                    <img src={add} alt="Add" />
                  </button>
                </div>
                <h4>Attended class</h4>
              </div>

              <div className={styles.attendanceControl}>
                <div className={styles.btnContainer}>
                  <button type="button" onClick={() => setMissed(Math.max(0, missed - 1))}>
                    <img src={remove} alt="Remove" />
                  </button>
                  <span className={styles.attendanceCount}>{missed}</span>
                  <button type="button" onClick={() => setMissed(missed + 1)}>
                    <img src={add} alt="Add" />
                  </button>
                </div>
                <h4>Missed class</h4>
              </div>
            </div>

            <div className={styles.addSubjectModalButtons}>
              <button type="submit">Add Subject</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddSubjectForm;
