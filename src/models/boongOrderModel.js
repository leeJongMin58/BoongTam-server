import { getDB } from '../database/connection.js';


// 메뉴 ID로 메뉴 정보 조회
export const getMenuById = async (menuID) => {
    const query = 'SELECT menu_price FROM menu WHERE menu_id = ?';
    const connection = await getDB();
    const [result] = await connection.execute(query, [menuID]);
    return result.length ? result[0] : null;
};

// 주문 생성
export const createOrder = async (userId, total_price) => {
    const query = `
        INSERT INTO boong_orders (user_id, total_price)
        VALUES (?, ?)
    `;
    const connection = await getDB();
    const [result] = await connection.execute(query, [userId, total_price]);
    return result.insertId; // order_id 반환
};

// 구매내역 생성
export const createPurchase = async (order_id, menu_id, quantity, price) => {
    const query = `
        INSERT INTO boong_purchases (order_id, menu_id, quantity, price)
        VALUES (?, ?, ?, ?)
    `;
    const connection = await getDB();
    const [result] = await connection.execute(query, [order_id, menu_id, quantity, price]);
    return result.insertId; // purchase_id 반환
};

// 사용자 ID로 주문 목록 조회
export const getOrdersByUserId = async (userId) => {
    const query = `
        SELECT 
            o.order_id,
            o.total_price,
            o.order_date
        FROM boong_orders o
        WHERE o.user_id = ?
        ORDER BY o.order_date DESC
    `;
    const connection = await getDB();
    const [rows] = await connection.execute(query, [userId]);
    return rows;
};

// 주문 ID로 구매내역 조회
export const getPurchasesByOrderId = async (orderId) => {
    const query = `
        SELECT 
            p.menu_id,
            m.menu_name,
            p.quantity,
            p.price
        FROM boong_purchases p
        JOIN menu m ON p.menu_id = m.menu_id
        WHERE p.order_id = ?
    `;
    const connection = await getDB();
    const [rows] = await connection.execute(query, [orderId]);
    return rows;
};
