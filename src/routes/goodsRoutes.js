import { Router } from 'express'
import * as GoodsController from '../controllers/goodsController.js'

const router = Router()
//굿즈
router.get('/', GoodsController.getGoods)
//인기 굿즈
router.get('/hotitems', GoodsController.getHotitems)
//장바구니
router.get('/cart', GoodsController.cart)
//장바구니 담기
router.post('/cart', GoodsController.addCart)
//장바구니 삭제
router.delete('/cart', GoodsController.removeFromCart)
//결제
router.get('/checkout/:cart_id', GoodsController.checkout)
// 구매내역
router.get('/purchase-history', GoodsController.purchaseHistory)
//굿즈 상세보기
router.get('/goodsDetail/:goods_id', GoodsController.goodsDetail)
//구매내역 상세보기
router.get(
	'/purchase-history/:purchase_id',
	GoodsController.purchaseHistoryDetail,
)
//교환 신청페이지
router.get('/exchange/:purchase_id', GoodsController.exchange)
router.post('/exchange', GoodsController.postExchange)
// 반품 신청 페이지
router.get('/Retrun/:purchase_id', GoodsController.Return)
router.post('/Return', GoodsController.postReturn)
export default router
