import mysql from 'mysql2/promise';

// DB 연결 설정
const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root', // 사용자 이름
    password: '12345678', // 비밀번호
    database: 'test', // 데이터베이스 이름
});

console.log('MariaDB 연결 성공');

export default db;
