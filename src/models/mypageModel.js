import { getDB } from '../database/connection.js';


// 1. 사용자 정보 조회
export const getUserInfo = async (userid) => {
    const query = 'SELECT id AS user_id, nickname, profile_picture, points FROM users WHERE id = ?';

	const connection = await getDB()
	const result = await connection.execute(query, [userid])
    return result[0];
}

// 1.5 사용자 토큰으로 정보 조회
export const getUserByToken = async (token) => {
    const query = 'SELECT id AS user_id, nickname, profile_picture, points FROM users WHERE token = ?';
    const connection = await getDB();
    const [result] = await connection.execute(query, [token]);
    return result.length ? result[0] : null;
};


// 2. 사용자 정보 수정
export const updateUserInfo = async (userid, type, value) => {
    const query = `UPDATE users SET ${type} = ? WHERE id = ?`;
    const connection = await getDB();
    const result = await connection.execute(query, [value, userid]);

    // 수정된 값 반환
    return { [type]: value };  // 수정된 항목과 값 반환
};

// 3. 사용자 정보 추가 (INSERT)
export const insertUserInfo = async (userid, type, value) => {
    const query = `UPDATE users SET ${type} = ? WHERE id = ?`;
    const connection = await getDB();
    const result = await connection.execute(query, [value, userid]);

    // 추가된 값 반환
    return { [type]: value };  // 추가된 항목과 값 반환
};

// 4. 사용자 리뷰 관리
// 전체 리뷰 조회
export const findReviewsByTab = async (userId, tab) => {
    let query;
    if (tab === 'goods') {
        query = `
            SELECT *
            FROM goods_reviews
            WHERE user_id = ?
        `;
    } else if (tab === 'store') {
        query = `
            SELECT *
            FROM store_reviews
            WHERE user_id = ?
        `;
    } else {
        throw new Error('유효하지 않은 tab 값입니다.');
    }

    try {
        const connection = await getDB();
        const [rows] = await connection.execute(query, [userId]);
                // store_review_photo_url 필드를 배열로 변환
        const processedRows = rows.map(row => {
            return {
                ...row,
                store_review_photo_url: row.store_review_photo_url
                    ? row.store_review_photo_url.split(',').map(photo => photo.trim()) // 쉼표로 분리하여 배열로 변환, 공백 처리
                    : []
            };
        });

        console.log("processedRows: ", processedRows);
        return processedRows;
        //return rows;
    } catch (error) {
        console.error('DB 조회 오류:', error.message);
        throw new Error('전체 리뷰 조회 중 오류가 발생했습니다.');
    }
};

export const findReviewById = async (userId, tab, reviewId) => {
    let query, params;

    if (tab === 'goods') {
        query = `
            SELECT *
            FROM goods_reviews
            WHERE user_id = ? AND goods_review_id = ?
        `;
        params = [userId, reviewId];
    } else if (tab === 'store') {
        query = `
            SELECT *
            FROM store_reviews
            WHERE user_id = ? AND store_review_id = ?
        `;
        params = [userId, reviewId];
    } else {
        throw new Error('유효하지 않은 tab 값입니다.');
    }

    try {
        const connection = await getDB();
        const [rows] = await connection.execute(query, params);
        return rows[0] || null;
    } catch (error) {
        console.error('DB 조회 오류:', error.message);
        throw new Error('특정 리뷰 조회 중 오류가 발생했습니다.');
    }
};


// 리뷰 수정
export const updateReviewById = async (userId, tab, reviewId, review_text, rating) => {
    let query, params;

    if (tab === 'goods') {
        query = `
            UPDATE goods_reviews
            SET review_text = ?, goods_rating = ?, modified_date = CURRENT_TIMESTAMP
            WHERE user_id = ? AND goods_review_id = ?
        `;
        params = [review_text, rating, userId, reviewId];
    } else if (tab === 'store') {
        query = `
            UPDATE store_reviews
            SET review_text = ?, review_rating = ?, modified_date = CURRENT_TIMESTAMP
            WHERE user_id = ? AND store_review_id = ?
        `;
        params = [review_text, rating, userId, reviewId];
    } else {
        throw new Error('유효하지 않은 tab 값입니다.');
    }

    try {
        const connection = await getDB();
        const [result] = await connection.execute(query, params);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('DB 수정 오류:', error.message);
        throw new Error('리뷰 수정 중 오류가 발생했습니다.');
    }
};

// 리뷰 삭제
export const deleteReviewById = async (userId, tab, reviewId) => {
    let query, params;

    if (tab === 'goods') {
        query = `
            DELETE FROM goods_reviews
            WHERE user_id = ? AND goods_review_id = ?
        `;
        params = [userId, reviewId];
    } else if (tab === 'store') {
        query = `
            DELETE FROM store_reviews
            WHERE user_id = ? AND store_review_id = ?
        `;
        params = [userId, reviewId];
    } else {
        throw new Error('유효하지 않은 tab 값입니다.');
    }

    try {
        const connection = await getDB();
        const [result] = await connection.execute(query, params);
        return result.affectedRows > 0;
    } catch (error) {
        console.error('DB 삭제 오류:', error.message);
        throw new Error('리뷰 삭제 중 오류가 발생했습니다.');
    }
};

//회원 탈퇴
export const deleteUser = async (userId) => {
    const query = 'DELETE FROM users WHERE id = ?';
    const connection = await getDB();

    try {
        const [result] = await connection.execute(query, [userId]);
        if (result.affectedRows === 0) {
            return { success: false, message: '사용자를 찾을 수 없습니다.' };
        }
        return { success: true };
    } catch (error) {
        console.error('회원탈퇴 실패:', error);
        throw new Error('회원탈퇴 처리 중 문제가 발생했습니다.');
    }
};