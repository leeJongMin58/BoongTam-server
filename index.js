import app from './src/app.js';
import { connectDB } from './src/database/connection.js';
import dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

const PORT = process.env.PORT || 8080; // 환경 변수에서 포트 가져오기, 기본값 8080

const startServer = async () => {
  try {
      await connectDB(); // DB 연결 초기화
      app.listen(PORT, () => {
          console.log(`서버가 ${PORT}번 포트에서 매우 잘 실행중`);
      });
  } catch (error) {
      console.error('서버 시작 중 오류:', error.message);
      process.exit(1);
  }
};

startServer();