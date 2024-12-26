import { getDB } from '../database/connection.js';

// 사용자 정보를 데이터베이스에 저장하는 함수
const saveUser = async (user_id, username, user_text) => {
    try {
        const query = `
            INSERT INTO User (user_id, username, user_text)
            VALUES (?, ?, ?)
        `;
        
        const connection = await getDB();  // pool에서 연결 가져오기
        // const rows = await connection.query('SELECT * FROM Stores LIMIT 1');  // 쿼리 실행
        const result = await connection.execute(query, [user_id, username, user_text]);

        return result;
    } catch (error) {
        throw new Error('데이터 저장 오류: ' + error.message);
    }

};

export { saveUser };
