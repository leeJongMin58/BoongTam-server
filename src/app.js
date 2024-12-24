import express from 'express';
import boongRoutes from './routes/LoginRoute.js';
import goodsRoutes from './routes/goodsRoutes.js'
import { connectDB } from './database/connection.js';

///
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
//db연결
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
// Routes
app.use('/api', boongRoutes);

// 붕템샵 
app.use('/goods',goodsRoutes);

//로그인
app.use(express.static(path.join(__dirname, 'public')));




// Default Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
