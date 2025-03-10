import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">Get in Touch</h1>
        <p className="contact-subtitle">
          We’d love to hear from you! Reach out to us for any inquiries or support.
        </p>

        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              placeholder="Your Full Name"
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Your Email"
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              placeholder="Subject of Your Message"
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Your Message"
              rows="5"
              required
            ></textarea>
          </div>
          <button type="submit" className="contact-btn">
            Send Message
          </button>
        </form>

        <div className="contact-info">
          <h2 className="info-title">Contact Information</h2>
          <p className="info-item">
            <i className="fas fa-envelope"></i> Email: campus360.offl@gmail.com
          </p>
          <p className="info-item">
            <i className="fas fa-phone"></i> Phone: +91 76370 78247
          </p>
          <p className="info-item">
            <i className="fas fa-map-marker-alt"></i> Address: NIT Silchar, Silchar, Assam, 788010
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;