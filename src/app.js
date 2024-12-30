import express from 'express'
import boongRoutes from './routes/boongRoutes.js'
import mypageRoutes from './routes/mypageRoutes.js'
import authRoutes from './routes/authRoutes.js'
import goodsRoutes from './routes/goodsRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import cors from 'cors'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// Middleware
app.use(express.json())
app.use(cors())
// Routes
app.use('/auth', authRoutes)

// 메인
app.use('/boong', boongRoutes)

// 붕템샵
app.use('/goods', goodsRoutes)

// 마이페이지
app.use('/user', mypageRoutes)

//로그인
app.use(express.static(path.join(__dirname, 'public')))

// Default Error Handling
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal Server Error',
	})
})

export default app
