import fetch from 'node-fetch';
import * as mypageModel from '../models/mypageModel.js';

// 카카오 API를 통해 사용자 정보 가져오기
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
	return data.id // 카카오 사용자 ID 반환
}


// DB에서 사용자 정보 가져오기 (일단 안 씀)
export const getUserInfo = async (userId) => {
    return await mypageModel.getUserInfo(userId);
};

// DB에서 토큰으로 사용자 정보 가져오기
export const getUserByToken = async (token) => {
    return await mypageModel.getUserByToken(token);
};

// 사용자 정보 수정
export const updateUserInfo = async (userId, type, value) => {
    try {
        // DB에서 사용자 정보 업데이트
        const updatedUser = await mypageModel.updateUserInfo(userId, type, value);
        return updatedUser;
    } catch (error) {
        throw new Error('사용자 정보 수정 실패: ' + error.message);
    }
};


// 사용자 리뷰 불러오기 (tab에 따라)
export const getReviewsByTab = async (userId, tab) => {
    return await mypageModel.findReviewsByTab(userId, tab);
};
// 사용자 리뷰 불러오기 (리뷰 id에 따라)
export const getReviewById = async (userId, tab, reviewId) => {
    return await mypageModel.findReviewById(userId, tab, reviewId);
};


// 리뷰 수정
export const updateReview = async (userId, tab, reviewId, review_text, rating) => {
    return await mypageModel.updateReviewById(userId, tab, reviewId, review_text, rating);
};

// 리뷰 삭제
export const deleteReview = async (userId, tab, reviewId) => {
    return await mypageModel.deleteReviewById(userId, tab, reviewId);
};
