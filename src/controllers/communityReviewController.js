import * as communityReviewService from '../services/communityReviewService.js';
import testvalidateTokenAndUser from '../util/authUtils.js'
import errorCode from '../util/error.js'

export const createStoreReview = async (req, res) => {
    const token = req.headers.authorization;
    const { store_id, review_text, review_rating, review_photos } = req.body;
    
    // 각각의 입력값을 검증하여 세분화된 오류 메시지 제공
    if (!token) {
        return res.status(400).json({ ...errorCode[400], detail: '토큰값을 확인해주세요.' });
    }
    if (!store_id) {
        return res.status(400).json({ ...errorCode[400], detail: '매장 ID값을 확인해주세요.' });
    }
    if (!review_text) {
        return res.status(400).json({ ...errorCode[400], detail: '리뷰 내용을 입력해주세요.' });
    }
    if (!review_rating) {
        return res.status(400).json({ ...errorCode[400], detail: '리뷰 평점을 입력해주세요.' });
    }
    if (!Array.isArray(review_photos)) {
        return res.status(400).json({ ...errorCode[400], detail: '리뷰 사진은 배열 형식이어야 합니다.' });
    }
    try {

        const userId = await testvalidateTokenAndUser(token)
		console.log(userId)
        
        const reviewId = await communityReviewService.createStoreReview(
            store_id, userId, review_text, review_rating, review_photos
        );
        
        res.status(201).json({ code: 201, msg: '리뷰 작성 완료', review_id: reviewId });
    } catch (error) {
        console.error('리뷰 작성 오류:', error.message);
        res.status(error.code || 500).json({ code: error.code || 500, message:error.message, detail: error.detail || '상품 리뷰 작성 중 오류가 발생했습니다.' });
    }
};


export const createGoodsReview = async (req, res) => {
    const token = req.headers.authorization;
    const { goods_id, review_text, review_rating, review_photos } = req.body;


    // 각각의 입력값을 검증하여 세분화된 오류 메시지 제공
    if (!token) {
        return res.status(400).json({ ...errorCode[400], detail: '토큰값을 확인해주세요.' });
    }
    if (!goods_id) {
        return res.status(400).json({ ...errorCode[400], detail: '굿즈 ID값을 확인해주세요.' });
    }
    if (!review_text) {
        return res.status(400).json({ ...errorCode[400], detail: '리뷰 내용을 입력해주세요.' });
    }
    if (!review_rating) {
        return res.status(400).json({ ...errorCode[400], detail: '리뷰 평점을 입력해주세요.' });
    }
    if (!Array.isArray(review_photos)) {
        return res.status(400).json({ ...errorCode[400], detail: '리뷰 사진은 배열 형식이어야 합니다.' });
    }

    try {
        const userId = await testvalidateTokenAndUser(token);
        console.log(userId);

        const reviewId = await communityReviewService.createGoodsReview(
            goods_id, userId, review_text, review_rating, review_photos
        );
        console.log("여기 상품 리뷰:", reviewId);
        res.status(201).json({ code: 201, msg: '상품 리뷰 작성 완료', review_id: reviewId });
    } catch (error) {
        console.error('상품 리뷰 작성 오류:', error.message);
        //res.status(500).json({ ...errorCode[500], detail: error.message });
        res.status(error.code || 500).json({ code: error.code || 500, message:error.message, detail: error.detail || '상품 리뷰 작성 중 오류가 발생했습니다.' });
    }
};
