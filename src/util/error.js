const errorCode = {
	400: {
		code: 400,
		message: '요청에 잘못된 파라미터가 포함되어 있습니다.',
	},
	401: {
		code: 401,
		message: '인증이 필요합니다.',
	},
	403: {
		code: 403,
		message: '접근이 금지되었습니다.',
	},
	404: {
		code: 404,
		message: '요청한 리소스를 찾을 수 없습니다.',
	},
	500: {
		code: 500,
		message: '서버 오류가 발생했습니다.',
	},
	501: {
		code: 501,
		message: '데이터베이스 연결에 실패했습니다.',
	},
}

export default errorCode
