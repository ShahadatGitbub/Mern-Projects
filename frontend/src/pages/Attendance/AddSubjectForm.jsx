import React, { useState, useContext } from 'react';
import styles from './AddSubjectForm.module.css';
import add from '../../assets/add.png';
import remove from '../../assets/remove_icon_red.png';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const AddSubjectForm = ({ isOpen, closeModal, fetchSubjects }) => {
  const [subjectName, setSubjectName] = useState('');
  const [attended, setAttended] = useState(0);
  const [missed, setMissed] = useState(0);
  const [loading, setLoading] = useState(false); // Add loading state
  const { backendUrl, userId } = useContext(AppContext);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!userId) {
        toast.error("User ID is missing. Please log in again.");
        return;
      }

      setLoading(true); // Start loading

      const response = await axios.post(`${backendUrl}/api/subjects/add-subject`, {
        userId,
        subjectName,
        attended,
        missed
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        if (fetchSubjects) fetchSubjects();
        closeModal();
        setSubjectName('');
        setAttended(0);
        setMissed(0);
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error(error.response?.data?.message || "Failed to add subject.");
    } finally {
      setLoading(false); // Stop loading regardless of success or error
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
              <button type="submit" disabled={loading}>
                {loading ? (
                  <span className={styles.loader}></span> // CSS-based loader
                ) : (
                  "Add Subject"
                )}
              </button>
              <button type="button" onClick={closeModal} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddSubjectForm;