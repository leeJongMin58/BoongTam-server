import { getDB } from '../database/connection.js' // DB 연결 함수 가져오기
import errorCode from '../util/error.js'

const saveUserToDB = async (id, nickname, email, address1, address2) => {
	const db = await getDB() // DB 연결 가져오기
	const query = `
        INSERT INTO users (id, nickname, email, address1, address2, token)
        VALUES (?, ?, ?, ?, ?, ?)
        nickname = VALUES(nickname),
        email = VALUES(email),
        address1 = VALUES(address1),
        address2 = VALUES(address2),
        token = VALUES(token);
    `
	try {
		const result = await db.execute(query, [
			id,
			nickname,
			email,
			address1,
			address2,
			token,
		])

		// 결과 반환
		return result
	} catch (error) {
		if (
			error.code == 'ER_DUP_ENTRY' &&
			error.message.includes('nickname')
		) {
			return res.status(409).json(errorCode[409])
		}
		throw new Error('DB 저장 중 오류: ' + error.message)
	}
}

export { saveUserToDB }

//회원 탈퇴 ON DELETE CASCADE 이거를 적용하면 됨 그럼 모든 카트에 있는 유저이런게 사라짐
const deleteUserFromDB = async (id) => {
	const db = await getDB()

	try {
		// 사용자 데이터 삭제 (외래 키 설정으로 orders와 cart_items 데이터도 자동 삭제됨)
		const deleteUserQuery = `DELETE FROM users WHERE id = ?`
		const [result] = await db.execute(deleteUserQuery, [id])

		if (result.affectedRows === 0) {
			return res.status(404).json(errorCode[404])
		}

		return { success: true }
	} catch (error) {
		throw new Error('DB 삭제 중 오류: ' + error.message)
	}
}

export { deleteUserFromDB }
