import * as goodsService from '../services/goodsService.js';
import validateTokenAndUser from '../util/authUtils.js';

const getGoods = async (req, res) => {
  const { count = 10, page = 1 } = req.query;
  const pageNumber = parseInt(page);
  const token = req.headers.authorization;
  console.log("controller")
  try {
    const userId = await validateTokenAndUser(token);

    const goods = await goodsService.fetchGoodsFromDB(count, pageNumber);
    console.log("여기?")
    res.json({
      code: 200,
      msg: '통신 성공',
      count: goods.length,
      nextpage: goods.length === parseInt(count),
      data: goods,
    });
  } catch (error) {
    res.status(error.status || 500).json({ msg: error.message || '서버 오류' });
  }
};


export {getGoods}