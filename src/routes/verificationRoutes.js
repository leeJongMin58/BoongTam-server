// routes/verificationRoutes.js
import express from 'express';
import { sendVerificationCode, verifyCode } from '../controllers/verificationController.js';

const router = express.Router();

// 인증 코드 발송 엔드포인트
router.post('/send-code', sendVerificationCode);

// 인증 코드 확인 엔드포인트
router.post('/verify-code', verifyCode);

export default router;
