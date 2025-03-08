import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: "📈",
      title: "Real-Time Attendance",
      description: "Track and manage your attendance effortlessly with real-time updates and seamless automation."
    },
    {
      icon: "📚",
      title: "Organized Materials",
      description: "Keep all your study materials in one place, neatly categorized for easy access anytime."
    },
   
    {
      icon: "💻",
      title: "User-Friendly Interface",
      description: "Enjoy a clean, intuitive interface designed to enhance your experience and productivity."
    },
    {
      icon: "🔒",
      title: "Secure and Reliable",
      description: "Your data is safe with us. Experience secure storage and reliable access to all your resources."
    }
  ];

  return (
    <div className="feature-container">
      <h2 className="feature-heading">Why Choose Us?</h2>
      <div className="feature-items">
        {features.map((feature, index) => (
          <div className="feature-item" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default Features;
