import { getDB } from '../database/connection.js';

export const createStoreReport = async (lat, lng, address, name, storeType, appearanceDay, open_hour, close_hour, paymentMethod, isOrderOnline = false) => {
    const connection = await getDB();

    try {
        // 1. `stores` 테이블에 데이터 삽입
        const storeQuery = `
            INSERT INTO stores 
            (store_name, address, latitude, longitude, is_order_online, created_at) 
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        const [storeResult] = await connection.execute(storeQuery, [
            name,
            address,
            lat,
            lng,
            isOrderOnline ? 1 : 0 // true는 1, false는 0으로 변환
        ]);
        const storeId = storeResult.insertId; // 생성된 store_id

        // 2. `store_details` 테이블에 데이터 삽입
        const storeDetailsQuery = `
            INSERT INTO store_details 
            (store_id, store_type, appearance_day, open_hour, close_hour, payment_method) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        await connection.execute(storeDetailsQuery, [
            storeId,
            storeType,
            appearanceDay.join(','), // MySQL SET 형식으로 변환
            open_hour, close_hour,
            paymentMethod.join(',')  // MySQL SET 형식으로 변환
        ]);

        console.log('데이터 삽입 완료:', storeId);
        return storeId;
    } catch (error) {
        console.error('데이터 삽입 오류:', error.message);
        throw error;
    }
};
