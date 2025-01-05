import { Router } from 'express';
import { createStoreReview, createGoodsReview } from '../controllers/communityReviewController.js';

const router = Router()

// 매장 리뷰 작성
router.post('/store/review', createStoreReview)

// 굿즈 리뷰 작성
router.post('/goods/review', createGoodsReview)


export default router