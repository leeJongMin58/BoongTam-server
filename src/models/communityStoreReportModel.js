import { getDB } from '../database/connection.js';

export const createStoreReport = async (lat, lng, address, name, storeType, appearanceDay, open_hour, close_hour, paymentMethod, isOrderOnline = false) => {
    const connection = await getDB();

    try {
        // 기존 매장 데이터가 있는지 확인
        const findStoreQuery = `
            SELECT store_id FROM stores WHERE address = ?
        `;
        const [storeRows] = await connection.execute(findStoreQuery, [address]);
        let msg;
        let storeId;

        if (storeRows.length > 0) {
            // 기존 데이터가 있으면 갱신
            storeId = storeRows[0].store_id;

            // `stores` 테이블 업데이트
            const updateStoreQuery = `
                UPDATE stores 
                SET store_name = ?, latitude = ?, longitude = ?, is_order_online = ?, updated_at = CURRENT_TIMESTAMP 
                WHERE store_id = ?
            `;
            await connection.execute(updateStoreQuery, [
                name,
                lat,
                lng,
                isOrderOnline ? 1 : 0, // true는 1, false는 0으로 변환
                storeId
            ]);

            // `store_details` 테이블 업데이트
            const updateStoreDetailsQuery = `
                UPDATE store_details 
                SET store_type = ?, appearance_day = ?, open_hour = ?, close_hour = ?, payment_method = ? 
                WHERE store_id = ?
            `;
            await connection.execute(updateStoreDetailsQuery, [
                storeType,
                appearanceDay.join(','), // MySQL SET 형식으로 변환
                open_hour,
                close_hour,
                paymentMethod.join(','), // MySQL SET 형식으로 변환
                storeId
            ]);
            msg = '매장 정보 갱신 완료';
            console.log('기존 매장 데이터 갱신 완료:', storeId);
            //return storeId;
        } else {
            // 기존 데이터가 없으면 새로 삽입
            // `stores` 테이블에 데이터 삽입
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
            storeId = storeResult.insertId; // 생성된 store_id

            // `store_details` 테이블에 데이터 삽입
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
            msg = '신규 매장 제보 완료';
            console.log('새 매장 데이터 저장 완료:', storeId);
            
        }
        return { storeId, msg };
    } catch (error) {
        console.error('데이터 처리 오류:', error.message);
        throw error;
    }
};

