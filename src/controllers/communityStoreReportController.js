import * as communityStoreReportService from '../services/communityStoreReportService.js';
import testvalidateTokenAndUser from '../util/authUtils.js';
import errorCode from '../util/error.js';

// 유효한 요일 목록
const VALID_DAYS = ['월', '화', '수', '목', '금', '토', '일'];

export const createStoreReport = async (req, res) => {
    const userId=req.user.id;
    // 오픈 시간, 마감 시간으로 나눔
    const { lat, lng, address, name, store_type, appearance_day, open_hour, close_hour, payment_method, is_order_online } = req.body;

    // 입력값 검증
    if (!userId) {
        return res.status(401).json({ ...errorCode[401], detail: '인증 토큰이 필요합니다.' });
    }
    // is_order_online은 boolean이라 이쪽 검증에서 검증하면 안 됨
    if (!lat || !lng || !address || !name || !store_type || !open_hour || !close_hour || !appearance_day || !payment_method) {
        return res.status(400).json({ ...errorCode[400], detail: '필수 필드를 모두 입력해주세요.' });
    }
    if (typeof is_order_online !== 'boolean') {
        return res.status(400).json({ ...errorCode[400], detail: 'is_order_online 필드는 true 또는 false 값이어야 합니다.' });
    }

    // appearance_day 검증
    if (!Array.isArray(appearance_day)) {
        return res.status(400).json({ ...errorCode[400], detail: 'appearance_day는 배열이어야 합니다.' });
    }

    const invalidDays = appearance_day.filter(day => !VALID_DAYS.includes(day)); // 유효한 요일인지
    if (invalidDays.length > 0) {
        return res.status(400).json({
            ...errorCode[400],
            detail: `유효하지 않은 요일이 포함되어 있습니다: ${invalidDays.join(', ')}`
        });
    }

    try {
        const { storeId, msg } = await communityStoreReportService.createStoreReport(
            lat, lng, address, name, store_type, appearance_day, open_hour, close_hour, payment_method, is_order_online
        );

        res.status(201).json({ code: 201, msg, report_id: storeId });
    } catch (error) {
        console.error('매장 제보 오류:', error.message);
        res.status(error.code || 500).json({ code: error.code || 500, message: error.message, detail: error.detail || '매장 제보 중 오류가 발생했습니다.' });
    }
};
