// server.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import mongoDBConnection from './config/dbConnection.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import testimonialRouter from './routes/testimonial.router.js';
import subjectRouter from './routes/subjectRoutes.js';

import path from 'path'

const app = express();
const port = process.env.PORT || 4000;

const _dirname = path.resolve();

mongoDBConnection();

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [process.env.CLIENT_URL || 'http://localhost:5174', 'http://localhost:5175', 'https://campus-360-shahadat.onrender.com'];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);



app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

//accesing profilepic in frontend
app.use('/profile-images', express.static('uploads/users'));
 //we can access profile pics by localhost:4000/profile-images/{filename}

app.use('/api/testimonials', testimonialRouter);
app.use('/api/subjects', subjectRouter);

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get("*", (req,res) =>{
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

app.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
