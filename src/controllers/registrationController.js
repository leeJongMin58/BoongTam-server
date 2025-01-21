import jwt from 'jsonwebtoken';
import { registerUserInDB, findUserInDB, checkUserIdInDB, findUserIdbyPhone } from '../models/userRegisterModel.js';
import errorCode from '../util/error.js';

// 회원가입 처리
export const registerUser = async (req, res) => {
    const { phone, id, password, address_1, address_2, zipcode, email } = req.body;

    // 필수값 체크
    if (!phone || !id || !password) {
        return res.status(400).json({...errorCode[400], detail: '전화번호, 사용자명, 비밀번호를 모두 입력해주세요.' });
    }

    try {
        // 회원가입 처리
        const result = await registerUserInDB(phone, id, password, address_1, address_2, zipcode, email);

        if (result.error) {
            return res.status(400).json({ ...errorCode[400], detail: result.error });
        }

        // 토큰 생성
        const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            code: 200,
            message: '회원가입이 완료되었습니다.',
            token: token, // 생성된 토큰 반환
        });
    } catch (err) {
        console.error('회원가입 실패:', err);
        return res.status(500).json({ ...errorCode[500], detail: '회원가입 처리 실패' });
    }
};

// 로그인 처리
export const loginUser = async (req, res) => {
    const { id, password } = req.body;

    if (!id || !password) {
        return res.status(400).json({ ...errorCode[400], detail: '사용자명과 비밀번호를 입력해주세요.' });
    }

    try {
        const user = await findUserInDB(id); 

        if (!user) {
            return res.status(400).json({ ...errorCode[400], detail: '등록되지 않은 아이디입니다' });
        }
        // 비밀번호 비교 - 일반적으로 비밀번호는 해싱해서 비교해야
        if (user.password !== password) {
            return res.status(400).json({ ...errorCode[400], detail: '아이디와 비밀번호가 일치하지 않습니다.' });
        }

        // 토큰 생성
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(200).json({
            code: 200,
            message: '로그인이 완료되었습니다.',
            token, // 생성된 토큰 반환
        });
    } catch (err) {
        console.error('로그인 실패:', err);
        return res.status(500).json({ ...errorCode[500], detail: '로그인 처리 실패' });
    }
};

// ID 중복 체크 처리
export const checkUserId = async (req, res) => {
    const { id } = req.body; // 클라이언트에서 ID를 입력받음
   // const { id } = req.params; 
    console.log("id",id)
    if (!id) {
        return res.status(400).json({...errorCode[400], detail: '아이디를 입력해주세요.' });
    }

    try {
        // ID 중복 체크
        const existingUser = await checkUserIdInDB(id); // 중복된 ID가 있는지 확인

        if (existingUser) {
            return res.status(409).json({...errorCode[409], detail: '이미 사용 중인 아이디입니다.' }); // 중복된 ID가 있으면 409 오류 반환
        }

        return res.status(200).json({ code:200, message: '사용 가능한 아이디입니다.' }); // 중복된 ID가 없으면 사용 가능 메시지 반환
    } catch (err) {
        console.error('ID 중복 체크 실패:', err);
        return res.status(500).json({...errorCode[500], detail:'ID 중복 체크 처리 실패' });
    }
};

// 아이디 찾기 처리
export const findUserId = async (req, res) => {
    const { phone } = req.body; 

    if (!phone) {
        return res.status(400).json({ ...errorCode[400], detail: '전화번호를 입력해주세요.' });
    }

    try {
        const user = await findUserIdbyPhone(phone); // 전화번호로 아이디 조회

        if (!user) {
            return res.status(404).json({ ...errorCode[400], detail: '등록되지 않은 번호입니다.' }); // 정보가 없으면 404 오류
        }
        return res.status(200).json({code: 200, user_id: user.user_id }); // 아이디 반환
    } catch (err) {
        console.error('아이디 찾기 실패:', err);
        return res.status(500).json({  ...errorCode[500], detail: '아이디 찾기 처리 실패' });
    }
};

// 비밀번호 찾기 처리
export const findPassword = async (req, res) => {

    const { id } = req.body; // 아이디를 입력받음

    if (!id) {
        return res.status(400).json({ error: '아이디를 입력해주세요.' });
    }

    try {
        const user = await findUserInDB(id); // 아이디로 사용자 조회

        if (!user) {
            return res.status(404).json({ ...errorCode[404], detail: '등록되지 않은 아이디입니다.' }); // 아이디가 없으면 404 오류
        }

        // 비밀번호 변경 페이지 URL 생성
        const changePasswordUrl='http://localhost:81/user/info';

        // 리디렉션 처리 : /쿠키로 토큰 연결해야 함
        // return res.redirect(302, changePasswordUrl);  // 302 리디렉션 응답
        return res.status(200).json({
            code: 200,
            message: '비밀번호 변경 페이지로 이동합니다.',
            changePasswordUrl, // 비밀번호 변경 페이지 URL 반환
        });

    } catch (err) {
        console.error('비밀번호 찾기 실패:', err);
        return res.status(500).json({ error: '비밀번호 찾기 처리 실패' });
    }
};
