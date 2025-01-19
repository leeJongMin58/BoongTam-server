import express from 'express'
import boongRoutes from './routes/boongRoutes.js'
import mypageRoutes from './routes/mypageRoutes.js'
// import authRoutes from './routes/authRoutes.js'
import goodsRoutes from './routes/goodsRoutes.js'
import communityRoutes from './routes/communityRoutes.js'
import verificationRoutes from './routes/verificationRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'
import cors from 'cors'

//login html
const app = express()

// Middleware
app.use(express.json())
app.use(cors())

// 초기 routes
// app.use('/auth', authRoutes)

// 변경된 Routes
// app.use('/registration', registrationRoutes);
app.use('/auth', registrationRoutes)

//문자 인증
app.use('/verification', verificationRoutes);  

// 메인
app.use('/boong', boongRoutes)

// 붕템샵
app.use('/goods', goodsRoutes)

// 마이페이지
app.use('/user', mypageRoutes)

//커뮤니티
app.use('/community', communityRoutes)

// 붕페이
app.use('/payment', paymentRoutes)

// test code
app.get('/test', (req, res) => {
	res.json({ test: 'success' })
})

// 로그인_테스트용
// app.use(express.static(path.join(__dirname, 'public')));

export default app
