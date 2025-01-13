import jwt from 'jsonwebtoken'

function generateToken(userId) {
    const secretKey = process.env.JWT_SECRET_KEY
    
    // 토큰 생성
    const token = jwt.sign(
        {
            user_id: userId
        },
        secretKey,
        {
            expiresIn: '24h', // 토큰 만료 시간
        }
    )
    
    return token
}

export { generateToken }