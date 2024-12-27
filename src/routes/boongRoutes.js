import { Router } from 'express';
import { getNearbyStores } from '../controllers/boongController.js';
import { getStoreInfo } from '../controllers/boongController.js';

const router = Router();

// 지도에서 가장 가까운 매장 검색
router.get('/', getNearbyStores);


// 매장 정보 요청
router.get('/store', getStoreInfo);
export default router;
