import app from './app.js';
import { connectDB } from './database/connection.js';

const PORT = process.env.PORT || 3002;

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