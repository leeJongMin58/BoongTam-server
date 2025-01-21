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
            g.goods_name,
            g.image_url,
            gr.goods_rating,
            gr.review_text,
            gr.goods_review_photo_url, -- 전체 리뷰 사진 URL 추가
            SUBSTRING_INDEX(gr.goods_review_photo_url, ',', 1) AS review_first_image_url,
            gr.review_date,
            u.id AS user_id,
            u.nickname,
            u.profile_picture,
            COUNT(rl.like_id) AS like_count
        FROM goods_reviews gr
        JOIN users u ON gr.user_id = u.id
        JOIN goods g ON gr.goods_id = g.goods_id -- goods 테이블과 조인
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
        goods_image_url:row.image_url,
        goods_name: row.goods_name,
        review_text: row.review_text,
        goods_rating: row.goods_rating,
        goods_review_photo_url:row.goods_review_photo_url,
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

// 매장 리뷰 조회
export const findStoreReviews = async (sort = 'latest', count = 5) => {
    const sortColumn = sort === 'popular' ? 'like_count' : 'sr.review_date';
    const query = `
        SELECT 
            sr.store_review_id, 
            sr.store_id,
            s.store_name, -- 추가된 부분: stores 테이블의 store_name
            s.address, -- 매장의 주소 추가
            s.thumbnail_url, -- 매장의 썸네일 URL 추가
            sr.review_rating,
            sr.review_text,
            sr.store_review_photo_url, -- 전체 리뷰 사진 URL 추가
            SUBSTRING_INDEX(sr.store_review_photo_url, ',', 1) AS review_first_image_url,
            sr.review_date,
            u.id AS user_id,
            u.nickname,
            u.profile_picture,
            COUNT(rl.like_id) AS like_count
        FROM store_reviews sr
        JOIN users u ON sr.user_id = u.id
        JOIN stores s ON sr.store_id = s.store_id -- stores 테이블과 조인
        LEFT JOIN review_likes rl 
            ON rl.review_type = 'store' AND rl.review_id = sr.store_review_id
        GROUP BY sr.store_review_id
        ORDER BY ${sortColumn} DESC
        LIMIT ?
    `;

    const connection = await getDB();
    const [rows] = await connection.execute(query, [count]);
    return rows.map(row => ({
        store_review_id: row.store_review_id,
        store_id: row.store_id,
        store_name:row.store_name,
        address: row.address, // 매장 주소 추가
        thumbnail_url: row.thumbnail_url, // 매장 썸네일 URL 추가
        review_text: row.review_text,
        review_rating: row.review_rating,
        store_review_photo_url: row.store_review_photo_url, // 전체 리뷰 사진 URL 추가
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

// 굿즈 리뷰 상세 조회
export const findGoodsReviewDetail = async (sort = 'latest', count = 10) => {
    const sortColumn = sort === 'popular' ? 'review_like' : 'gr.review_date';
    const query = `
    SELECT 
        gr.goods_review_id, 
        gr.goods_id,
        g.goods_name,
        g.goods_description,
        SUBSTRING_INDEX(g.image_url, ',', 1) AS img_url,
        gr.goods_rating,
        gr.review_text, 
        gr.goods_review_photo_url,
        gr.review_date,
        COUNT(rl.like_id) AS review_like, -- 좋아요 수
        COUNT(c.comment_id) AS review_comment_count, -- 댓글 수
        u.id AS user_id,
        u.nickname,
        u.profile_picture,
        (
            SELECT COUNT(*) FROM goods_reviews WHERE user_id = u.id
        ) AS goods_review_count,
        (
            SELECT AVG(goods_rating) FROM goods_reviews WHERE user_id = u.id
        ) AS goods_reivew_avg_rating
    FROM goods_reviews gr
    JOIN goods g ON gr.goods_id = g.goods_id
    JOIN users u ON gr.user_id = u.id
    LEFT JOIN review_likes rl ON rl.review_id = gr.goods_review_id AND rl.review_type = 'goods'
    LEFT JOIN goods_reviews_comments c ON c.goods_review_id = gr.goods_review_id
    GROUP BY gr.goods_review_id
    ORDER BY ${sortColumn} DESC -- sortColumn이 review_like나 gr.review_date로 설정
    LIMIT ?
    `;

    const connection = await getDB();
    const [rows] = await connection.execute(query, [count]);
    return rows.map(row => ({
        goods_review_id: row.goods_review_id,
        review_text: row.review_text,
        review_rating: row.goods_rating,
        review_image_url: row.goods_review_photo_url ? row.goods_review_photo_url.split(',') : [],
        review_date: row.review_date,
        review_like: row.review_like,
        review_comment_count: row.review_comment_count,
        user_simple_info: {
            user_id: row.user_id,
            nickname: row.nickname,
            profile_picture: row.profile_picture,
            goods_review_count: row.goods_review_count,
            goods_reivew_avg_rating: row.goods_reivew_avg_rating,
        },
        goods_simple_info: {
            goods_id: row.goods_id,
            goods_name: row.goods_name,
            img_url: row.img_url,
            goods_description: row.goods_description,
        },
        console:"-------------------"
    }));
};



// 매장 리뷰 상세 조회
export const findStoreReviewDetail = async (sort = 'latest', count = 10) => {
    const sortColumn = sort === 'popular' ? 'review_like' : 'sr.review_date';
    const query = `
    SELECT 
        sr.store_review_id,
        sr.store_id,
        s.store_name,
        s.address,
        SUBSTRING_INDEX(s.thumbnail_url, ',', 1) AS img_url,
        sr.review_rating AS review_rating,
        sr.review_text, 
        sr.store_review_photo_url AS review_image_url,
        sr.review_date,
        COUNT(rl.like_id) AS review_like, -- 좋아요 수
        COUNT(c.comment_id) AS review_comment_count, -- 댓글 수
        u.id AS user_id,
        u.nickname,
        u.profile_picture,
        (
            SELECT COUNT(*) FROM store_reviews WHERE user_id = u.id
        ) AS store_review_count,
        (
            SELECT AVG(review_rating) FROM store_reviews WHERE user_id = u.id
        ) AS store_review_avg_rating
    FROM store_reviews sr
    JOIN stores s ON sr.store_id = s.store_id
    JOIN users u ON sr.user_id = u.id
    LEFT JOIN review_likes rl ON rl.review_id = sr.store_review_id AND rl.review_type = 'store'
    LEFT JOIN store_review_comments c ON c.store_review_id = sr.store_review_id
    GROUP BY sr.store_review_id
    ORDER BY ${sortColumn} DESC -- sortColumn이 review_like나 sr.review_date로 설정
    LIMIT ?
    `;

    const connection = await getDB();
    const [rows] = await connection.execute(query, [count]);
    return rows.map(row => ({
        store_review_id: row.store_review_id,
        review_text: row.review_text,
        review_rating: row.review_rating,
        review_image_url: row.review_image_url ? row.review_image_url.split(',') : [],
        review_date: row.review_date,
        review_like: row.review_like,
        review_comment_count: row.review_comment_count,
        user_review_info: {
            user_id: row.user_id,
            nickname: row.nickname,
            profile_picture: row.profile_picture,
            store_review_count: row.store_review_count,
            store_review_avg_rating: row.store_review_avg_rating
            ? parseFloat(row.store_review_avg_rating).toFixed(1)
            : null, // null 처리,
        },
        store_simple_info: {
            store_id: row.store_id,
            store_name: row.store_name,
            address: row.address,
            img_url: row.img_url,
        },
    }));
};
