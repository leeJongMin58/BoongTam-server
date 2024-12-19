# **BoongTam-server**

#12.16 first commit_gitignore

# 12.17 db연동 및 테스트 완료
# 12.18 환경 변수 설정을 .env 파일로 분리하여 데이터베이스 연결 정보 관리

###.env 작성요령
src 밖에 .env 파일 생성
```
MDB_HOST=localhost
MDB_USER=root          # MariaDB 사용자명
MDB_PASS=1234          # MariaDB 비밀번호 
MDB_DATABASE=test      # 사용할 데이터베이스명
MDB_PORT=3307          # MariaDB 포트 (기본 3306)
```
각자의 정보에 맞게 바꿔야 합니다! 또한 공백은 없게 해야 해요
소스코드는 /database/connection.js 
// 환경 변수 로드
import dotenv from "dotenv";
dotenv.config(); 부분 살펴보세요