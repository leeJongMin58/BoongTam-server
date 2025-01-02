import express from 'express'
import * as AuthController from '../controllers/authController.js'
import { body } from 'express-validator'
import { validate } from '../middleware/validator.js'

const validateSignup = [
	body('email').trim().isEmail().withMessage('이메일 형식 확인'),
	validate,
]

const route = express.Router()

// 클라이언트가 서버에 카카오 로그인 요청
route.post('/', AuthController.requestKakaoLogin)
// 회원가입
route.post('/sign', validateSignup, AuthController.signUp)
// 회원탈퇴
route.delete('/quit', AuthController.quit)
// 닉네임 중복 체크
route.get('/:nickname', AuthController.nicknameCheck)
export default route
