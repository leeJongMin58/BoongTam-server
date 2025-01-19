import { getDB } from '../database/connection.js'

export const getGoodsFromDB = async (
	count,
	pageNumber,
	category,
	subcategory,
) => {
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
		const connection = getDB()
		const [results] = await connection.query(query, [userId, limit, offset])
		return results
	} catch (err) {
		console.error('DB 쿼리 오류:', err)
		throw err
	}
}
//장바구니 담기
export const addCartToDB = async (userId, goodsId, quantity) => {
	const db = getDB()

	try {
		// 중복 확인
		const [existing] = await db.query(
			'SELECT quantity FROM cart WHERE user_id = ? AND goods_id = ?',
			[userId, goodsId],
		)

		if (existing.length > 0) {
			// 중복 데이터가 있다면 업데이트
			await db.query(
				'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND goods_id = ?',
				[quantity, userId, goodsId],
			)
		} else {
			// 중복 데이터가 없다면 삽입
			await db.query(
				'INSERT INTO cart (user_id, goods_id, quantity) VALUES (?, ?, ?)',
				[userId, goodsId, quantity],
			)
		}

		// 업데이트된 데이터 반환
		const [product] = await db.query(
			'SELECT g.goods_id, g.goods_name, g.image_url, g.goods_price, c.quantity ' +
				'FROM cart c JOIN goods g ON c.goods_id = g.goods_id ' +
				'WHERE c.user_id = ? AND c.goods_id = ?',
			[userId, goodsId],
		)

		return product[0]
	} catch (error) {
		console.error('DB 오류:', error)
		throw error
	}
}
//장바구니 삭제
export const removeFromCartDB = async (userId, cartId) => {
	const query = `
		DELETE FROM cart 
		WHERE cart_id = ? AND user_id = ?;
	`

	try {
		const connection = getDB()
		const [result] = await connection.query(query, [cartId, userId])
		return result.affectedRows > 0
	} catch (error) {
		console.error('DB 쿼리 오류:', error)
		throw error
	}
}
//구매내역 가져오기
export const fetchPurchaseHistory = async (userId) => {
	const connection = getDB()
	try {
		const query = `
			SELECT 
				DATE(ph.purchase_date) AS purchase_date, 
				SUM(ph.quantity * g.goods_price) AS total_amount, 
				ph.status,
				JSON_ARRAYAGG(
					JSON_OBJECT(
						'goods_name', g.goods_name,
						'image_url', g.image_url,
						'quantity', ph.quantity,
						'price', g.goods_price
					)
				) AS goods_info
			FROM purchase_history ph
			JOIN goods g ON ph.goods_id = g.goods_id
			WHERE ph.user_id = ?
			GROUP BY DATE(ph.purchase_date), ph.status
			ORDER BY DATE(ph.purchase_date) DESC;
		`

		const [rows] = await connection.query(query, [userId])

		// JSON 파싱 처리
		const processedRows = rows.map((row) => ({
			...row,
			goods_info: JSON.parse(row.goods_info), // 문자열을 JSON으로 파싱
		}))

		if (processedRows.length > 0) {
			return { success: true, history: processedRows }
		} else {
			return { success: false, message: '구매 내역이 없습니다.' }
		}
	} catch (error) {
		console.error('구매 내역 조회 오류:', error)
		throw error
	}
}
//굿즈 상세보기
export const fetchGoodsDetails = async (goods_id) => {
	const connection = getDB()

	const query = `
	  SELECT 
		goods_id, 
		goods_name, 
		goods_description, 
		goods_price, 
		goods_stock, 
		image_url, 
		Category, 
		SubCategory, 
		total_sales
	  FROM goods
	  WHERE goods_id = ?;
	`

	try {
		const rows = await connection.query(query, [goods_id])

		if (rows.length > 0) {
			return { success: true, goods: rows[0] }
		} else {
			return { success: false, message: '해당 굿즈를 찾을 수 없습니다.' }
		}
	} catch (error) {
		console.error('굿즈 상세 조회 오류:', error)
		throw error
	}
}

