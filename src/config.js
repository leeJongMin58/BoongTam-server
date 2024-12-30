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


export const SMART_TRACKER_API_KEY = process.env.SMART_TRACKER_API_KEY
export const DB_PORT = process.env.DB_PORT

export const KAKAO_CONFIG = {
	JS_KEY : process.env.KAKAO_JS_API_KEY,
	REST_KEY : process.env.KAKAO_REST_API_KEY,
	REDIRECT_URI : process.env.KAKAO_REDIRECT_URI
}

