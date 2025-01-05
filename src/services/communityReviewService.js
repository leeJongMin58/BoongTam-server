import * as communityReviewModel from '../models/communityReviewModel.js';

export const createStoreReview = async (storeId, userId, reviewText, reviewRating, reviewPhotos) => {
    return await communityReviewModel.createStoreReview(storeId, userId, reviewText, reviewRating, reviewPhotos);
};

export const createGoodsReview = async (goodsId, userId, reviewText, reviewRating, reviewPhotos) => {
    return await communityReviewModel.createGoodsReview(goodsId, userId, reviewText, reviewRating, reviewPhotos);
};

// 다른 상품 리뷰 관련 서비스 로직 (조회, 수정 등)

