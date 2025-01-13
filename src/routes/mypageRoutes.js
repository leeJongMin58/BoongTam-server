import { Router } from 'express';
import { getUserInfo, updateUserInfo, getUserReview, updateUserReview, deleteUserReview } from '../controllers/mypageController.js';
import { getOrders } from '../controllers/boongOrderController.js'

const router = Router()

// 사용자 정보 조회
router.get('/info', getUserInfo)

// 사용자 정보 수정
router.patch('/info', updateUserInfo);


// 전체 리뷰 조회
router.get('/reviews/:tab', getUserReview);

// 리뷰 아이디에 따른 리뷰 조회
router.get('/reviews/:tab/:reviewId', getUserReview);

// 리뷰 수정
router.put('/reviews/:tab/:reviewId', updateUserReview);

// 리뷰 삭제
router.delete('/reviews/:tab/:reviewId', deleteUserReview);

router.get('/order', getOrders);

export default router