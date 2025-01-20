import { getDB } from '../database/connection.js'

export const fetchNearbyStores = async (lat, lng, radius = 5, count = 5, sortOrder = 'ORDER BY distance ASC') => {
	try {
		// 반경 필터링을 위한 쿼리 작성
		const query = `
            SELECT 
                store_id, 
                store_name, 
                address, 
                latitude, 
                longitude, 
                heart_count,
				is_order_online,
                (6371 * ACOS(
                    COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?)) + 
                    SIN(RADIANS(?)) * SIN(RADIANS(latitude))
                )) AS distance
            FROM stores
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
