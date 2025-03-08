// routes/testimonial.router.js
import express from 'express';
import { addTestimonial, getTestimonials } from '../controllers/testimonial.controllers.js';
import multer from 'multer';

const testimonialRouter = express.Router();

const storage = multer.diskStorage({
    destination: "uploads/testimonials",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage});

testimonialRouter.post('/add-testimonials', upload.single('image'), addTestimonial);
testimonialRouter.get('/get-testimonials', getTestimonials);

export default testimonialRouter;