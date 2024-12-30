// import { saveUserToDB } from '../models/LoginModel'

// todo 임시로 키값 다이렉트 입력
const KAKAO_RESET_API = 'f65039729f458b8346277ff5a9799a1a'
const REDIRECT_URI = 'http://192.168.162.10:8081/'

export async function requestKakaoLogin(req, res) {
	if (!req.body.code) {
		return res.status(400).json({
			code: 400,
			message: 'authorizaion code가 없습니다.',
		})
	}

	try {
		const tokenData = await getKakaoToken(req, res)
        const myInfo = await getKakaoInfo(tokenData.access_token, req, res)

		return res.status(201).json({
			code: 201,
			msg: 'Login successful',
			data: {
				user_id: myInfo.id,
				nickname: myInfo.kakao_account.profile.nickname,
				token: tokenData.access_token,
			},
		})
	} catch (error) {
		return res.status(401).json({
			code: 401,
			msg: 'Invalid access token',
		})
	}
}

async function getKakaoToken(req, res) {
	const url = 'https://kauth.kakao.com/oauth/token'
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
			console.log('invalid_grant')
			return res.status(401).json({
				code: 401,
				msg: 'Invalid access token',
			})
		}
		return token
	} catch (error) {
		console.error('Error in getKakaoToken:', error)
		return res.status(401).json({
			code: 400,
			msg: 'no access token',
		})
	}
}

async function getKakaoInfo(ACCESS_TOKEN, req, res) {
    const url = 'https://kapi.kakao.com/v2/user/me'
    const params = new URLSearchParams({
        secure_resource: 'false',
        property_keys: JSON.stringify(['kakao_account.profile']),
    });
    try {
		const response = await fetch(`${url}?${params.toString()}`, {
			method: 'GET',
			headers: {
                'Authorization' : `Bearer ${ACCESS_TOKEN}`,
				'Content-Type':'application/x-www-form-urlencoded;charset=utf-8',
			},
		})
        const data = await response.json();
        return data;
    } catch (error) {
        return res.status(401).json({
			code: 500,
			msg: 'kakao server error',
		})
    }
}
