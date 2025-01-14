import * as mypageModel from '../models/mypageModel.js'
import errorCode from '../util/error.js'

// 사용자 정보 조회
export const getUserInfo = async (req, res) => {
    try {
        // 미들웨어에서 저장된 사용자 정보 사용
        const decodedUser  = req.user;
        const userId = decodedUser.id;
        const userInfo = await mypageModel.getUserInfo(userId);
        if (!userInfo) {
            return res.status(404).json({
                code: 404,
                msg: '사용자 정보를 찾을 수 없습니다.',
            });
        }
        console.log("userInfo", userId)
        // 사용자 정보 반환
        return res.status(200).json({
            code: 200,
            msg: '사용자 정보 조회 성공',
            data: userInfo,
        });
    } catch (error) {
        console.error('사용자 정보 조회 실패:', error.message);

        // 에러 응답 처리
        return res.status(500).json({
            code: 500,
            msg: '사용자 정보 조회 중 문제가 발생했습니다.',
            error: error.message,
        });
    }
};

// 사용자 정보 수정
export const updateUserInfo = async (req, res) => {
    const { type, value } = req.body;  // 수정하려는 항목과 값
    // const token = req.headers.authorization; // 헤더에서 토큰 가져오기
    const decodedUser = req.user; 

    if (!decodedUser) {
        return res.status(401).json({
            code: 401,
            msg: '유효하지 않은 토큰입니다.',
        });
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
        //const userInfo = await mypageModel.getUserByToken(token);
        const userId = decodedUser.id; // 디코딩된 사용자 ID 가져오기
        const userInfo = await mypageModel.getUserInfo(userId); // 사용자 정보 조회

        if (!userInfo) {
            return res.status(401).json({
                ...errorCode[401],
                detail: "유효하지 않은 토큰입니다.",
            });
        }

        //const userid = userInfo.user_id; // 사용자 ID 가져오기

        let updatedUser;

        if (userInfo[type] === null || userInfo[type] === undefined) {
            // 값이 없으면 INSERT (새 값 추가)
            updatedUser = await mypageModel.insertUserInfo(userId, type, value);
        } else {
            // 값이 있으면 UPDATE (기존 값 수정)
            updatedUser = await mypageModel.updateUserInfo(userId, type, value);
        }
        
        // 바뀐 정보를 응답 본문에 추가
        res.status(200).json({
            code: 200,
            msg: '유저 정보가 성공적으로 변경되었습니다.',
            updated_user: updatedUser,  // 변경된 사용자 정보
        });
    } catch (error) {
        console.error('서버 오류:', error.message);
        const status = error.status || 500;

        res.status(status).json( {
			...errorCode[500],
			detail: "서버 오류 입니다",
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


export const deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id; // 미들웨어에서 가져온 사용자 ID

        // 사용자 삭제
        const result = await mypageModel.deleteUser(userId);

        if (!result.success) {
            return res.status(404).json({
                code: 404,
                msg: result.message,
            });
        }

        return res.status(200).json({
            code: 200,
            msg: '회원탈퇴가 완료되었습니다.',
        });
    } catch (error) {
        console.error('회원탈퇴 실패:', error.message);
        return res.status(500).json({
            code: 500,
            msg: '회원탈퇴 처리 중 문제가 발생했습니다.',
        });
    }
};
