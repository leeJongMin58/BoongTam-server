import fetch from 'node-fetch';
import { getGoodsFromDB } from '../models/goodsModel.js';

export const fetchUserFromKakao = async (token) => {
  const response = await fetch('https://kapi.kakao.com/v2/user/me', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('카카오 API 오류');
  }

  const data = await response.json();
  return data.id; // 사용자 ID 반환
};
//일반 붕템 가져오기 
export const fetchGoodsFromDB = async (count, pageNumber) => {
  return await getGoodsFromDB(count, pageNumber);
};