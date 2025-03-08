import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String, // Store the path or URL to the uploaded image
    required: true,
  },
  testimonial: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    enum: [5, 4.5, 4, 3.5, 3, 2.5, 2, 1], // Match the form's rating options
    min: 1,
    max: 5,
  },

}, {timestamps: true });

// Ensure the model is not recreated multiple times
const TestimonialModel = mongoose.models.Testimonials || mongoose.model('Testimonial', testimonialSchema);

export default TestimonialModel;