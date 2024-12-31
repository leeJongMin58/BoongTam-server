import { Router } from 'express'
import { getUserInfo } from '../controllers/mypageController.js'

const router = Router()

// 사용자 정보 조회
router.get('/info', getUserInfo)

export default router
