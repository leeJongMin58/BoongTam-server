export const protectedRouteHandler = (req, res) => {
    const user = req.user; // 인증된 사용자 정보
    res.status(200).json({
        message: '성공입니다 이 API는 인증된 사용자만 접근할 수 있습니다.',
        user,
    });
};
