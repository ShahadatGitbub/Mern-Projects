import React, { useState, useEffect, useContext } from 'react';
import './Testimonial.css';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/testimonials/get-testimonials`);
        setTestimonials(response.data);
      } catch (err) {
        setError('Failed to load testimonials. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [backendUrl]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  if (loading) return <div className="testimonials-container">Loading...</div>;
  if (error) return <div className="testimonials-container">{error}</div>;
  if (testimonials.length === 0) {
    return (
      <div className="testimonials-container">
        <div className="testi-content">
          <h2 className="testimonials-title">Testimonials</h2>
          <p className="testimonials-subtitle">No testimonials available yet.</p>
          <button className="add-testimonial-btn" onClick={() => navigate('/add-testimonials')}>
            Add Your Testimonial
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonials-container">
      <div className="testi-content">
        <button className="prev-btn" onClick={handlePrev}>&lt;</button>
        <h2 className="testimonials-title">Testimonials</h2>
        <p className="testimonials-subtitle">See what people are saying.</p>

        <div className="testimonial-wrapper">
          <div className="testimonial-content">
            <div className="testimonial-image">
              <img
                src={`${backendUrl.replace(/\/$/, '')}/uploads/${testimonials[currentIndex].image.replace(/^\/?/, '')}`}
                alt={testimonials[currentIndex].name}
              />
              <h3 className="testimonial-name">{testimonials[currentIndex].name}</h3>
              <span className="testimonial-role">{testimonials[currentIndex].role}</span>
            </div>
            <div className="testimonial-text">
              <p className="testimonial-review">"{testimonials[currentIndex].testimonial}"</p>
              <div className="testimonial-rating">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
            </div>
          </div>
        </div>

        <button className="next-btn" onClick={handleNext}>&gt;</button>
        <button className="add-testimonial-btn" onClick={() => navigate('/add-testimonials')}>
          Add Your Testimonial
        </button>
      </div>
    </div>
  );
};

const renderStars = (rating) => {
  let fullStars = Math.floor(rating);
  let halfStar = rating % 1 >= 0.5 ? 1 : 0;
  let emptyStars = 5 - fullStars - halfStar;

  return [
    ...Array(fullStars).fill(<i className="fa fa-star"></i>),
    halfStar ? <i className="fa fa-star-half-alt"></i> : null,
    ...Array(emptyStars).fill(<i className="fa fa-star-o"></i>)
  ].filter(Boolean);
};

export default Testimonial;
