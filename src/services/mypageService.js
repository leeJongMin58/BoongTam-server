import fetch from 'node-fetch'
import { getUserInfo as fetchUserInfoFromDB } from '../models/mypageModel.js'

// 카카오 API를 통해 사용자 정보 가져오기
export const fetchUserFromKakao = async (token) => {
	const response = await fetch('https://kapi.kakao.com/v2/user/me', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	if (!response.ok) {
		throw new Error('카카오 API 오류')
	}

	const data = await response.json()
	return data.id // 카카오 사용자 ID 반환
}

// DB에서 사용자 정보 가져오기
export const getUserInfo = async (userId) => {
	return await fetchUserInfoFromDB(userId)
}
