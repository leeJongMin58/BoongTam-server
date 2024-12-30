import * as mp_service from '../models/mypageModel.js';
import { fetchUserFromKakao } from '../services/mypageService.js';

// 사용자 정보 조회
export const getUserInfo = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ msg: '토큰이 제공되지 않았습니다.' });
    }

    try {
        // 카카오 API에서 사용자 ID 가져오기
        const userid = await fetchUserFromKakao(token);

        // DB에서 사용자 정보 가져오기
        const userInfo = await mp_service.getUserInfo(userid);

        res.status(200).json({
            code: 200,
            msg: '사용자 정보 조회 성공',
            data: userInfo,
        });
    } catch (error) {
        console.error('서버 오류:', error.message);
        res.status(500).json({ msg: '서버 오류', error: error.message });
    }
};