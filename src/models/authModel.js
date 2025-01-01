import { getDB } from '../database/connection.js' // DB 연결 함수 가져오기

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
