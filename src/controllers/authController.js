import { KAKAO_CONFIG } from '../config.js'
import { saveUserToDB } from '../models/authModel.js'
import errorCode from '../util/error.js'

const KAKAO_RESET_API = KAKAO_CONFIG.rest
const REDIRECT_URI = KAKAO_CONFIG.redirect_url
const GET_KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token'
const GET_KAKAO_INFO_URL = 'https://kapi.kakao.com/v2/user/me'

export async function requestKakaoLogin(req, res) {
	if (!req.body.code) {
		return res.status(404).json(errorCode[404])
	}

	try {
		const tokenData = await getKakaoToken(req, res)
		const myInfo = await getKakaoInfo(tokenData.access_token, res)

		await saveUserToDB(
			myInfo.id,
			myInfo.kakao_account.profile.nickname,
			tokenData.access_token,
		).catch((err) => res.status(501).json(errorCode[501]))

		return res.status(201).json({
			code: 201,
			msg: 'Login Successful',
			data: {
				user_id: myInfo.id,
				nickname: myInfo.kakao_account.profile.nickname,
				token: tokenData.access_token,
			},
		})
	} catch (error) {
		return res.status(400).json(errorCode[400])
	}
}

async function getKakaoToken(req, res) {
	const url = GET_KAKAO_TOKEN_URL
	const params = new URLSearchParams({
		grant_type: 'authorization_code',
		client_id: KAKAO_RESET_API,
		redirect_uri: REDIRECT_URI,
		code: req.body.code,
	})

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type':
					'application/x-www-form-urlencoded;charset=utf-8',
			},
			body: params.toString(),
		})

		const token = await response.json()
		if (token.error == 'invalid_grant') {
			return res.status(404).json(errorCode[404])
		}
		return token
	} catch (error) {
		return res.status(500).json({
			...errorCode[500],
			detail: error,
		})
	}
}

async function getKakaoInfo(access_token, res) {
	const url = GET_KAKAO_INFO_URL
	const params = new URLSearchParams({
		secure_resource: 'false',
		property_keys: JSON.stringify(['kakao_account.profile']),
	})
	try {
		const response = await fetch(`${url}?${params.toString()}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${access_token}`,
				'Content-Type':
					'application/x-www-form-urlencoded;charset=utf-8',
			},
		})
		const data = await response.json()
		return data
	} catch (error) {
		return res.status(500).json({
			...errorCode[500],
			detail: error,
		})
	}
}
