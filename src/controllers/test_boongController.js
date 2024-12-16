import { fetchBoongs } from '../services/boongService.js';

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
