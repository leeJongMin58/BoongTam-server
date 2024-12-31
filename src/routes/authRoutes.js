import express from 'express'
import * as AuthController from '../controllers/authController.js'

// import { Router } from 'express'

const route = express.Router()

// 클라이언트가 서버에 카카오 로그인 요청
route.post('/', AuthController.requestKakaoLogin)

export default route
