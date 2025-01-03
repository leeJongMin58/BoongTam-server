import { Router } from "express";
import * as GoodsController from '../controllers/goodsController.js';

const router = Router()
//굿즈 
router.get('/', GoodsController.getGoods)
//인기 굿즈 
router.get('/hotitems',GoodsController.getHotitems)


export default router;
