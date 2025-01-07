import * as communityReviewModel from '../models/communityReviewModel.js';

// 매장 리뷰 작성
export const createStoreReview = async (storeId, userId, reviewText, reviewRating, reviewPhotos) => {
    return await communityReviewModel.createStoreReview(storeId, userId, reviewText, reviewRating, reviewPhotos);
};

// 굿즈 리뷰 작성
export const createGoodsReview = async (goodsId, userId, reviewText, reviewRating, reviewPhotos) => {
    return await communityReviewModel.createGoodsReview(goodsId, userId, reviewText, reviewRating, reviewPhotos);
};

// 리뷰 조회
export const getGoodsReviews = async (sort, count) => {
    try {
        return await communityReviewModel.findGoodsReviews(sort, count);
    } catch (error) {
        throw new Error('리뷰 데이터를 가져오는 데 실패했습니다: ' + error.message);
    }
};