import fetch from 'node-fetch'

// 아임포트 토큰 발급
export const getIamportToken = async () => {
	const response = await fetch('https://api.iamport.kr/users/getToken', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			imp_key: process.env.IAMPORT_API_KEY,
			imp_secret: process.env.IAMPORT_API_SECRET,
		}),
	})

	const result = await response.json()
	if (result.code === 0) {
		return result.response.access_token
	} else {
		throw new Error(`토큰 발급 실패: ${result.message}`)
	}
}

// 결제 검증
export const verifyPayment = async (imp_uid, merchant_uid, token) => {
	const response = await fetch(`https://api.iamport.kr/payments/${imp_uid}`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${token}` },
	})

	const result = await response.json()
	return response.ok && result.response.merchant_uid === merchant_uid
}
