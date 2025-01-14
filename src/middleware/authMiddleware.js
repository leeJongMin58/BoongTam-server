import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
    //const authHeader = req.headers['authorization']; // 헤더에서 토큰 추출
    //const token = authHeader && authHeader.split(' ')[1]; // 'Bearer <token>'에서 실제 토큰 부분만 추출

    const token = req.headers.authorization;


    if (!token) {
        return res.status(401).json({ error: '토큰이 제공되지 않았습니다.' });
    }

    try {
        // 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // iat와 exp 변환
        decoded.issuedAt = new Date(decoded.iat * 1000).toLocaleString('ko-KR');
        decoded.expiresAt = new Date(decoded.exp * 1000).toLocaleString('ko-KR');
        delete decoded.iat; // iat 필드 제거
        delete decoded.exp; // exp 필드 제거
        req.user = decoded; // 토큰에서 추출한 사용자 정보를 req 객체에 저장
        
        next(); // 다음 미들웨어 또는 라우트로 이동
        console.log('decoded.id ',  decoded.id)
    } catch (err) {
        return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }
};
