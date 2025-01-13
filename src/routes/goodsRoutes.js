import { Router } from "express";
import * as GoodsController from '../controllers/goodsController.js';

const router = Router()
//굿즈 
router.get('/', GoodsController.getGoods)
//인기 굿즈 
router.get('/hotitems',GoodsController.getHotitems)
//장바구니
router.get("/cart", GoodsController.cart)
//장바구니 담기
router.post("/cart", GoodsController.addCart)
//장바구니 삭제
router.delete("/cart", GoodsController.removeFromCart)
// 구매내역 
router.get("/purchase-history", GoodsController.purchaseHistory)

export default router