//구매내역 상세보기
export const fetchPurchaseHistoryDetail = async (userId, purchase_id) => {
	const connection = getDB()

	const query = `
        SELECT 
        DATE(ph.purchase_date) AS purchase_date, 
        SUM(ph.quantity * g.goods_price) AS total_amount, 
        ph.status,
        JSON_OBJECT(
            'address1', u.address_1,
            'address2', u.address_2,
            'zipcode', u.zipcode,
            'points', u.points
        ) AS userdata, -- 사용자 정보를 JSON으로 묶음
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'goods_name', g.goods_name,
                'image_url', g.image_url,
                'quantity', ph.quantity,
                'price', g.goods_price
            )
        ) AS goods_info
        FROM purchase_history ph
        JOIN goods g ON ph.goods_id = g.goods_id
        JOIN users u ON ph.user_id = u.id 
        WHERE ph.user_id = ? AND ph.purchase_id = ?
        GROUP BY DATE(ph.purchase_date), ph.status, u.address_1, u.address_2, u.zipcode, u.points
        ORDER BY DATE(ph.purchase_date) DESC;
    `

	try {
		const [rows] = await connection.query(query, [userId, purchase_id])

		// JSON 파싱 처리
		const processedRows = rows.map((row) => ({
			...row,
			goods_info: JSON.parse(row.goods_info), // goods_info를 JSON으로 파싱
			userdata: JSON.parse(row.userdata), // userdata도 JSON으로 파싱
		}))

		if (processedRows.length > 0) {
			return { success: true, history: processedRows }
		} else {
			return { success: false, message: '구매 내역이 없습니다.' }
		}
	} catch (error) {
		console.error('구매 내역 조회 오류:', error)
		throw error
	}
}

