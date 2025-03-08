// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import mongoDBConnection from './config/dbConnection.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import testimonialRouter from './routes/testimonial.router.js';
import fs from 'fs';
import path from 'path';

const app = express();
const port = process.env.PORT || 4000;

mongoDBConnection();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5175'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);



app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/testimonials', testimonialRouter);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
