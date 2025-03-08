import React, { useState, useContext } from 'react';
import './TestimonialPage.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TestimonialPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [image, setImage] = useState(null); // Store the file object, not the value
  const [testimonial, setTestimonial] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);

  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate(); // Fix: Invoke the hook

  const submitTestimonial = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('role', role);
      formData.append('image', image); // Append the file
      formData.append('testimonial', testimonial);
      formData.append('rating', rating);

      console.log('Submitting form data:', {
        name,
        role,
        testimonial,
        rating,
        image: image ? image.name : 'No file',
      }); // Debug: Log form data

      const response = await axios.post(`${backendUrl}/api/testimonials/add-testimonials`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Backend response:', response.data); // Debug: Log response

      if (response.data.success) {
        toast.success('Testimonial submitted successfully');
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message); // Debug: Log error
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="testimonial-page">
      <div className="page-content">
        <h1>Testimonial Submission</h1>
        <div className="testimonial-form">
          <div className="testimonial-form-content">
            <h2 className="testi-form-title">Testimonial Form</h2>
            <form className="form" onSubmit={submitTestimonial}>
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Enter your role (e.g., Entrepreneur, Designer)"
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="file"
                  id="image"
                  onChange={(e) => setImage(e.target.files[0])} // Get the file object
                  accept="image/*"
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  id="testimonial"
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  placeholder="Share your experience"
                  rows="5"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <select
                  id="rating"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  required
                >
                  <option value="">Select Rating</option>
                  <option value="5">5 - Excellent</option>
                  <option value="4.5">4.5 - Very Good</option>
                  <option value="4">4 - Good</option>
                  <option value="3.5">3.5 - Fair</option>
                  <option value="3">3 - Poor</option>
                  <option value="2.5">2.5 - Very Poor</option>
                  <option value="2">2 - Extremely Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>

              <div className="submit-btn">
                <button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialPage;