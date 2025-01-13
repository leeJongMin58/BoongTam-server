import * as communityReviewService from '../services/communityReviewService.js';
import testvalidateTokenAndUser from '../util/authUtils.js'
import errorCode from '../util/error.js'

// 매장 리뷰 작성
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

// 굿즈 리뷰 작성
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

// 매장 리뷰 조회
export const getStoreReviews = async (req, res) => {
    const token = req.headers.authorization;  // 토큰을 요청 헤더에서 추출

    // 토큰이 없을 경우 오류 응답
    if (!token) {
        return res.status(400).json({ ...errorCode[400], detail: '토큰값을 확인해주세요.' });
    }
    const userId = await testvalidateTokenAndUser(token);
    console.log(userId); // 필요한 경우 로그 출력

    const { sort = 'latest', count = 5 } = req.query;

    try {
        const reviews = await communityReviewService.getStoreReviews(sort, count);
        res.status(200).json({
            code: 200,
            msg: '리뷰 조회 성공',
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.error('리뷰 조회 오류:', error.message);
        res.status(error.code || 500).json({ code: error.code || 500, message:error.message, detail: error.detail || '매장 리뷰 조회 중 오류가 발생했습니다.' });
    }
};

// 굿즈 리뷰 조회
export const getGoodsReviews = async (req, res) => {
    const token = req.headers.authorization;  // 토큰을 요청 헤더에서 추출

    // 토큰이 없을 경우 오류 응답
    if (!token) {
        return res.status(400).json({ ...errorCode[400], detail: '토큰값을 확인해주세요.' });
    }
    const userId = await testvalidateTokenAndUser(token);
    console.log(userId); // 필요한 경우 로그 출력

    const { sort = 'latest', count = 5 } = req.query;

    try {
        const reviews = await communityReviewService.getGoodsReviews(sort, count);
        res.status(200).json({
            code: 200,
            msg: '리뷰 조회 성공',
            count: reviews.length,
            data: reviews,
        });
    } catch (error) {
        console.error('리뷰 조회 오류:', error.message);
        res.status(error.code || 500).json({ code: error.code || 500, message:error.message, detail: error.detail || '굿즈 리뷰 조회 중 오류가 발생했습니다.' });
    }
};


// 굿즈 리뷰 상세 리스트 조회
export const getGoodsReviewDetail = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({ ...errorCode[400], detail: '토큰값을 확인해주세요.' });
    }

    try {
        const userId = await testvalidateTokenAndUser(token);
        console.log(userId); // 로그 출력

        const { sort = 'latest', count = 10 } = req.query;
        const reviews = await communityReviewService.getGoodsReviewDetail(sort, count);

        res.status(200).json({
            code: 200,
            msg: '리뷰 상세 조회 성공',
            count: reviews.length,
            nextPage: false, // 페이징이 있다면 로직 수정
            data: reviews,
        });
    } catch (error) {
        console.error('굿즈 리뷰 상세 조회 오류:', error.message);
        res.status(error.code || 500).json({
            code: error.code || 500,
            message: error.message,
            detail: error.detail || '굿즈 리뷰 상세 조회 중 오류가 발생했습니다.',
        });
    }
};


export const getStoreReviewDetail = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({ ...errorCode[400], detail: '토큰값을 확인해주세요.' });
    }

    try {
        const userId = await testvalidateTokenAndUser(token);
        console.log(userId); // 로그 출력

        const { sort = 'latest', count = 10 } = req.query;
        const reviews = await communityReviewService.getStoreReviewDetail(sort, count);

        res.status(200).json({
            code: 200,
            msg: '리뷰 상세 조회 성공',
            count: reviews.length,
            nextPage: false, // 페이징이 있다면 로직 수정
            data: reviews,
        });
    } catch (error) {
        console.error('굿즈 리뷰 상세 조회 오류:', error.message);
        res.status(error.code || 500).json({
            code: error.code || 500,
            message: error.message,
            detail: error.detail || '굿즈 리뷰 상세 조회 중 오류가 발생했습니다.',
        });
    }
};

