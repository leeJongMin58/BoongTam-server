import express from 'express';
import LoginRoute from './routes/LoginRoute.js'
import { connectDB } from './database/connection.js';
import cors from 'cors';
const app = express();
//db연결
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use('/api', LoginRoute);

// Default Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;