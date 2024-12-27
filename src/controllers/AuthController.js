// import { saveUserToDB } from '../models/LoginModel'

export async function requestKakaoLogin(params) {
    console.log('requestKakaoLogin')

    return 
}

// const saveUser = async (req, res) => {
// 	const { id, nickname } = req.body

// 	if (!id || !nickname) {
// 		return res
// 			.status(400)
// 			.json({ message: '사용자 ID와 닉네임이 필요합니다.' })
// 	}

// 	try {
// 		const result = await saveUserToDB(id, nickname) // 모델의 saveUser 호출

// 		// 쿼리 실행 결과 확인
// 		console.log('DB 저장 결과:', result) // 결과 출력

// 		if (result.affectedRows > 0) {
// 			res.status(200).json({
// 				message: '사용자 데이터 저장 성공!',
// 				user: { id, nickname },
// 			})
// 		} else {
// 			res.status(400).json({
// 				message: '사용자 데이터 저장 실패 (변경된 데이터 없음)',
// 			})
// 		}
// 	} catch (error) {
// 		console.error('DB 저장 중 오류:', error)
// 		res.status(500).json({
// 			message: '서버 오류로 인해 데이터 저장에 실패했습니다.',
// 			error: error.message,
// 		})
// 	}
// }

// export { saveUser }
