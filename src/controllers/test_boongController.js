import { fetchBoongs } from '../services/test_boongService.js';
import { saveUser } from '../models/test_boongModel.js';
import { testDbConnection } from '../services/test_boongService.js';

export const getBoongList = (req, res) => {
  try {
    const boongs = fetchBoongs(); // 서비스에서 붕어빵 리스트 가져오기
    res.status(200).json({
       code: 200,
       message:"통신 성공",
      data: boongs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch boong-a-bangs.',
    });
  }
};
// DB 연결 테스트를 위한 컨트롤러 함수
export const checkDbConnection = async (req, res) => {
  try {
      const result = await testDbConnection();
      if (result.length > 0) {
          res.status(200).json({
              code: 200,
              msg: 'DB 연결이 성공적으로 이루어졌습니다.',
              data: result,
          });
      } else {
          res.status(404).json({
              code: 404,
              msg: 'DB에서 데이터를 찾을 수 없습니다.',
          });
      }
  } catch (error) {
      console.error('DB 연결 확인 중 오류 발생:', error);
      res.status(500).json({
          code: 500,
          msg: '서버 오류가 발생했습니다.',
      });
  }
};
// 사용자 정보 저장 API 핸들러
const registerUser = async (req, res) => {
    const { user_id, username, user_text } = req.body;

    try {
        const result = await saveUser(user_id, username, user_text);
        res.status(200).json(result);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: '데이터 저장 실패', error: error.message });
    }
};

export { registerUser };
