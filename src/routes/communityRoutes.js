import { Router } from 'express';
import { createStoreReview, createGoodsReview, getStoreReviews, getGoodsReviews, getGoodsReviewDetail, getStoreReviewDetail } from '../controllers/communityReviewController.js';
import { createStoreReport } from '../controllers/communityStoreReportController.js'
import { ReviewLikeController } from '../controllers/reviewLikeController.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router()

// 매장 제보하기 
router.post('/store', authenticateToken, createStoreReport)

// 매장 리뷰 작성
router.post('/store/review', authenticateToken, createStoreReview)

// 굿즈 리뷰 작성
router.post('/goods/review', authenticateToken, createGoodsReview)

// 하트 토글
router.patch('/re/like',authenticateToken, ReviewLikeController.updateLikeStatus);

// 매장 리뷰 조회
router.get('/sre', authenticateToken, getStoreReviews);

// 굿즈 리뷰 조회
router.get('/gre', authenticateToken, getGoodsReviews);

// 굿즈 리뷰 상세 조회
router.get('/gre/detail', authenticateToken, getGoodsReviewDetail);

// 굿즈 리뷰 상세 조회
router.get('/sre/detail', authenticateToken, getStoreReviewDetail);

export default router