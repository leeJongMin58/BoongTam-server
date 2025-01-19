import { getDB } from '../database/connection.js'

export const generateOrderId = (userId) => {
	return `ORD-${new Date()
		.toISOString()
		.slice(0, 10)
		.replace(/-/g, '')}-${userId}-${Date.now()}`
}

export const saveOrderToDatabase = async (order) => {
	const connection = getDB()
	const { userId, goodsId, quantity, totalAmount, status } = order

	// 주문 번호 생성 (데이터베이스 저장 X)
	const orderNumber = generateOrderId(userId)

	try {
		console.log('Saving order to database...')
		console.log('Order details:', {
			userId,
			goodsId,
			quantity,
			totalAmount,
			status,
			orderNumber,
		})

		const [result] = await connection.query(
			`INSERT INTO purchase_history (user_id, goods_id, quantity, total_amount, status)
            VALUES (?, ?, ?, ?, ?)`,
			[userId, goodsId, quantity, totalAmount, status],
		)

		console.log('Order saved successfully, result:', result)

		// 성공 시 주문 번호와 DB ID 반환
		return { success: true, orderId: result.insertId, orderNumber }
	} catch (error) {
		console.error('Error saving order to database:', error.message)
		return { success: false, error: error.message }
	}
}
