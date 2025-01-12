import * as boongOrderService from '../services/boongOrderService.js';
import testvalidateTokenAndUser from '../util/authUtils.js'
import errorCode from '../util/error.js'


// 구매내역 저장
// 구매내역 저장
export const createOrder = async (req, res) => {
    const token = req.headers.authorization;
    const { menu_items } = req.body; // [{menu_id: 1, quantity: 2}, ...]

    if (!token) {
        return res.status(400).json({ ...errorCode[400], detail: '토큰값을 확인해주세요.' });
    }

    if (!menu_items || !Array.isArray(menu_items) || menu_items.length === 0) {
        return res.status(400).json({ ...errorCode[400], detail: "menu_items를 확인해 주세요." });
    }

    try {
        const userId = await testvalidateTokenAndUser(token);
        console.log(userId);

        const result = await boongOrderService.createOrder(userId, menu_items);
        console.log("result: ", result);

        res.status(200).json({
            code: 200,
            message: "주문 내역 저장 완료",
            order_id: result.order_id,
            purchases: result.purchases,
        });
    } catch (error) {
        console.error('Error placing order:', error.message);
        res.status(error.code || 500).json({
            code: error.code || 500,
            message: error.message,
            detail: error.detail || '붕탐 오더 중 오류가 발생했습니다.',
        });
    }
};


// 구매내역 조회
export const getOrders = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(400).json({ ...errorCode[400], detail: '토큰값을 확인해주세요.' });
    }

    try {
        const userId = await testvalidateTokenAndUser(token);
        console.log(userId);

        const orders = await boongOrderService.getOrders(userId);

        res.status(200).json({
            code: 200,
            orders,
        });
    } catch (error) {
        console.error('Error retrieving orders:', error.message);
        res.status(error.code || 500).json({
            code: error.code || 500,
            message: error.message,
            detail: error.detail || '붕탐 오더 구매내역 조회 중 오류가 발생했습니다.',
        });
    }
};
