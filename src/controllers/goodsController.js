import { fetchUserFromKakao, fetchGoodsFromDB } from '../services/goodsService.js';

  const getGoods = async (req, res) => {
  const { token, count = 10 } = req.query;

  if (!token) {
    return res.status(400).json({ msg: '토큰이 제공되지 않았습니다.' });
  }

  try {
    // 카카오 API에서 사용자 정보 가져오기
    const userId = await fetchUserFromKakao(token);

    // DB에서 굿즈 정보 가져오기
    const goods = await fetchGoodsFromDB(count);

    res.json({
      code: 200,
      msg: '통신 성공',
      count: goods.length,
      nextpage: goods.length === parseInt(count),
      data: goods,
    });
  } catch (error) {
    console.error('서버 오류:', error.message);
    res.status(500).json({ msg: '서버 오류', error: error.message });
  }
};

export { getGoods }