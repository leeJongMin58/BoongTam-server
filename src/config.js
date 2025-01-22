// 폴더 대신 config.js로 대체
import dotenv from 'dotenv'

// 환경 변수 불러오기
dotenv.config()

//db연결 부분
export const DB_CONFIG = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	port: process.env.DB_PORT || 3307, // 기본값을 3306으로 설정 //이거 유의
}

export const SERVER_DB_CONFIG = {
	host: process.env.SERVER_DB_HOST,
	user: process.env.SERVER_DB_USER,
	password: process.env.SERVER_DB_PASSWORD,
	database: process.env.SERVER_DB_DATABASE,
	port: process.env.SERVER_DB_PORT
}

export const KAKAO_CONFIG = {
	rest: process.env.KAKAO_REST_API_KEY,
	js: process.env.KAKAO_JS_API_KEY,
	redirect_url: process.env.KAKAO_REDIRECT_URI,
}

export const config = {
	api: {
	  apiKey: process.env.COOLSMS_API_KEY,          // .env 파일에서 API 키 읽기
	  apiSecretKey: process.env.COOLSMS_API_SECRET_KEY,  // .env 파일에서 API Secret 키 읽기
	  hpNumber: process.env.COOLSMS_HP_NUMBER,          // .env 파일에서 발신 번호 읽기
	},
  };