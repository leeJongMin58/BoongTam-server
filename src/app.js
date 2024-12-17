import express from 'express';
import boongRoutes from './routes/test_boongRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', boongRoutes);



// Default Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
