import { getDB } from '../database/connection.js';

// 매장 상세 정보 조회
export const getStoreDetails = async (storeid) => {
    const query = 'SELECT * FROM Stores WHERE store_id = ?';
    const connection = await getDB();
    const result1 = await connection.execute(query, [storeid]);

    return result1;
};

// 매장 메뉴 정보 조회
export const getStoreMenu = async (storeid) => {
    const query = 'SELECT * FROM Menu WHERE store_id = ?';
    const connection = await getDB();
    const result2 = await connection.execute(query, [storeid]);

    return result2;
};

// 매장 사진 정보 조회
export const getStorePhotos = async (storeid, filter) => {
    let query = 'SELECT * FROM Photos WHERE store_id = ?';
    const params = [storeid];

    if (filter) {
        query += ' AND photo_category = ?';
        params.push(filter);
    }

    const connection = await getDB();
    const result3 = await connection.execute(query, params);

    return result3;
};

// 매장 리뷰 정보 조회
export const getStoreReviews = async (storeid, sort) => {
    let query = 'SELECT * FROM Store_reviews WHERE store_id = ?';
    const params = [storeid];

    if (sort === 'latest') {
        query += ' ORDER BY review_date DESC';
    } else if (sort === 'most_liked') {
        query += ' ORDER BY review_heart DESC';
    }

    const connection = await getDB();
    const result4 = await connection.execute(query, params);

    return result4;
};
