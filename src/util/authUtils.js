import * as goodsService from '../services/goodsService.js'
import errorCode from './error.js' // errorcode 적용
import { getDB } from '../database/connection.js'
// const validateTokenAndUser = async (token) => {
// 	console.log('validateTokenAndUser 실행')
// 	if (!token) {
// 		throw {
//             ...errorCode[401],
//             detail: '로그인 후 이용해주세요.',
//         };
// 	}

// 	try {
// 		const userId = await goodsService.fetchUserFromKakao(token)

//         if (!userId) {
//             throw {
//                 ...errorCode[401],
//                 detail: '유효하지 않은 토큰입니다. 다시 로그인해주세요.',
//             };
// 		}

// 		return userId
// 	} catch (error) {
// 		console.error('토큰 검증 오류:', error.message)
//         throw {
//             ...errorCode[500],
//             detail: '토큰 검증 중 오류가 발생했습니다.',
//             error: error.message,
//         };
// 	}
// }

// export default validateTokenAndUser

const testvalidateTokenAndUser = async (token) => {
	console.log('받은 토큰:', token)

	try {
		const db = await getDB()

		// 전체 사용자 데이터 확인
		const checkQuery = 'SELECT * FROM users'
		const [allUsers] = await db.execute(checkQuery)
		console.log('전체 사용자 데이터:', allUsers)

		// 특정 토큰으로 조회
		const query = 'SELECT id FROM users WHERE token = ?'
		const [rows] = await db.execute(query, [token])
		console.log('토큰으로 조회한 결과:', rows)

		if (rows.length === 0) {
			throw {
				...errorCode[401], // 이부분 수정(1월 6일)
				detail: '유효하지 않은 토큰입니다. 다시 로그인해주세요.',
			}
		}

		return rows[0].id
	} catch (error) {
		console.error('토큰 검증 오류:', error)
		throw error
	}
}
export default testvalidateTokenAndUser
