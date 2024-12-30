import { getDB } from '../database/connection.js';

export const getGoodsFromDB = async (count, pageNumber) => {
  const limit = parseInt(count); // 한 페이지에 표시할 항목 수
  const offset = (parseInt(pageNumber) - 1) * limit; // OFFSET 계산


  const query = `
      SELECT goods_id, goods_name, goods_description, goods_price, goods_stock, image_url, category, subcategory, total_sales
      FROM goods
      #LIMIT ? OFFSET ?;
    `;
  const connection = getDB();
  const result = await connection.query(query, [limit, offset]); //execute
  return result[0];
};

