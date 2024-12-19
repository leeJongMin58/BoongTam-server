import { Router } from 'express';
import { getBoongList } from '../controllers/test_boongController.js';
import { registerUser } from '../controllers/test_boongController.js'
const router = Router();

// GET /boongs - 붕어빵 리스트 가져오기
router.get('/boongs', getBoongList);

// POST 요청을 /register로 보내면 사용자 정보 저장
router.post('/register', registerUser);

export default router;

