// models/verificationModel.js
import { getDB } from '../database/connection.js';

// 인증 코드 저장
export const saveVerificationCode = async (phone, code) => {
    const query = 'REPLACE INTO verification_codes (phone_number, code) VALUES (?, ?)';
    const connection = await getDB();

    try {
        await connection.execute(query, [phone, code]);
    } catch (error) {
        console.error('인증 코드 저장 실패:', error);
    }
};

// 인증 코드 확인
export const verifyCodeInDB = async (phone, code) => {
    const query = 'SELECT * FROM verification_codes WHERE phone_number = ? AND code = ?';
    const connection = await getDB();

    try {
        const [result] = await connection.execute(query, [phone, code]);
        return result.length > 0;  // 인증 코드가 일치하면 true 반환
    } catch (error) {
        console.error('인증 코드 확인 실패:', error);
        return false;
    }
};
