import { getDB } from '../database/connection.js';

export const getGoodsFromDB = (count, pageNumber) => {
  const limit = parseInt(count); // 한 페이지에 표시할 항목 수
  const offset = (parseInt(pageNumber) - 1) * limit; // OFFSET 계산


  return new Promise((resolve, reject) => {
    const db = getDB();

    const query = `
      SELECT goods_id, goods_name, goods_description, goods_price, goods_stock, image_url, category, subcategory, total_sales
      FROM goods
      LIMIT ? OFFSET ?;
    `;

    db.query(query, [limit, offset], (err, results) => { // LIMIT과 OFFSET 전달
      if (err) {
        console.error('DB 쿼리 오류:', err);
        return reject(err);
      }
      resolve(results); // 결과 반환
    });
  });
};