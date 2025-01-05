import * as mypageModel from '../models/mypageModel.js'
import { fetchUserFromKakao } from '../services/mypageService.js'
import errorCode from '../util/error.js'

// 사용자 정보 조회
export const getUserInfo = async (req, res) => {
	//const { token } = req.query;
	const token = req.headers.authorization // 헤더에서 토큰 가져오기

	if (!token) {
		return res.status(401).json(errorCode[401]); // errorCode 적용
	}

	try {
		// 카카오 API에서 사용자 ID 가져오기
		// const userid = await fetchUserFromKakao(token)

		// DB에서 사용자 정보 가져오기
		// const userInfo = await mypageService.getUserInfo(userid)

        // DB에서 사용자 정보 가져오기 (토큰 비교)
        const userInfo = await mypageModel.getUserByToken(token);

        res.status(200).json({
            code: 200,
            msg: '사용자 정보 조회 성공',
            data: userInfo,
        });
    } catch (error) {
        /*
        console.log('--에러를 json 형식으로 찍어볼 때 쓰는 코드--')
        error.toJSON = function() {
            return {
                message: this.message,
                name: this.name,
                stack: this.stack,
                customDetail: this.customDetail || 'No additional info'
            };
        };
    
        console.log('Error object in JSON format:', JSON.stringify(error, null, 2));*/
        console.error('서버 오류:', error.message);
        const status = error.status || 401;

        res.status(status).json( {
			...errorCode[401],
			detail: "토큰값이 올바르지 않습니다",
        });
    }
    };

// 사용자 정보 수정
export const updateUserInfo = async (req, res) => {
    const { type, value } = req.body;  // 수정하려는 항목과 값
    const token = req.headers.authorization; // 헤더에서 토큰 가져오기

    if (!token) {
        return res.status(401).json(errorCode[401]);
    }

    if (!type || !value) {
        return res.status(400).json({
            ...errorCode[400],
            detail: '수정할 항목과 값을 모두 제공해야 합니다.',
        });
    }

    if (value === null || value === undefined || value.trim() === '') {
        return res.status(400).json({            
            ...errorCode[400],
            detail: '수정할 값이 유효하지 않습니다.', });
    }


    try {
        // 카카오 API에서 사용자 ID 가져오기
        // const userid = await fetchUserFromKakao(token);

        // DB에서 기존 데이터 확인 (null 값 처리)
        // const existingUserInfo = await mypageService.getUserInfo(userid);

        const userInfo = await mypageModel.getUserByToken(token);

        if (!userInfo) {
            return res.status(401).json({
                ...errorCode[401],
                detail: "유효하지 않은 토큰입니다.",
            });
        }

        const userid = userInfo.user_id; // 사용자 ID 가져오기

        let updatedUser;
        /*
        // kakao 인증 시 필요한 코드
        if (existingUserInfo[type] === null || existingUserInfo[type] === undefined) {
            // 값이 없으면 INSERT (새 값 추가)
            updatedUser = await mypageService.insertUserInfo(userid, type, value);
        } else {
            // 값이 있으면 UPDATE (기존 값 수정)
            updatedUser = await mypageService.updateUserInfo(userid, type, value);
        }*/

        if (userInfo[type] === null || userInfo[type] === undefined) {
            // 값이 없으면 INSERT (새 값 추가)
            updatedUser = await mypageModel.insertUserInfo(userid, type, value);
        } else {
            // 값이 있으면 UPDATE (기존 값 수정)
            updatedUser = await mypageModel.updateUserInfo(userid, type, value);
        }
        
        // 바뀐 정보를 응답 본문에 추가
        res.status(200).json({
            code: 200,
            msg: '유저 정보가 성공적으로 변경되었습니다.',
            updated_user: updatedUser,  // 변경된 사용자 정보
        });
    } catch (error) {
        console.error('서버 오류:', error.message);
        const status = error.status || 401;

        res.status(status).json( {
			...errorCode[401],
			detail: "토큰값이 올바르지 않습니다",
        });
    }
};


