import app from './src/app.js'
import { connectDB } from './src/database/connection.js'
import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

const PORT = process.env.PORT || 80; // env 파일의 PORT 값을 사용하고, 기본값으로 80 (aws port) 설정



const startServer = async () => {
	try {
		await connectDB() // DB 연결 초기화
		app.listen(PORT, () => {
			console.log(`서버가 ${PORT}번 포트에서 매우 잘 실행중`)
		})
	} catch (error) {
		console.error('서버 시작 중 오류:', error.message)
		process.exit(1)
	}
}

startServer()
