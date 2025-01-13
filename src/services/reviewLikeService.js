import { ReviewLikeModel as ReviewModel} from '../models/reviewLikeModel.js';

export const ReviewLikeService = {
    updateLikeStatus: async ({ reviewType, reviewId, like, userId }) => {
      if (!['store', 'goods'].includes(reviewType)) {
        throw new Error('Invalid review type');
      }
  
      if (like) {
        // 하트 추가
        await ReviewModel.addLike(reviewType, reviewId, userId);
      } else {
        // 하트 취소
        await ReviewModel.removeLike(reviewType, reviewId, userId);
      }
    },
  };