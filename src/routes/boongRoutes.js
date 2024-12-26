import { Router } from 'express';
import { getNearbyStores } from '../controllers/boongController.js';

const router = Router();

// 지도에서 가장 가까운 매장 검색
router.get('/', getNearbyStores);

export default router;
