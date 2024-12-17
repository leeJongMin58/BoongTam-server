import { fetchBoongs } from '../services/test_boongService.js';
import { saveUser } from '../models/boongModel.js';

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
