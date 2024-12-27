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
    const query = 'SELECT * FROM Menus WHERE store_id = ?';
    const [rows] = await db.query(query, [storeid]);
    return rows;
};

// 매장 사진 정보 조회
export const getStorePhotos = async (storeid, filter) => {
    let query = 'SELECT * FROM Photos WHERE store_id = ?';
    const params = [storeid];

    if (filter) {
        query += ' AND category = ?';
        params.push(filter);
    }

    const [rows] = await db.query(query, params);
    return rows;
};

// 매장 리뷰 정보 조회
export const getStoreReviews = async (storeid, sort) => {
    let query = 'SELECT * FROM Reviews WHERE store_id = ?';
    const params = [storeid];

    if (sort === 'latest') {
        query += ' ORDER BY created_at DESC';
    } else if (sort === 'most_liked') {
        query += ' ORDER BY heart_count DESC';
    }

    const [rows] = await db.query(query, params);
    return rows;
};
