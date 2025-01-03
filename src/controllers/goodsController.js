import * as goodsService from '../services/goodsService.js'
import testvalidateTokenAndUser from '../util/authUtils.js'
import errorCode from '../util/error.js'

const getGoods = async (req, res) => {
	const { count = 10, page = 1 ,category = null, subcategory = null} = req.query
	const pageNumber = parseInt(page)
	const token = req.headers.authorization
	console.log(count, pageNumber,category,subcategory)

	try {
		const userId = await testvalidateTokenAndUser(token)
		console.log(userId)

		const goods = await goodsService.fetchGoodsFromDB(count, pageNumber,category,subcategory)
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

export { getGoods, getHotitems }
