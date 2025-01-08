import { getDB } from '../database/connection.js';

export const ReviewLikeModel = {
  addLike: async (reviewType, reviewId, userId) => {
    let tableName, reviewColumn;
    
    if (reviewType === 'store') {
      tableName = 'store_review_likes';
      reviewColumn = 'store_review_id';
    } else if (reviewType === 'goods') {
      tableName = 'goods_review_likes';
      reviewColumn = 'goods_review_id';
    } else {
      throw new Error('Invalid review type');
    }

    const query = `
      INSERT INTO ${tableName} (${reviewColumn}, user_id)
      VALUES (?, ?)
      ON DUPLICATE KEY UPDATE ${reviewColumn} = ${reviewColumn};
    `;

    const connection = await getDB();
    const result = await connection.execute(query, [reviewId, userId]);
    return result;
  },

  removeLike: async (reviewType, reviewId, userId) => {
    let tableName, reviewColumn;
    
    if (reviewType === 'store') {
      tableName = 'store_review_likes';
      reviewColumn = 'store_review_id';
    } else if (reviewType === 'goods') {
      tableName = 'goods_review_likes';
      reviewColumn = 'goods_review_id';
    } else {
      throw new Error('Invalid review type');
    }

    const query = `
      DELETE FROM ${tableName}
      WHERE ${reviewColumn} = ? AND user_id = ?;
    `;
    
    const connection = await getDB();
    const result = await connection.execute(query, [reviewId, userId]);
    return result;
  },
};
