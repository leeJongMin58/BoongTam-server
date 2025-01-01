import * as goodsService from '../services/goodsService.js'

const validateTokenAndUser = async (token) => {
	console.log('validateTokenAndUser 실행')
	if (!token) {
		throw { status: 401, message: '로그인 후 이용해주세요.' }
	}

	try {
		const userId = await goodsService.fetchUserFromKakao(token)

		if (!userId) {
			throw {
				status: 401,
				message: '유효하지 않은 토큰입니다. 다시 로그인해주세요.',
			}
		}

		return userId
	} catch (error) {
		console.error('토큰 검증 오류:', error.message)
		throw {
			status: 500,
			message: '토큰 검증 중 오류가 발생했습니다.',
			error: error.message,
		}
	}
}

export default validateTokenAndUser
