import { Router } from "express";
import { saveUser } from "../controllers/kakaoController.js";

const router = Router();

router.post('/save-user', saveUser);

export default router;