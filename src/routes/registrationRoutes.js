import express from 'express';
import { registerUser, loginUser, checkUserId, findUserId, findPassword } from '../controllers/registrationController.js';

const router = express.Router();

// 회원가입
router.post('/sign', registerUser);

// 로그인 
router.post('/', loginUser);

// ID 중복 체크 API
router.post('/check-user-id', checkUserId);
//router.post('/:id', checkUserId)

// ID 찾기 API
router.post('/find-ID', findUserId);

// 비밀번호 찾기 API
router.post('/find-password', findPassword);

export default router;
