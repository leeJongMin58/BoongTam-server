import { getDB } from '../database/connection.js'

export const fetchNearbyStores = async (lat, lng, radius = 5, count = 5, sortOrder = 'ORDER BY distance ASC') => {
	try {
		// 반경 필터링을 위한 쿼리 작성
		// 매장 및 리뷰 개수를 가져오는 쿼리
		const query = `
            SELECT 
                s.store_id, 
                s.store_name, 
                s.address, 
                s.latitude, 
                s.longitude,
                s.thumbnail_url,
                s.heart_count,
                s.is_order_online,
                (6371 * ACOS(
                    COS(RADIANS(?)) * COS(RADIANS(s.latitude)) * COS(RADIANS(s.longitude) - RADIANS(?)) + 
                    SIN(RADIANS(?)) * SIN(RADIANS(s.latitude))
                )) AS distance,
                COUNT(r.store_review_id) AS review_count
            FROM stores s
            LEFT JOIN store_reviews r ON s.store_id = r.store_id
            GROUP BY s.store_id
            HAVING distance <= ? 
            ${sortOrder}
            LIMIT ?;
        `;

		// 쿼리에 필요한 파라미터 설정
		const parameters = [lat, lng, lat, radius, count];
		console.log('파라미터:', parameters);

		const db = getDB();
		if (!db) throw new Error('DB가 초기화되지 않았습니다.');

		// 쿼리 실행
		const [rows] = await db.query(query, parameters);

		// 이미지 데이터가 있을 경우 처리
		if (rows && Array.isArray(rows)) {
			rows.forEach((row) => {
				if (row.store_image && row.store_image instanceof Buffer) {
					row.store_image = row.store_image.toString('base64');
				}
			});
			console.log('쿼리 결과:', rows);
			return rows;
		} else {
			console.log('쿼리 결과가 배열이 아닙니다. 결과:', rows);
			return [];
		}
	} catch (error) {
		console.error('DB 조회 오류:', error);
		throw new Error('DB 조회 중 오류가 발생했습니다.');
	}
};
