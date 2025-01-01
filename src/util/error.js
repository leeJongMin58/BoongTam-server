const errorCode = {
	400: {
		code: 400,
		message: '요청에 잘못된 파라미터가 포함되어 있습니다.',
	},
	401: {
		code: 401,
		message: '인증이 필요합니다.',
	},
	404: {
		code: 404,
		message: '요청한 리소스를 찾을 수 없습니다.',
	},
	409: {
		code: 409,
		message: '중복된 데이터 입니다..',
	},
	500: {
		code: 500,
		message: '서버 오류가 발생했습니다.',
	},
}

export default errorCode
