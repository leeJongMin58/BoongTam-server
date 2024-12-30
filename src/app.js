import express from 'express';
import router from './routes/boongRoutes.js';
import mp_router from './routes/mypageRoutes.js';
import LoginRoute from './routes/authRoutes.js'

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.json())

// Routes

app.use('/auth',LoginRoute)
app.use('/boong', router);

app.use('/user', mp_router);

// Default Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

export default app;
