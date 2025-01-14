import jwt from 'jsonwebtoken';
import errorCode from './error.js';

/**
 * JWT 토큰 검증 및 사용자 ID 반환
 * @param {string} token - 클라이언트에서 전달받은 JWT 토큰
 * @returns {Object} - 디코드된 토큰 정보
 * @throws {Error} - 토큰이 유효하지 않거나 만료된 경우
 */
export const verifyToken = async (token) => {
    if (!token) {
        throw {
            status: 401,
            message: errorCode[401]?.msg || '토큰이 제공되지 않았습니다.',
        };
    }

    try {
        // JWT 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded; // 디코드된 토큰 반환
    } catch (error) {
        const status = error.name === 'TokenExpiredError' ? 403 : 401;

        throw {
            status,
            message: error.name === 'TokenExpiredError'
                ? '토큰이 만료되었습니다.'
                : '유효하지 않은 토큰입니다.',
        };
    }
};
