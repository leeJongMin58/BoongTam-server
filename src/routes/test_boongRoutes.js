import { Router } from "express";
import { getBoongList } from "../controllers/boongController.js";
// import { registerUser } from "../controllers/boongController.js";
import { saveUser } from "../controllers/boongController.js";

const router = Router();

// GET /boongs - 붕어빵 리스트 가져오기
router.get('/boongs', getBoongList);

// POST 요청을 /register로 보내면 사용자 정보 저장
// router.post("/register", registerUser);
// 카카오 로그인 
router.post('/save-user', saveUser);

export default router;
