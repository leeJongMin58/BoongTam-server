import { Router } from 'express'
import * as GoodsController from '../controllers/goodsController.js'
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = Router()
//굿즈
router.get('/', authenticateToken, GoodsController.getGoods)

//인기 굿즈
router.get('/hotitems', authenticateToken, GoodsController.getHotitems)

//장바구니
router.get('/cart', authenticateToken, GoodsController.cart)

//장바구니 담기
router.post('/cart', authenticateToken, GoodsController.addCart)

//장바구니 삭제
router.delete('/cart', authenticateToken, GoodsController.removeFromCart)

//결제
router.get('/checkout/:cart_id', GoodsController.checkout)

// 구매내역
router.get('/purchase-history', authenticateToken, GoodsController.purchaseHistory)

//굿즈 상세보기
router.get('/goodsDetail/:goods_id', authenticateToken, GoodsController.goodsDetail)

//구매내역 상세보기
router.get(
	'/purchase-history/:purchase_id', authenticateToken, 
	GoodsController.purchaseHistoryDetail,
)

//교환 신청페이지
router.get('/exchange/:purchase_id', authenticateToken, GoodsController.exchange)
router.post('/exchange', authenticateToken, GoodsController.postExchange)

// 반품 신청 페이지
router.get('/Retrun/:purchase_id', authenticateToken, GoodsController.Return)
router.post('/Return', authenticateToken, GoodsController.postReturn)

export default router
