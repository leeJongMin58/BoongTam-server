import { Router } from "express";
import { getTrackingHistory } from "../controllers/boongController.js";
const router = Router();


// 택배 조회 api 
router.get("/post", getTrackingHistory);
   


// 메인굿즈
router.get('/goods')
// 핫붕템
router.get('/hotitems')
//장바구니
router.get('/cart')
//결제하기
router.post('/checkout')
//구매내역
router.get('/history')
//구매내역상세보기
router.get('/orders/:order_id')
//굿즈상세보기
router.get('/goods/:goods_id')
//교환반품신청페이지
router.get('')
//교환신청페이지
//반품신청페이지


  
  export default router;