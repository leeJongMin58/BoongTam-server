import db from '../database/connection.js';  // db 객체가 정의된 파일 경로를 정확하게 설정

export const fetchBoongs = () => {
    return [
      { id: 1, name: '팥 붕어빵', price: 1000 },
      { id: 2, name: '슈크림 붕어빵', price: 1200 },
      { id: 3, name: '피자 붕어빵', price: 1500 },
    ];
  };
  

  // DB 연결 테스트를 위한 함수
export const testDbConnection = async () => {
    try {
        // db.pool에서 연결을 가져와서 쿼리를 실행
        const connection = await db.getConnection();  // pool에서 연결 가져오기
        // const rows = await connection.query('SELECT * FROM Stores LIMIT 1');  // 쿼리 실행
        const rows = await connection.query(`SELECT store_id, store_name, address, latitude, longitude, heart_count
        FROM Stores
        WHERE latitude BETWEEN 37.500500 AND 37.501500
        AND longitude BETWEEN 127.034500 AND 127.035500;`);  // 쿼리 실행
        
        connection.release();  // 사용 후 연결 반환
        return rows;  // 조회된 결과 반환
    } catch (error) {
        console.error('DB 연결 오류:', error);
        throw new Error('DB 연결 오류');
    }
};
