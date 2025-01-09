import fetch from 'node-fetch';
import * as goodsModel from '../models/goodsModel.js';

export const fetchUserFromKakao = async (token) => {
	const response = await fetch('https://kapi.kakao.com/v2/user/me', {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`,
		},
	})

	if (!response.ok) {
		throw new Error('카카오 API 오류')
	}

	const data = await response.json()
	return data.id // 사용자 ID 반환
}
//일반 붕템 가져오기
export const fetchGoodsFromDB = async (count, pageNumber,category,subcategory) => {
  return await goodsModel.getGoodsFromDB(count, pageNumber,category,subcategory);
};
//핫붕템 가져오기
export const fetchHotGoodsFromDB = async (count) =>{
  return await goodsModel.getHotGoodsFromDB (count)
}
//장바구니 가져오기
export const fetchCartFromDB = async (userId, count, pageNumber) => {
  return await goodsModel.getCartFromDB(userId, count, pageNumber)
}
//장바구니 담기
export const fetchAddCartFromDB = async (userId, goodsId, quantity) => {
  return await goodsModel.addCartToDB(userId, goodsId, quantity)
}
//장바구니 삭제
export const fetchRemoveFromCartFromDB = async (userId, cartId) => {
  return await goodsModel.removeFromCartDB(userId, cartId)
}
//구매내역 가져오기
export const fetchPurchaseHistoryFromDB = async (userId) => {
  return await goodsModel.fetchPurchaseHistory(userId)
}
