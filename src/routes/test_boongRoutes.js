import { Router } from 'express';
import { getBoongList } from '../controllers/test_boongController.js';

const router = Router();

// GET /boongs - 붕어빵 리스트 가져오기
router.get('/boongs', getBoongList);

export default router;
