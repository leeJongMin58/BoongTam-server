import express from 'express';
import boongRoutes from './routes/test_boongRoutes.js';
import mapRoutes from './routes/test_mapRoutes.js';

const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/api', boongRoutes);

// Routes
app.use('/main', mapRoutes); // 기존 BASE_URL을 '/main'으로 설정

// Default Error Handling
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal Server Error',
	})
})

export default app
