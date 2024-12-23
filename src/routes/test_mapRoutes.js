import { Router } from 'express';
import { getNearbyStores } from '../controllers/test_mapController.js';

const router = Router();

// 지도에서 가장 가까운 매장 검색
router.get('/map', getNearbyStores);

export default router;
