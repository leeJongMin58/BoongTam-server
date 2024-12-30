import { getDB } from '../database/connection.js';


// 사용자 정보 조회
export const getUserInfo = async (userid) => {
    const query = 'SELECT id AS user_id, nickname, profile_picture FROM users WHERE id = ?';

    const connection = await getDB();
    const result = await connection.execute(query, [userid]);

    return result[0];
};

/*
// 사용자가 작성한 리뷰를 조회하는 모델
exports.getUserReviews = async (userId, page, size) => {
    const offset = (page - 1) * size;
    const query = `
        SELECT id AS review_id, content, rating, created_at
        FROM reviews
        WHERE user_id = ?
        LIMIT ? OFFSET ?
    `;
    const [rows] = await db.execute(query, [userId, size, offset]);
    return rows;
};
*/