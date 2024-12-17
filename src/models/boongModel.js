import db from '../database/connection.js';

// 사용자 정보를 데이터베이스에 저장하는 함수
const saveUser = async (user_id, username, user_text) => {
    try {
        const query = `
            INSERT INTO User (user_id, username, user_text)
            VALUES (?, ?, ?)
        `;
        await db.execute(query, [user_id, username, user_text]);
        return { message: '사용자 정보 저장 성공' };
    } catch (error) {
        throw new Error('데이터 저장 오류: ' + error.message);
    }
};

export { saveUser };
