import { getDB } from '../database/connection.js'

export const fetchNearbyStores = async (
	lat,
	lng,
	lat_lu,
	lng_lu,
	lat_rd,
	lng_rd,
) => {
	try {
		const query = `
            SELECT 
                store_id, 
                store_name, 
                address, 
                latitude, 
                longitude, 
                heart_count,
                (6371 * ACOS(
                    COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?)) + 
                    SIN(RADIANS(?)) * SIN(RADIANS(latitude))
                )) AS distance
            FROM Stores
            WHERE 
                latitude BETWEEN ? AND ? AND 
                longitude BETWEEN ? AND ?
            ORDER BY 
                distance ASC
            LIMIT 5;
        `

		const parameters = [
			lat,
			lng, // 위도와 경도
			lat, // 위도 (두 번째 위치)
			lat_rd,
			lat_lu, // 위도 범위
			lng_rd,
			lng_lu, // 경도 범위
		]

		console.log('실행할 쿼리 및 파라미터:', query)
		console.log('파라미터:', parameters)

		const db = getDB()
		if (!db) throw new Error('DB가 초기화되지 않았습니다.')

		const rows = await db.query(query, parameters)

		if (rows && Array.isArray(rows)) {
			rows.forEach((row) => {
				if (row.store_image && row.store_image instanceof Buffer) {
					row.store_image = row.store_image.toString('base64')
				}
			})
			console.log('쿼리 결과:', rows) // 쿼리 결과 확인
			return rows
		} else {
			console.log('쿼리 결과가 배열이 아닙니다. 결과:', rows)
			return [] // 빈 배열 반환
		}
	} catch (error) {
		console.error('DB 조회 오류:', error)
		throw new Error('DB 조회 중 오류가 발생했습니다.')
	}
}
