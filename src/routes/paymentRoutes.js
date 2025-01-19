import express from 'express'
import {
	getPaymentDetails,
	completePayment,
} from '../controllers/paymentController.js'

const router = express.Router()

// 주문 정보 생성
router.post('/details', getPaymentDetails)

// 결제 완료
router.post('/complete', completePayment)

export default router
