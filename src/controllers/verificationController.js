// controllers/verificationController.js
import { sendTokenToSMS } from '../services/smsService.js';
import { saveVerificationCode, verifyCodeInDB } from '../models/verificationModel.js';

// 인증 코드 발송 처리
export const sendVerificationCode = async (req, res) => {
    const { phone } = req.body;

    if (!phone) {
        return res.status(400).json({ error: '전화번호를 입력해주세요.' });
    }

    try {
        // 인증 코드 발송
        const result = await sendTokenToSMS(phone);
        
        // 발송 후 DB에 인증 코드 저장
        if (result.error) {
            return res.status(500).json({ error: '인증 코드 발송 실패' });
        }

        return res.status(200).json({ code: 200, message: '인증 코드가 발송되었습니다.' });
    } catch (err) {
        console.error('인증 코드 발송 실패:', err);
        return res.status(500).json({ error: '인증 코드 발송 실패' });
    }
};

// 인증 코드 확인
export const verifyCode = async (req, res) => {
    const { phone, code } = req.body;

    if (!phone || !code) {
        return res.status(400).json({ error: '전화번호와 인증 코드를 입력해주세요.' });
    }

    // 인증 코드 확인
    const isCodeValid = await verifyCodeInDB(phone, code);

    if (!isCodeValid) {
        return res.status(400).json({ error: '인증 코드가 잘못되었습니다.' });
    }

    return res.status(200).json({ code: 200, message: '인증 코드가 확인되었습니다.' });
};
