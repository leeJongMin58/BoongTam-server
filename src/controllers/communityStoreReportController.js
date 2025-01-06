import * as communityStoreReportService from '../services/communityStoreReportService.js';
import testvalidateTokenAndUser from '../util/authUtils.js';
import errorCode from '../util/error.js';

export const createStoreReport = async (req, res) => {
    const token = req.headers.authorization;
    const { lat, lng, address, name, store_type, appearance_day, appearance_time, payment_method, is_order_online } = req.body;

    // 입력값 검증
    if (!token) {
        return res.status(401).json({ ...errorCode[401], detail: '인증 토큰이 필요합니다.' });
    }
    if (!lat || !lng || !address || !name || !store_type || !appearance_day || !appearance_time || !payment_method ||! is_order_online) {
        return res.status(400).json({ ...errorCode[400], detail: '필수 필드를 모두 입력해주세요.' });
    }

    try {
        const userId = await testvalidateTokenAndUser(token);

        const reportId = await communityStoreReportService.createStoreReport(
            lat, lng, address, name, store_type, appearance_day, appearance_time, payment_method, is_order_online
        );

        res.status(201).json({ code: 201, msg: '매장 제보 완료', report_id: reportId });
    } catch (error) {
        console.error('매장 제보 오류:', error.message);
        res.status(error.code || 500).json({ code: error.code || 500, message: error.message, detail: error.detail || '매장 제보 중 오류가 발생했습니다.' });
    }
};
