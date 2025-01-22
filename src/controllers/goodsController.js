import * as goodsService from '../services/goodsService.js'
import errorCode from '../util/error.js'

// 굿즈가져오기
const getGoods = async (req, res) => {
	const {
		count = 10,
		page = 1,
		category = null,
		subcategory = null,
	} = req.query
	const pageNumber = parseInt(page)
	const userId = req.user.id
	console.log(count, pageNumber, category, subcategory)

	try {
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
	const userId = req.user.id

	try {
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
	const userId = req.user.id

	try {
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
	const userId = req.user.id

	if (!goodsId || !quantity) {
		return res.status(400).json({ msg: '필요한 값이 누락되었습니다.' })
	}

	try {
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
	const userId = req.user.id

	if (!cartId) {
		return res.status(400).json({ msg: '장바구니 ID가 필요합니다.' })
	}

	try {
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
	const userId = req.user.id

	try {
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

//굿즈 상세보기
const goodsDetail = async (req, res) => {
	const { goods_id } = req.params

	if (!goods_id) {
		return res.status(400).json(errorCode[400])
	}
	try {
		const result = await goodsService.fetchGoodsDetailsFromDB(goods_id)

		if (result.success) {
			return res.json({
				code: 200,
				msg: '굿즈 상세 조회 성공',
				goods: result.goods,
			})
		} else {
			return res.status(404).json(errorCode[404])
		}
	} catch (error) {
		console.error('서버 오류:', error.message)
		res.status(500).json(errorCode[500])
	}
}
//구매내역 상세보기
const purchaseHistoryDetail = async (req, res) => {
	const userId = req.user.id
	const { purchase_id } = req.params

	console.log('구매아이디', purchase_id)

	if (!purchase_id) {
		return res.status(400).json(errorCode[400])
	}
	try {
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

// 교환신청페이지
const exchange = async (req, res) => {
	//const token = req.headers.authorization
	const userId = req.user.id
	const { purchase_id } = req.params

	console.log('교환할 구매내역 아이디:', purchase_id)
	if (!purchase_id) {
		return res.status(404).json(errorCode[404])
	}
	try {
		//const userId = await testvalidateTokenAndUser(token)
		const result = await goodsService.fetchExchangeFromDB(
			userId,
			purchase_id,
		)

		if (result.success) {
			return res.json({
				code: 200,
				msg: '교환 페이지 가져오기 성공',
				history: result.history,
			})
		} else {
			return res.status(404).json(errorCode[404])
		}
	} catch (error) {
		console.error('서버오류', error.message)
		res.status(500).json(errorCode[500])
	}
}
//교환 신청 보내기
const postExchange = async (req, res) => {
	//const token = req.headers.authorization
	const userId = req.user.id
	const { purchase_id, reason, goods_id, quantity } = req.body
	const { type } = req.query

	console.log('교환할 구매내역 아이디:', purchase_id)
	console.log('처음 입력받은 이유:', reason)

	if (!userId || !purchase_id || !type || !reason || !goods_id || !quantity) {
		return res.status(404).json(errorCode[404])
	}

	try {
		//const userId = await testvalidateTokenAndUser(token)
		const result = await goodsService.fetchPostExchangeFromDB(
			userId,
			purchase_id,
			type,
			reason,
			goods_id,
			quantity,
		)

		if (result.success) {
			return res.json({
				code: 200,
				msg: '교환 요청 성공',
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

// 결제하기
const checkout = async (req, res) => {
	//const token = req.headers.authorization
	const userId = req.user.id
	const { cart_id } = req.params
	console.log('구매할 장바구니 아이디 :', cart_id)

	if (!userId || !cart_id) {
		return res.status(404).json(errorCode[404])
	}

	try {
		//const userId = await testvalidateTokenAndUser(token)
		const result = await goodsService.fetchCheckoutFromDB(userId, cart_id)

		if (result.success) {
			return res.json({
				code: 200,
				msg: '결제화면 가져오기 성공',
				history: result.history,
			})
		} else {
			return res.status(404).json(errorCode[404])
		}
	} catch (error) {
		console.error('서버오류', error.message)
		res.status(500).json(errorCode[500])
	}
}
// 반품신청 페이지
const Return = async (req, res) => {
	//const token = req.headers.authorization
	const userId = req.user.id
	const { purchase_id } = req.params

	console.log('교환할 구매내역 아이디:', purchase_id)
	if (!userId || !purchase_id) {
		return res.status(404).json(errorCode[404])
	}
	try {
		//const userId = await testvalidateTokenAndUser(token)
		const result = await goodsService.fetchReturnFromDB(userId, purchase_id)

		if (result.success) {
			return res.json({
				code: 200,
				msg: '반품 페이지 가져오기 성공',
				history: result.history,
			})
		} else {
			return res.status(404).json(errorCode[404])
		}
	} catch (error) {
		console.error('서버오류', error.message)
		res.status(500).json(errorCode[500])
	}
}
// 반품 신청 보내기
const postReturn = async (req, res) => {
	//const token = req.headers.authorization
	const userId = req.user.id
	const { purchase_id, reason, goods_id, quantity } = req.body
	const { type } = req.query

	console.log('교환할 구매내역 아이디:', purchase_id)
	console.log('처음 입력받은 이유:', reason)

	if (!userId || !purchase_id || !type || !reason || !goods_id || !quantity) {
		return res.status(404).json(errorCode[404])
	}

	try {
		//const userId = await testvalidateTokenAndUser(token)
		const result = await goodsService.fetchPostReturnFromDB(
			userId,
			purchase_id,
			type,
			reason,
			goods_id,
			quantity,
		)

		if (result.success) {
			return res.json({
				code: 200,
				msg: '반품 요청 성공',
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
	exchange,
	goodsDetail,
	purchaseHistoryDetail,
	checkout,
	postExchange,
	Return,
	postReturn,
}
