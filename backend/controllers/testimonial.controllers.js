// controllers/testimonial.controllers.js
import TestimonialModel from '../models/testimonialModel.js';
import fs from 'fs';

export const addTestimonial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    const { name, role, testimonial, rating } = req.body;
    const imagePath = `testimonials/${req.file.filename}`;

    const newTestimonial = new TestimonialModel({
        name,
        role,
        image: imagePath, // Store correct path
        testimonial,
        rating
    });

    await newTestimonial.save();
    res.json({ success: true, message: 'Testimonial added successfully!' });

  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

export const getTestimonials = async (req, res) => {
  try {
    const testimonials = await TestimonialModel.find();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};
