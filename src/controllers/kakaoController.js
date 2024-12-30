import { saveUserToDB } from '../models/loginModel.js';  // 모델 파일에서 saveUser 함수 가져오기


//사용자 정보 저장
const saveUser = async (req, res) => {
    const { id, nickname,token } = req.body;

    if (!id || !nickname) {
        return res.status(400).json({ message: '사용자 ID와 닉네임이 필요합니다.' });
    }

    try {
        const result = await saveUserToDB(id, nickname,token);  // 모델의 saveUser 호출

        // 쿼리 실행 결과 확인
        console.log('DB 저장 결과:', result); // 결과 출력
        
        if (result.affectedRows > 0) {
            res.status(200).json({ message: '사용자 데이터 저장 성공!', user: { id, nickname,token} });
        } else {
            res.status(400).json({ message: '사용자 데이터 저장 실패 (변경된 데이터 없음)' });
        }
    } catch (error) {
        console.error('DB 저장 중 오류:', error);
        res.status(500).json({ message: '서버 오류로 인해 데이터 저장에 실패했습니다.', error: error.message });
    }
};

export { saveUser };


// 추가정보 입력
const register = async (req, res) => {
    const { username, email, address1,address2, phone } = req.body;

    console.log('요청 데이터:', {username, email, address1, address2, phone });

    if (!username || !email || !address1 || !phone || !address2) {
        return res.status(400).json({ message: '필수 데이터가 누락되었습니다.' });
    }

    try {
        const result = await saveUserToDB2({username, email, address1, address2, phone });

        console.log('DB 저장 결과:', result);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: '사용자 데이터 저장 성공!', user: {username, email, address1, address2, phone } });
        } else {
            res.status(400).json({ message: '사용자 데이터 저장 실패 (변경된 데이터 없음)' });
        }
    } catch (error) {
        console.error('DB 저장 중 오류:', error);
        res.status(500).json({ message: '서버 오류로 인해 데이터 저장에 실패했습니다.', error: error.message });
    }
};

export { register };


//메인 굿즈 조회 핸들러 
