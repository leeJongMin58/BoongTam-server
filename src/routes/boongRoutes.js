import { Router } from 'express'
import { getNearbyStores } from '../controllers/boongController.js'
import { getStoreInfo } from '../controllers/boongController.js'
import { createOrder } from '../controllers/boongOrderController.js'

const router = Router()

// 지도에서 가장 가까운 매장 검색
router.get('/', getNearbyStores)

// 매장 정보 요청
router.get('/store/:store_id?', getStoreInfo)

// 구매
router.post('/order', createOrder)
export default router
