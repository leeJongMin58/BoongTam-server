import { Router } from "express";
import { saveUser } from "../controllers/kakaoController.js";

const router = Router();

// 카카오 로그인 
router.post('/save-user', saveUser);

export default router;
