import { getDB } from '../database/connection.js'

export const getGoodsFromDB = async (count, pageNumber, category, subcategory) => {
	const limit = parseInt(count) // 한 페이지에 표시할 항목 수
	const offset = (parseInt(pageNumber) - 1) * limit // OFFSET 계산
	
	let query = `
		SELECT goods_id, goods_name, goods_price, image_url, 
			   category, subcategory, total_sales
		FROM goods
	`
	
	const params = []

	// 카테고리와 서브카테고리가 있는 경우에만 WHERE 절 추가
	if (category && subcategory) {
		query += ` WHERE category = ? AND subcategory = ?`
		params.push(category, subcategory)
	} else if (category) {
		query += ` WHERE category = ?`
		params.push(category)
	} else if (subcategory) {
		query += ` WHERE subcategory = ?`
		params.push(subcategory)
	}

	// 페이징 처리 추가
	query += ` LIMIT ? OFFSET ?`
	params.push(limit, offset)

	const connection = await getDB()
	const [rows] = await connection.query(query, params)
	return rows
}

//핫붕템
export const getHotGoodsFromDB = async (count) => {
	const limit = parseInt(count) // 가져올 항목 수
	const query = `
      SELECT goods_id, goods_name, goods_description, goods_price, goods_stock, image_url, category, subcategory, total_sales
      FROM goods
      ORDER BY total_sales DESC
      LIMIT ?;
    `
	const connection = getDB()
	const result = await connection.query(query, limit)
	return result[0]
}
//장바구니 가져오기
export const getCartFromDB = async (userId, count, pageNumber) => {
	const limit = parseInt(count)
	const offset = (parseInt(pageNumber) - 1) * limit
	const query = `
		SELECT 
			c.cart_id,
			c.quantity,
			c.added_at,
			g.goods_id,
			g.goods_name,
			g.goods_price,
			g.image_url as goods_image_url
		FROM 
			cart c
			JOIN goods g ON c.goods_id = g.goods_id
		WHERE 
			c.user_id = ?
		LIMIT ? OFFSET ?;
	`

	try {
		const connection = getDB();
		const [results] = await connection.query(query, [userId, limit, offset]);
		return results;
	} catch (err) {
		console.error("DB 쿼리 오류:", err);
		throw err
	}
}
//장바구니 담기
export const addCartToDB = async (userId, goodsId, quantity) => {
	const db = getDB();

	const query = `
			INSERT INTO cart (user_id, goods_id, quantity)
			VALUES (?, ?, ?)
			ON DUPLICATE KEY UPDATE
				quantity = quantity + VALUES(quantity); 
	`;
	const values = [userId, goodsId, quantity];

	try {
		// 첫 번째 쿼리 실행
		const [result] = await db.query(query, values);

		if (result.affectedRows > 0) {
			// JOIN을 사용하여 cart와 goods 테이블의 정보를 함께 가져옴
			const productQuery = `
				SELECT g.goods_id, g.goods_name, g.image_url, g.goods_price
				FROM cart c
				JOIN goods g ON c.goods_id = g.goods_id
				WHERE c.user_id = ? AND c.goods_id = ?;
			`;
			// 두 번째 쿼리 실행
			const [product] = await db.query(productQuery, [userId, goodsId]);

			return product[0]; // 첫 번째 상품 정보 반환
		} else {
			return null; // 실패 시 null 반환
		}
	} catch (error) {
		console.error("DB 쿼리 오류:", error);
		throw error; // 에러 발생 시 throw
	}
}
//장바구니 삭제
export const removeFromCartDB = async (userId, cartId) => {
	const query = `
		DELETE FROM cart 
		WHERE cart_id = ? AND user_id = ?;
	`

	try {
		const connection = getDB();
		const [result] = await connection.query(query, [cartId, userId]);
		return result.affectedRows > 0;
	} catch (error) {
		console.error("DB 쿼리 오류:", error);
		throw error
	}
}
//구매내역 가져오기
export const fetchPurchaseHistory = async (userId) => {
	//const db = getDB()
	const connection = getDB();
	try {
		const query = `
		  SELECT 
			DATE(ph.purchase_date) AS purchase_date, 
				SUM(ph.quantity * g.goods_price) AS total_amount, 
				ph.status,
				JSON_ARRAYAGG(
				  JSON_OBJECT(
					'goods_name', g.goods_name,
					'image_url', g.image_url
				  )
				) AS goods_info
		  FROM purchase_history ph
		  JOIN goods g ON ph.goods_id = g.goods_id
		  WHERE ph.user_id = ?
		  GROUP BY DATE(ph.purchase_date), ph.status
		  ORDER BY DATE(ph.purchase_date) DESC;
		`;
		const [result] = await connection.query(query, [userId]);
		return result
		// db.query(query, [userId], (error, rows) => {
		// 	if (error) {
		// 		console.error("구매 내역 조회 오류:", error);
		// 		throw error;
		// 	}
			
		// 	if (rows.length > 0) {
		// 		return { success: true, history: rows };
		// 	} else {
		// 		return { success: false, message: "구매 내역이 없습니다." };
		// 	}
		// });
	} catch (error) {
		console.error("구매 내역 조회 오류:", error);
		throw error;
	}
}
