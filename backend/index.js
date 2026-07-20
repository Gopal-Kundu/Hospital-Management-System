import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Hospital Management System API is running successfully' });
});

// Connect DB and Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Hospital Management System Backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