// 교환신청 페이지
export const fetchExchange = async (userId, purchase_id) => {
	const connection = getDB()
	const query = `SELECT 
        DATE(ph.purchase_date) AS purchase_date, 
        SUM(ph.quantity * g.goods_price) AS total_amount, 
        ph.status,
        JSON_OBJECT(
            'address1', u.address_1,
            'address2', u.address_2,
            'zipcode', u.zipcode
        ) AS userdata, -- 사용자 정보를 JSON으로 묶음
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'goods_name', g.goods_name,
                'image_url', g.image_url,
                'price', g.goods_price
            )
        ) AS goods_info
        FROM purchase_history ph
        JOIN goods g ON ph.goods_id = g.goods_id
        JOIN users u ON ph.user_id = u.id 
        WHERE ph.user_id = ? AND ph.purchase_id = ?
        GROUP BY DATE(ph.purchase_date), ph.status, u.address_1, u.address_2, u.zipcode, u.points;`

	try {
		const [rows] = await connection.query(query, [userId, purchase_id])
		const processedRows = rows.map((row) => ({
			...row,
			goods_info: JSON.parse(row.goods_info), // goods_info를 JSON으로 파싱
			userdata: JSON.parse(row.userdata), // userdata도 JSON으로 파싱
		}))

		if (processedRows.length > 0) {
			return { success: true, history: processedRows }
		} else {
			return { success: false, message: '구매 내역이 없습니다.' }
		}
	} catch (error) {
		console.error('교환 페이지 조회 오류 ', error)
		throw error
	}
}
// 교환 요청
export const fetchPostExchange = async (
	userId,
	purchase_id,
	type,
	reason,
	goods_id,
	quantity,
) => {
	console.log('이게이유', reason)
	const connection = getDB()
	const query = `
	  INSERT INTO exchange_return 
	  (purchase_id, reason, status, request_date, type, goods_id, quantity) 
	  VALUES (?, ?, 'pending', NOW(), ?, ?, ?)
	`
	console.log('타입:', type)

	try {
		const [result] = await connection.query(query, [
			purchase_id,
			reason,
			type,
			goods_id,
			quantity,
		])

		return {
			success: true,
			history: {
				exchange_return_id: result.insertId, // 삽입된 교환/반품 요청 ID
				purchase_id,
				reason,
				status: 'pending',
				request_date: new Date(),
				type,
				goods_id,
				quantity,
			},
		}
	} catch (error) {
		console.error('교환/반품 요청 처리 중 오류:', error)
		throw error
	}
}
//결제 화면 가져오기
export const fetchCheckout = async (userId, cart_id) => {
	const connection = getDB()

	console.log('유저 ID:', userId)
	console.log('장바구니 ID:', cart_id)
	const query = `
        SELECT 
            u.address_1, 
            u.address_2, 
            u.zipcode,
			u.points, 
            c.quantity, 
            g.goods_id, 
            g.goods_name, 
            g.goods_price, 
            g.image_url
        FROM cart c
        JOIN users u ON u.id = c.user_id
        JOIN goods g ON g.goods_id = c.goods_id
        WHERE c.user_id = ? AND c.cart_id = ?;
    `

	try {
		// 데이터베이스 쿼리 실행
		const [rows] = await connection.query(query, [userId, cart_id])
		console.log(rows)

		if (rows.length > 0) {
			// 필요한 정보를 가공하여 반환
			const processedRows = rows.map((row) => ({
				goods_id: row.goods_id,
				goods_name: row.goods_name,
				goods_price: row.goods_price,
				image_url: row.image_url,
				quantity: row.quantity,
				total_price: row.goods_price * row.quantity, // 총 금액 계산
				user: {
					address1: row.address_1,
					address2: row.address_2,
					zipcode: row.zipcode,
					points: row.points,
				},
			}))

			return { success: true, history: processedRows }
		} else {
			return { success: false, message: '가져올 결제 내역이 없습니다.' }
		}
	} catch (error) {
		console.error('결제 페이지 조회 오류', error)
		throw error
	}
}
// 반품 페이지 가져오기
export const fetchReturn = async (userId, purchase_id) => {
	const connection = getDB()
	const query = `SELECT 
        DATE(ph.purchase_date) AS purchase_date, 
        SUM(ph.quantity * g.goods_price) AS total_amount, 
        ph.status,
        JSON_OBJECT(
            'address1', u.address_1,
            'address2', u.address_2,
            'zipcode', u.zipcode
        ) AS userdata, -- 사용자 정보를 JSON으로 묶음
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'goods_name', g.goods_name,
                'image_url', g.image_url,
                'price', g.goods_price
            )
        ) AS goods_info
        FROM purchase_history ph
        JOIN goods g ON ph.goods_id = g.goods_id
        JOIN users u ON ph.user_id = u.id 
        WHERE ph.user_id = ? AND ph.purchase_id = ?
        GROUP BY DATE(ph.purchase_date), ph.status, u.address_1, u.address_2, u.zipcode, u.points;`

	try {
		const [rows] = await connection.query(query, [userId, purchase_id])
		const processedRows = rows.map((row) => ({
			...row,
			goods_info: JSON.parse(row.goods_info), // goods_info를 JSON으로 파싱
			userdata: JSON.parse(row.userdata), // userdata도 JSON으로 파싱
		}))

		if (processedRows.length > 0) {
			return { success: true, history: processedRows }
		} else {
			return { success: false, message: '구매 내역이 없습니다.' }
		}
	} catch (error) {
		console.error('교환 페이지 조회 오류 ', error)
		throw error
	}
}
// 반품 신청하기
export const fetchPostReturn = async (
	userId,
	purchase_id,
	type,
	reason,
	goods_id,
	quantity,
) => {
	console.log('이게이유', reason)
	const connection = getDB()
	const query = `
	  INSERT INTO exchange_return 
	  (purchase_id, reason, status, request_date, type, goods_id, quantity) 
	  VALUES (?, ?, 'pending', NOW(), ?, ?, ?)
	`
	console.log('타입:', type)

	try {
		const [result] = await connection.query(query, [
			purchase_id,
			reason,
			type,
			goods_id,
			quantity,
		])

		return {
			success: true,
			history: {
				exchange_return_id: result.insertId, // 삽입된 교환/반품 요청 ID
				purchase_id,
				reason,
				status: 'pending',
				request_date: new Date(),
				type,
				goods_id,
				quantity,
			},
		}
	} catch (error) {
		console.error('교환/반품 요청 처리 중 오류:', error)
		throw error
	}
}
