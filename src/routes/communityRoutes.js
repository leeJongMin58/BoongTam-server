import { Router } from 'express';
import { createStoreReview, createGoodsReview, getStoreReviews, getGoodsReviews } from '../controllers/communityReviewController.js';

const router = Router()

// 매장 리뷰 작성
router.post('/store/review', createStoreReview)

// 굿즈 리뷰 작성
router.post('/goods/review', createGoodsReview)

// 매장 리뷰 조회
router.get('/sre', getStoreReviews);

// 굿즈 리뷰 조회
router.get('/gre', getGoodsReviews);

export default router