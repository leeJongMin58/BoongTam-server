import {
	generateOrderId,
	saveOrderToDatabase,
} from '../services/orderService.js'
import { getIamportToken, verifyPayment } from '../services/iamportService.js'

// 주문 정보 생성
export const getPaymentDetails = (req, res) => {
	const { userId, productName, productPrice, quantity } = req.body

	if (!userId || !productName || !productPrice || !quantity) {
		return res.status(400).json({ msg: '필요한 값이 누락되었습니다.' })
	}

	const merchant_uid = generateOrderId(userId)
	const totalAmount = productPrice * quantity

	res.json({
		success: true,
		paymentDetails: {
			merchant_uid,
			amount: totalAmount,
			name: productName,
		},
	})
}

// 결제 완료
export const completePayment = async (req, res) => {
	const { imp_uid, merchant_uid } = req.body

	if (!imp_uid || !merchant_uid) {
		return res.status(400).json({ msg: '필요한 값이 누락되었습니다.' })
	}

	try {
		const token = await getIamportToken()
		const isValid = await verifyPayment(imp_uid, merchant_uid, token)

		if (!isValid) {
			return res.status(400).json({ msg: '결제 검증 실패' })
		}

		const order = {
			purchase_id: merchant_uid,
			userId: '2222', // 예시
			goodsId: 3, // 예시
			quantity: 3, // 예시
			totalAmount: 21000,
			status: 'PAID',
		}

		const saveResult = await saveOrderToDatabase(order)
		if (saveResult.success) {
			res.json({ success: true, orderId: saveResult.orderId })
		} else {
			res.status(500).json({
				msg: '주문 저장 실패',
				error: saveResult.error,
			})
		}
	} catch (error) {
		res.status(500).json({ msg: '서버 오류', error: error.message })
	}
}
