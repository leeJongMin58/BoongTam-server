import { Router } from "express";
// import { registerUser } from "../controllers/boongController.js";
import { saveUser } from "../controllers/kakaoController.js";

const router = Router();

// POST 요청을 /register로 보내면 사용자 정보 저장
// router.post("/register", registerUser);
// 카카오 로그인 
router.post('/save-user', saveUser);

export default router;
