
import React from 'react';
import './ProfileCard.css';

const ProfileCard = () => {
  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <div className="profile-header">
          <button className="connect-btn">
            <span className="icon">👥</span> Connect
          </button>
          <div className="profile-pic">
            <img src="https://via.placeholder.com/100" alt="Profile" />
          </div>
          <button className="message-btn">
            <span className="icon">💬</span> Message
          </button>
        </div>
        <div className="profile-info">
          <h2>Samantha Jones</h2>
          <p className="location">New York, United States</p>
          <p className="occupation">Web Producer - Web Specialist</p>
          <p className="school">Columbia University - New York</p>
        </div>
        <hr />
        <div className="profile-stats">
          <div className="stat">
            <span className="number">65</span>
            <span className="label">Friends</span>
          </div>
          <div className="stat">
            <span className="number">43</span>
            <span className="label">Photos</span>
          </div>
          <div className="stat">
            <span className="number">21</span>
            <span className="label">Comments</span>
          </div>
        </div>
        <button className="show-more-btn">Show More</button>
      </div>
    </div>
  );
};

export default ProfileCard;