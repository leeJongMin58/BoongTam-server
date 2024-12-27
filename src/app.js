import express from 'express';
import router from './routes/boongRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/boong', router);


// Default Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
