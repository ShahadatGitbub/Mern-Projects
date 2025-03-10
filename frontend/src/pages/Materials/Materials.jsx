import React from 'react';
import './Materials.css';

const Materials = () => {
  return (
    <div className="materials-container">
      <div className="construction-wrapper">
        <div className="construction-icon">
          <svg
            width="100"
            height="100"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              fill="#f39c12"
            />
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z"
              fill="#fff"
            />
          </svg>
        </div>
        <h1 className="construction-title">Under Construction</h1>
        <p className="construction-message">
          We're working hard to bring you this content. Check back soon!
        </p>
        <div className="construction-progress">
          <div className="progress-bar"></div>
        </div>
        <button className="back-btn" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Materials;