import { getDB } from '../database/connection.js';  // DB 연결 함수 가져오기

const saveUserToDB = async (id, nickname) => {
    const db = await getDB(); // DB 연결 가져오기
    const query = `
        INSERT INTO users (id, nickname)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        nickname = VALUES(nickname);
    `;
    try {
        const result = await db.execute(query, [id, nickname]);

        // 결과 반환
        return result;
    } catch (error) {
        throw new Error('DB 저장 중 오류: ' + error.message);
    }
};

export { saveUserToDB };