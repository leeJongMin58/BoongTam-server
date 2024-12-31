import { getDB } from '../database/connection.js' // DB 연결 함수 가져오기

const saveUserToDB = async (id, nickname,email,address1,address2) => {
	const db = await getDB() // DB 연결 가져오기
	const query = `
        INSERT INTO users (id, nickname, email, address1, address2, token)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        nickname = VALUES(nickname),
        email = VALUES(email),
        address1 = VALUES(address1),
        address2 = VALUES(address2),
        token = VALUES(token);
    `
	try {
		const result = await db.execute(query, [id, nickname,email, address1, address2, token])

		// 결과 반환
		return result
	} catch (error) {
		throw new Error('DB 저장 중 오류: ' + error.message)
	}
}

export { saveUserToDB }
