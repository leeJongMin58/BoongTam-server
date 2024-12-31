import express from 'express'
import boongRoutes from './routes/boongRoutes.js'
import mypageRoutes from './routes/mypageRoutes.js'
import authRoutes from './routes/authRoutes.js'
import goodsRoutes from './routes/goodsRoutes.js'

const app = express()

// Middleware
app.use(express.json())

// Routes
// app.use('/auth', authRoutes)

// 메인
// app.use('/boong', boongRoutes)

// 붕템샵
// app.use('/goods', goodsRoutes)

// 마이페이지
// app.use('/user', mypageRoutes)

// test code
app.get('/test', (req, res) => {
	res.json({ test: 'success' })
})

export default app
