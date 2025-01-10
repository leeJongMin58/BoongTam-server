import { Router } from 'express';
import { createStoreReview, createGoodsReview, getStoreReviews, getGoodsReviews, getGoodsReviewDetail, getStoreReviewDetail } from '../controllers/communityReviewController.js';

import { createStoreReport } from '../controllers/communityStoreReportController.js'

const router = Router()

// 매장 제보하기 
router.post('/store', createStoreReport)

// 매장 리뷰 작성
router.post('/store/review', createStoreReview)

// 굿즈 리뷰 작성
router.post('/goods/review', createGoodsReview)

// 매장 리뷰 조회
router.get('/sre', getStoreReviews);

// 굿즈 리뷰 조회
router.get('/gre', getGoodsReviews);

// 굿즈 리뷰 상세 조회
router.get('/gre/detail', getGoodsReviewDetail);

// 굿즈 리뷰 상세 조회
router.get('/sre/detail', getStoreReviewDetail);

export default router