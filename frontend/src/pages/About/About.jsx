import React, { useState } from "react";
import "./About.css";
import founder from '/founder.jpg';
import faqs from '../../assets/faq';



const About = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="about-page">
      {/* About Banner */}
      <div className="about-banner">
        <h1>Welcome to Campus360</h1>
        <p>Your ultimate platform to streamline campus life.</p>
      </div>

      <div className="about-content">
      <section className="section founder">
          <h2 className="section-heading">Website Owner & Creator</h2>
          <div className="founder-info">
            <div className="founder-image">
              <img src={founder} alt="Founder" />
            </div>
            <div className="founder-details">
              <h3>Shahadat Ali</h3>
              <p>
                I am currently pursuing a Bachelor of Technology (B.Tech) in Computer Science and Engineering (CSE) at the National Institute of Technology (NIT) Silchar. As a proud alumnus of Jawahar Navodaya Vidyalaya (JNV) Barpeta, where I completed my schooling from classes 6 to 12, I have always been passionate about leveraging technology to solve real-world problems. With an expected graduation year of 2027, I am dedicated to developing innovative solutions like Campus360 to enhance student experiences and simplify academic life.
              </p>
            </div>
          </div>
        </section>
        
        {/* Who We Are */}
        <section className="section">
          <h2 className="section-heading">Who We Are</h2>
          <p>
            Campus360 is an innovative platform designed to revolutionize campus life for college students. We aim to simplify the management of attendance, organize study materials efficiently, and provide a one-stop solution for all academic needs. With an intuitive design and user-friendly interface, Campus360 is committed to creating a seamless and productive experience for students.
          </p>
        </section>

        {/* Vision and Mission */}
        <div className="about-row">
          <section className="section half">
            <h2 className="section-heading">Our Vision</h2>
            <p>
              We envision a future where every college student can thrive in an organized and distraction-free environment. Campus360 aspires to become the go-to platform for students seeking to simplify their academic journey while maximizing efficiency and productivity.
            </p>
          </section>
          <section className="section half">
            <h2 className="section-heading">Our Mission</h2>
            <p>
              Our mission is to empower students with smart tools to manage their academic life effortlessly. By combining technology and simplicity, Campus360 strives to minimize the stress of campus management, allowing students to focus on their personal growth and academic achievements.
            </p>
          </section>
        </div>

       
       
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="faq-heading">Frequently Asked Questions</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openFaq === index ? "open" : ""}`}>
              <div className="faq-question" onClick={() => toggleFaq(index)}>
                {faq.question}
                <span className="faq-icon">{openFaq === index ? "−" : "+"}</span>
              </div>
              <div className={`faq-answer ${openFaq === index ? "visible" : ""}`}>
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;