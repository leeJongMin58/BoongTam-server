import { Router } from 'express';
import { createStoreReview, createGoodsReview, getGoodsReviews } from '../controllers/communityReviewController.js';

const router = Router()

// 매장 리뷰 작성
router.post('/store/review', createStoreReview)

// 굿즈 리뷰 작성
router.post('/goods/review', createGoodsReview)

// 굿즈 리뷰 조회
router.get('/goods/reviews', getGoodsReviews);
export default router