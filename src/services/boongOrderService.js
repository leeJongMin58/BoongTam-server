import * as boongOrderModel from '../models/boongOrderModel.js';

// 구매내역 저장
export const createOrder = async (userId, menu_items) => {
    // 1. 주문 총액 계산
    let total_price = 0;
    const purchases = [];

    for (const item of menu_items) {
        const { menu_id, quantity } = item;

        const menu = await boongOrderModel.getMenuById(menu_id);
        if (!menu) {
            throw { code: 404, message: `Menu with id ${menu_id} not found` };
        }

        const item_price = menu.menu_price * quantity;
        total_price += item_price;

        purchases.push({
            menu_id,
            quantity,
            price: item_price,
        });
    }

    // 2. 주문 생성
    const order_id = await boongOrderModel.createOrder(userId, total_price);

    // 3. 구매내역 저장
    for (const purchase of purchases) {
        await boongOrderModel.createPurchase(order_id, purchase.menu_id, purchase.quantity, purchase.price);
    }

    return { order_id, purchases };
};


// 구매내역 조회
export const getOrders = async (userId) => {
    const orders = await boongOrderModel.getOrdersByUserId(userId);

    for (const order of orders) {
        // 각 주문에 포함된 구매내역 조회
        const purchases = await boongOrderModel.getPurchasesByOrderId(order.order_id);
        order.purchases = purchases; // 주문에 구매내역 배열 추가
    }

    return orders;
};