// 사용자 리뷰 조회
export const getUserReview = async (req, res) => {
    const token = req.headers.authorization; // 토큰 가져오기
    const { tab, reviewId } = req.params;

    if (!token) {
        return res.status(401).json(errorCode[401]);
    }

    if (!tab || (tab !== 'store' && tab !== 'goods')) {
        return res.status(400).json({
            ...errorCode[400],
            detail: '유효하지 않은 tab 값입니다.',
        });
    }

    try {
        const user = await mypageModel.getUserByToken(token); // 토큰으로 유저 정보 조회
        if (!user) {
            return res.status(401).json({
                ...errorCode[401],
                detail: '유효하지 않은 토큰입니다.',
            });
        }

        let reviews;
        if (reviewId) {
            // 특정 리뷰 검색
            reviews = await mypageModel.findReviewById(user.user_id, tab, reviewId);
            if (!reviews) {
                return res.status(404).json({
                    ...errorCode[404],
                    detail: '해당 리뷰를 찾을 수 없습니다.',
                });
            }
        } else {
            // 전체 리뷰 검색
            reviews = await mypageModel.findReviewsByTab(user.user_id, tab);
        }

        res.status(200).json({
            code: 200,
            message: '리뷰 조회 성공',
            data: reviews,
        });
    } catch (error) {
        console.error('리뷰 조회 오류:', error.message);
        res.status(500).json(errorCode[500]);
    }
};

// 리뷰 수정
export const updateUserReview = async (req, res) => {
    const token = req.headers.authorization; // 토큰 가져오기
    const { tab, reviewId } = req.params;
    const { review_text, rating } = req.body; // 수정할 데이터

    if (!token) {
        return res.status(401).json(errorCode[401]);
    }

    if (!tab || (tab !== 'store' && tab !== 'goods')) {
        return res.status(400).json({
            ...errorCode[400],
            detail: '유효하지 않은 tab 값입니다.',
        });
    }

    try {
        const user = await mypageModel.getUserByToken(token); // 토큰으로 유저 정보 조회
        if (!user) {
            return res.status(401).json({
                ...errorCode[401],
                detail: '유효하지 않은 토큰입니다.',
            });
        }

        const result = await mypageModel.updateReviewById(user.user_id, tab, reviewId, review_text, rating);

        if (!result) {
            return res.status(404).json({
                ...errorCode[404],
                detail: '수정할 리뷰를 찾을 수 없습니다.',
            });
        }

        res.status(200).json({
            code: 200,
            message: '리뷰 수정 성공',
        });
    } catch (error) {
        console.error('리뷰 수정 오류:', error.message);
        res.status(500).json({...errorCode[500], detail: error.message});
    }
};

// 리뷰 삭제
export const deleteUserReview = async (req, res) => {
    const token = req.headers.authorization; // 토큰 가져오기
    const { tab, reviewId } = req.params;

    if (!token) {
        return res.status(401).json(errorCode[401]);
    }

    if (!tab || (tab !== 'store' && tab !== 'goods')) {
        return res.status(400).json({
            ...errorCode[400],
            detail: '유효하지 않은 tab 값입니다.',
        });
    }

    try {
        const user = await mypageModel.getUserByToken(token); // 토큰으로 유저 정보 조회
        if (!user) {
            return res.status(401).json({
                ...errorCode[401],
                detail: '유효하지 않은 토큰입니다.',
            });
        }

        const result = await mypageModel.deleteReviewById(user.user_id, tab, reviewId);

        if (!result) {
            return res.status(404).json({
                ...errorCode[404],
                detail: '삭제할 리뷰를 찾을 수 없습니다.',
            });
        }

        res.status(200).json({
            code: 200,
            message: '리뷰 삭제 성공',
        });
    } catch (error) {
        console.error('리뷰 삭제 오류:', error.message);
        res.status(500).json(errorCode[500]);
    }
};
