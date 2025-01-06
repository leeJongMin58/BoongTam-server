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



