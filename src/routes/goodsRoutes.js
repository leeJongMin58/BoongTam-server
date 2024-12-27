import { Router } from "express";
import { getGoods, getHotitems } from '../controllers/goodsController.js';

const router = Router();


router.get('/', getGoods)