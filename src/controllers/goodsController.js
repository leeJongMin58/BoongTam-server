import * as goodsService from '../services/goodsService.js'
import testvalidateTokenAndUser from '../util/authUtils.js'
import errorCode from '../util/error.js'

const getGoods = async (req, res) => {
	const {
		count = 10,
		page = 1,
		category = null,
		subcategory = null,
	} = req.query
	const pageNumber = parseInt(page)
	const token = req.headers.authorization
	console.log(count, pageNumber, category, subcategory)

	try {
		const userId = await testvalidateTokenAndUser(token)
		console.log(userId)

		const goods = await goodsService.fetchGoodsFromDB(
			count,
			pageNumber,
			category,
			subcategory,
		)
		res.json({
			code: 200,
			msg: '통신 성공',
			count: goods.length,
			nextpage: goods.length === parseInt(count),
			data: goods,
		})
	} catch (error) {
		const status = error.status || 500
		res.status(status).json(
			errorCode[status] || {
				code: status,
				message: error.message || '서버 오류',
			},
		)
	}
}

//핫붕템
const getHotitems = async (req, res) => {
	const { count = 5 } = req.query
	const token = req.headers.authorization

	try {
		// 토큰검증
		const userId = await testvalidateTokenAndUser(token)
		console.log(userId)

		// DB에서 굿즈 정보 가져오기
		const goods = await goodsService.fetchHotGoodsFromDB(count)

		res.json({
			code: 200,
			msg: '통신 성공',
			count: goods.length,
			nextpage: goods.length === parseInt(count),
			data: goods,
		})
	} catch (error) {
		const status = error.status || 500
		res.status(status).json(
			errorCode[status] || {
				code: status,
				message: error.message || '서버 오류',
			},
		)
	}
}

//장바구니
const cart = async (req, res) => {
	const { count = 10, page = 1 } = req.query
	const pageNumber = parseInt(page)
	const token = req.headers.authorization

	try {
		const userId = await testvalidateTokenAndUser(token)
		console.log(userId)
		const goods = await goodsService.fetchCartFromDB(
			userId,
			count,
			pageNumber,
		)
		res.json({
			code: 200,
			msg: '통신 성공',
			count: goods.length,
			nextpage: goods.length === parseInt(count),
			data: goods,
		})
	} catch (error) {
		console.error('서버 오류:', error.message)
		res.status(500).json(errorCode[500])
	}
}

//장바구니 담기
const addCart = async (req, res) => {
	const { goodsId, quantity } = req.body
	const token = req.headers.authorization

	if (!goodsId || !quantity) {
		return res.status(400).json({ msg: '필요한 값이 누락되었습니다.' })
	}

	try {
		const userId = await testvalidateTokenAndUser(token)
		console.log(userId)
		const result = await goodsService.fetchAddCartFromDB(
			userId,
			goodsId,
			quantity,
		)
		if (result) {
			return res.json({
				code: 200,
				msg: '장바구니에 상품이 추가되었습니다.',
			})
		} else {
			return res.status(400).json(errorCode[400])
		}
	} catch (error) {
		console.error('서버 오류:', error.message)
		res.status(500).json(errorCode[500])
	}
}

//장바구니 삭제
const removeFromCart = async (req, res) => {
	const { cartId } = req.body
	const token = req.headers.authorization

	if (!cartId) {
		return res.status(400).json({ msg: '장바구니 ID가 필요합니다.' })
	}

	try {
		const userId = await testvalidateTokenAndUser(token)
		const result = await goodsService.fetchRemoveFromCartFromDB(
			userId,
			cartId,
		)

		if (result) {
			return res.json({
				code: 200,
				msg: '장바구니에서 상품이 삭제되었습니다.',
			})
		} else {
			return res.status(400).json(errorCode[400])
		}
	} catch (error) {
		console.error('서버 오류:', error.message)
		res.status(500).json(errorCode[500])
	}
}

//구매내역
const purchaseHistory = async (req, res) => {
	const token = req.headers.authorization

	try {
		const userId = await testvalidateTokenAndUser(token)
		const result = await goodsService.fetchPurchaseHistoryFromDB(userId)

		if (result.success) {
			console.log(result)
			return res.json({
				code: 200,
				msg: '구매 내역 조회 성공',
				history: result.history,
			})
		} else {
			console.log('구매내역 조회 실패')
			return res.status(400).json(errorCode[400])
		}
	} catch (error) {
		console.error('서버 오류:', error.message)
		res.status(500).json(errorCode[500])
	}
}
//구매내역 상세보기
const purchaseHistoryDetail = async (req, res) => {
	const token = req.headers.authorization
	const { purchase_id } = req.params

	console.log('구매아이디', purchase_id)

	if (!token || !purchase_id) {
		return res.status(400).json(errorCode[400])
	}
	try {
		const userId = await testvalidateTokenAndUser(token)
		const result = await goodsService.fetchPurchaseHistoryDetailFromDB(
			userId,
			purchase_id,
		)

		if (result.success) {
			return res.json({
				code: 200,
				msg: '주문 상세 조회 성공',
				history: result.history,
			})
		} else {
			return res.status(404).json(errorCode[404])
		}
	} catch (error) {
		console.error('서버 오류:', error.message)
		res.status(500).json(errorCode[500])
	}
}

export {
	getGoods,
	getHotitems,
	cart,
	addCart,
	removeFromCart,
	purchaseHistory,
	purchaseHistoryDetail,
}
