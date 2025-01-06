import { KAKAO_CONFIG } from '../config.js'
import {
	saveUserToDB,
	deleteUserFromDB,
	findByNicknameFromDB,
	findUserByKakaoIdFromDB,
	updateUserTokensFromDB,
} from '../models/authModel.js'
import errorCode from '../util/error.js'

const KAKAO_RESET_API = KAKAO_CONFIG.rest
const REDIRECT_URI = KAKAO_CONFIG.redirect_url
const GET_KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token'
const GET_KAKAO_INFO_URL = 'https://kapi.kakao.com/v2/user/me'

export async function requestKakaoLogin(req, res) {
	if (!req.body.code) {
		return res.status(400).json(errorCode[400])
	}

	try {
		const tokenData = await getKakaoToken(req, res)
		const myInfo = await getKakaoInfo(tokenData.access_token, res)

		const existingUser = await findUserByKakaoIdFromDB(myInfo.id)

		if (!existingUser) {
            // 회원가입이 필요한 경우
            return res.status(403).json({
                code: 403,
                msg: '회원가입이 필요합니다',
                data: {
                    user_id: myInfo.id,
                    nickname: myInfo.kakao_account.profile.nickname
                }
            })
        }

        // 기존 회원 로그인 처리
        await updateUserTokensFromDB(myInfo.id, tokenData)
        return res.status(200).json({
            code: 200,
            msg: '로그인 성공',
            data: {
                user_id: myInfo.id,
                nickname: existingUser.nickname,
                token: tokenData.access_token,
            }
        })

    } catch (error) {
        return res.status(500).json(errorCode[500])
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
			return res.status(401).json(errorCode[401])
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

async function unlinkKakaoUser(access_token) {
	const url = 'https://kapi.kakao.com/v1/user/unlink'

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${access_token}`, // 액세스 토큰 추가
				'Content-Type':
					'application/x-www-form-urlencoded;charset=utf-8',
			},
		})

		if (!response.ok) {
			// API 호출 실패 시 에러 처리
			const errorData = await response.json()
			throw new Error(`카카오 사용자 연결 해제 실패: ${errorData.msg}`)
		}

		const data = await response.json() // 성공 응답 데이터
		return data // 연결 해제 결과 반환
	} catch (error) {
		// 에러 로깅 및 재전달
		console.error('카카오 사용자 연결 해제 중 오류:', error.message)
		throw new Error('카카오 사용자 연결 해제 중 오류: ' + error.message)
	}
}

export { unlinkKakaoUser }

//회원가입
export async function signUp(req, res) {
	const { code, nickname, email, address1, address2 } = req.body

	console.log('Request Body:', { code, nickname, email, address1, address2 })

	if (!code || !nickname || !email || !address1 || !address2) {
		return res.status(400).json(errorCode[400])
	}

	try {
		const tokenData = await getKakaoToken(req, res)
		if (!tokenData) {
			return res.status(401).json(errorCode[401])
		}

		const myInfo = await getKakaoInfo(tokenData.access_token, res)

		try {
			const saveResult = await saveUserToDB(
				myInfo.id,
				myInfo.kakao_account.profile.nickname,
				email,
				address1,
				address2,
				tokenData.access_token,
			)
		} catch (err) {
			return res.status(500).json(errorCode[500])
		}

		return res.status(201).json({
			code: 201,
			msg: '회원가입 성공',
			data: {
				id: myInfo.id,
				nickname: myInfo.kakao_account.profile.nickname,
				email,
				address1,
				address2,
				token: tokenData.access_token,
			},
		})
	} catch (error) {
		return res.status(500).json(errorCode[500])
	}
}

//회원 탈퇴
export async function quit(req, res) {
	const { code } = req.body

	console.log(`삭제할 코드: ${code}`)

	if (!code) {
		return res.status(404).json(errorCode[404])
	}
	try {
		const tokenData = await getKakaoToken(req, res)
		if (!tokenData) {
			return res.status(404).json(errorCode[404])
		}
		const myInfo = await getKakaoInfo(tokenData.access_token, res)

		const deleteResult = await deleteUserFromDB(myInfo.id)
		if (!deleteResult.success) {
			return res.status(404).json(errorCode[404])
		}

		await unlinkKakaoUser(tokenData.access_token)

		return res.status(201).json({
			code: 201,
			msg: '회원탈퇴성공',
		})
	} catch (error) {
		return res.status(500).json(errorCode[500])
	}
}
//중복체크
export async function nicknameCheck(req, res) {
	const { nickname } = req.params

	if (!nickname) {
		return res.status(400).json(errorCode[400])
	}
	try {
		const user = await findByNicknameFromDB(nickname)
		if (user) {
			return res.status(409).json(errorCode[409])
		}
		return res.status(200).json({
			code: 201,
			msg: '사용가능한 닉네임입니다',
			data: user,
		})
	} catch (error) {
		return res.status(500).json(errorCode[500])
	}
}
