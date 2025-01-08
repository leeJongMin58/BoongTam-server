import { Router } from 'express';
import { createStoreReview, createGoodsReview } from '../controllers/communityReviewController.js';
import { ReviewLikeController } from '../controllers/reviewLikeController.js'

const router = Router()

// 매장 리뷰 작성
router.post('/store/review', createStoreReview)

// 굿즈 리뷰 작성
router.post('/goods/review', createGoodsReview)

// 하트 토글
router.patch('/re/like', ReviewLikeController.updateLikeStatus);

export default router