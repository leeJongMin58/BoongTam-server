import { Router } from "express";
import { saveUser, register } from "../controllers/kakaoController.js";

const router = Router();

// POST 요청을 /register로 보내면 사용자 정보 저장
// router.post("/register", registerUser);
// 카카오 로그인 
router.post('/saveuser', saveUser);
// 회원가입 
router.post('/register', register)
export default router;


// 카카오 로그인 버튼을 눌렀을때 앱 동의 항목을 눌렀을때 users테이블에 id 이미있으면 