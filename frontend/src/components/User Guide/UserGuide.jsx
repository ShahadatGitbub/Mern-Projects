import React, { useState } from 'react';
import './UserGuide.css';

const UserGuide = () => {
  return (
    <div className="how-it-works">
      <h2>Learn More About Process</h2>
      <p className="description">Effortlessly streamline your campus life with these simple steps.</p>
      <div className="steps-container">

        <div className="step">
          <div className="step-icon">1</div>
          <h3>Register</h3>
          <p>Sign up with your email to access all the features of Campus360.</p>
         
        </div>

        <div className="step-connector"></div>

        <div className="step">
          <div className="step-icon">2</div>
          <h3>Login</h3>
          <p>Login with your email to access all the features of Campus360.</p>
          
        </div>

        <div className="step-connector"></div>

        <div className="step">
          <div className="step-icon">3</div>
          <h3>Utilize Tools</h3>
          <p>Manage attendance, materials, and more with our intuitive tools.</p>
         
        </div>
      
      </div>
    </div>
  );
};

export default UserGuide;
