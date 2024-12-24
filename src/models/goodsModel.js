import { getDB } from '../database/connection.js';

export const getGoodsFromDB = (count) => {
  return new Promise((resolve, reject) => {
    const db = getDB();

    const query = `
      SELECT goods_id, goods_name, goods_description, goods_price, goods_stock, image_url, category, subcategory
      FROM goods
      LIMIT ?
    `;

    db.query(query, [parseInt(count)], (err, results) => {
      if (err) {
        console.error('DB 쿼리 오류:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
};
