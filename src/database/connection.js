import mysql from 'mysql2'
import { DB_CONFIG } from '../config.js';

// 환경 변수 로드
let db;


// // MariaDB 연결 풀 생성
// const pool = mariadb.createPool({
//   host: process.env.MDB_HOST, // MariaDB 서버 주소 (로컬일 경우 localhost)
//   user: process.env.MDB_USER, // 데이터베이스 사용자
//   password: process.env.MDB_PASS, // 비밀번호
//   database: process.env.MDB_DATABASE, // 사용할 데이터베이스
//   port: process.env.MDB_PORT, // MariaDB 포트 (기본값: 3306)
// });

// // 연결 풀 반환
// async function getConnection() {
//   try {
//     const conn = await pool.getConnection();
//     return conn;
//   } catch (err) {
//     console.error("데이터베이스 연결 오류:", err);
//     throw err;
//   }
// }

// `pool`을 default로 내보내기
// export default pool;

// 필요한 경우 `getConnection`도 내보내기
// export { getConnection };
export const connectDB = async () => {
  try {
      db = await mysql.createConnection(DB_CONFIG);
      console.log('DB 연결 성공');
  } catch (err) {
      console.error('DB 연결 실패:', err);
      throw err;
  }
};

export const getDB = () => db;
