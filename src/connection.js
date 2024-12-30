import mysql from 'mysql2/promise'
import { DB_CONFIG } from '../config.js'

let db

export const connectDB = async () => {
	try {
		db = await mysql.createConnection(DB_CONFIG)
		console.log('DB 연결 성공')
	} catch (err) {
		console.error('DB 연결 실패:', err)
		throw err
	}
}

export const getDB = () => db
