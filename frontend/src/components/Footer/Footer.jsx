import React from "react";
import { Link } from "react-router-dom";
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">

        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/attendance">Attendance</Link></li>
            <li><Link to="/materials">Materials</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <p>Email: support@campus360.com</p>
          <p>Phone: +1 234 567 890</p>
          <p>Address: 123 Campus Street, Education City</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 Campus360. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
