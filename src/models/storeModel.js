import { getDB } from '../database/connection.js'

// 매장 상세 정보 조회
export const getStoreDetails = async (storeid) => {
	const query = 'SELECT * FROM Stores WHERE store_id = ?'
	const connection = await getDB()
	const result1 = await connection.execute(query, [storeid])

	return result1
}

// 매장 메뉴 정보 조회
export const getStoreMenu = async (storeid) => {
	const query = 'SELECT * FROM Menu WHERE store_id = ?'
	const connection = await getDB()
	const result2 = await connection.execute(query, [storeid])

	return result2
}

// 매장 사진 정보 조회
export const getStorePhotos = async (storeid, filter) => {
	let query = 'SELECT * FROM Photos WHERE store_id = ?'
	const params = [storeid]

	if (filter) {
		query += ' AND photo_category = ?'
		params.push(filter)
	}

	const connection = await getDB()
	const result3 = await connection.execute(query, params)

	return result3
}

// 매장 리뷰 정보 조회
// users 테이블과 조인하여 닉네임을 포함한 리뷰 데이터를 가져오도록
export const getStoreReviews = async (storeid, sort) => {
	let query = `
        SELECT 
            sr.*,
            u.nickname
        FROM 
            Store_reviews sr
        JOIN 
            users u
        ON 
            sr.user_id = u.id
        WHERE 
            sr.store_id = ?
    `
	const params = [storeid]

	if (sort === 'latest') {
		query += ' ORDER BY sr.review_date DESC'
	} else if (sort === 'most_liked') {
		query += ' ORDER BY sr.review_heart DESC'
	}

	const connection = await getDB()
	const [result4] = await connection.execute(query, params)

	return result4
}
