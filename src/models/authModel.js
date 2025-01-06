import { getDB } from '../database/connection.js' // DB 연결 함수 가져오기
import errorCode from '../util/error.js'

const saveUserToDB = async (id, nickname, email, address1, address2) => {
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

//중복체크
const findByNicknameFromDB = async (nickname) => {
	const db = await getDB()

	try {
		// 1. 먼저 전체 데이터를 조회해보기
		const allQuery = 'SELECT * FROM users'
		const [allRows] = await db.execute(allQuery)
		console.log('전체 데이터:', allRows)

		// 2. 특정 닉네임 조회
		const query = 'SELECT * FROM users WHERE nickname = ?'
		const [rows] = await db.execute(query, [nickname])
		console.log('검색할 닉네임:', nickname)
		console.log('닉네임으로 조회한 결과:', rows)

		return rows.length > 0 ? rows[0] : null
	} catch (error) {
		console.error('DB 닉네임 검색 중 오류:', error.message)
		throw new Error('닉네임 검색 실패: ' + error.message)
	}
}
export { findByNicknameFromDB }

//카카오 아이디로 조회
const findUserByKakaoIdFromDB = async (kakao_id) => {
	const db = await getDB()
	try {
		const [rows] = await db.query(
			'SELECT * FROM users WHERE kakao_id = ?',
			[kakao_id]
		);
		
		return rows[0] || null;
		
	} catch (error) {
		console.error('카카오 ID로 사용자 검색 실패:', error);
		throw error;
	}
}

export { findUserByKakaoIdFromDB }

const updateUserTokensFromDB = async (kakao_id, tokenData) => {
    const db = await getDB()
    try {
        const [result] = await db.query(
            'UPDATE users SET token = ? WHERE id = ?',
            [tokenData.access_token, kakao_id]
        );
        
        // 업데이트된 행이 있는지 확인
        if (result.affectedRows === 0) {
            throw new Error('사용자를 찾을 수 없습니다');
        }
        
        return result;
        
    } catch (error) {
        console.error('토큰 업데이트 실패:', error);
        throw error;
    }
}

export { updateUserTokensFromDB };