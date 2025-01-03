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
