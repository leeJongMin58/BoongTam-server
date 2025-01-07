import { getDB } from '../database/connection.js';

// 커뮤니티 리뷰 작성
export const createStoreReview = async (storeId, userId, reviewText, reviewRating, reviewPhotos) => {
    const connection = await getDB();
    const query = `
        INSERT INTO store_reviews 
        (store_id, user_id, review_text, review_rating, store_review_photo_url, review_date) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const reviewPhotoString = reviewPhotos.join(',');
    const [result] = await connection.execute(query, [storeId, userId, reviewText, reviewRating, reviewPhotoString]);

    return result.insertId;
};


// 굿즈 리뷰 작성
export const createGoodsReview = async (goodsId, userId, reviewText, reviewRating, reviewPhotos) => {
    const connection = await getDB();
    const query = `
        INSERT INTO goods_reviews 
        (goods_id, user_id, review_text, goods_rating, goods_review_photo_url, review_date) 
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const reviewPhotoString = reviewPhotos.join(',');
    const [result] = await connection.execute(query, [goodsId, userId, reviewText, reviewRating, reviewPhotoString]);

    return result.insertId;
};


// 굿즈 리뷰 조회
export const findGoodsReviews = async (sort = 'latest', count = 5) => {
    const sortColumn = sort === 'popular' ? 'like_count' : 'gr.review_date';
    const query = `
        SELECT 
            gr.goods_review_id, 
            gr.goods_id,
            gr.goods_rating,
            gr.review_text, 
            SUBSTRING_INDEX(gr.goods_review_photo_url, ',', 1) AS review_first_image_url,
            gr.review_date,
            u.id AS user_id,
            u.nickname,
            u.profile_picture,
            COUNT(rl.like_id) AS like_count
        FROM goods_reviews gr
        JOIN users u ON gr.user_id = u.id
        LEFT JOIN review_likes rl 
            ON rl.review_type = 'goods' AND rl.review_id = gr.goods_review_id
        GROUP BY gr.goods_review_id
        ORDER BY ${sortColumn} DESC
        LIMIT ?
    `;

    const connection = await getDB();
    const [rows] = await connection.execute(query, [count]);
    return rows.map(row => ({
        goods_review_id: row.goods_review_id,
        goods_id: row.goods_id,
        review_text: row.review_text,
        goods_rating: row.goods_rating,
        review_first_image_url: row.review_first_image_url,
        review_date: row.review_date,
        like_count: row.like_count, // 하트 개수 추가
        user_simple_info: {
            user_id: row.user_id,
            nickname: row.nickname,
            profile_picture: row.profile_picture,
        },
    }));
};
