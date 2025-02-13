<h1 align="center"> 
🐠 BOONGTAM-Backend
<br> 
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=flat&logo=javascript&logoColor=black">
<img src="https://img.shields.io/badge/node.js-339933?style=flat&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/express-000000?style=flat&logo=express&logoColor=white"><br>
<img src="https://img.shields.io/badge/mariaDB-003545?style=flat&logo=mariaDB&logoColor=white">
<img src="https://img.shields.io/badge/Amazon RDS-527FFF?style=flat&logo=amazonwebservices&logoColor=white">
<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=flat&logo=amazonwebservices&logoColor=white"><br>
<img src="https://img.shields.io/badge/github-181717?style=flat&logo=github&logoColor=white">  <img src="https://img.shields.io/badge/git-F05032?style=flat&logo=git&logoColor=white">
</h1>

<h2 align="center"> 
<img src="https://i.ibb.co/1RCt8J7/long.png" alt="long" border="0"></h2>

 ## 💡 붕어탐정 앱 백엔드 프로젝트
 > 다양한 RESTful API를 설계하여 매장 정보와 사용자 리뷰를 관리합니다.

- 1️⃣ 사용자의 현재 위치를 기반으로 가까운, 또는 인기 있는 매장을 찾습니다.
- 2️⃣ 붕어빵 매장 정보를 제보하고, 제공받을 수 있습니다.
- 3️⃣ 굿즈 샵의 상품을 담고 구매할 수 있습니다.
- 4️⃣ 굿즈 및 커뮤니티 리뷰를 관리할 수 있습니다.
- 5️⃣ AWS 클라우드, RDS와 MariaDB를 활용하여 실시간 데이터를 제공합니다

## 💬 프로젝트 소개 
* 개발 기간:  2024.11.20 ~ 2025.01.23
* Inspired by **당근마켓** / 가슴속3천원 / 붕세권 
* KDT 프로젝트: 팀 Algofloww (이종민, 강시원, 김남희, 박치호, 황일찬)

|부서|이름|역할| 
|:---:|:--:|:---:|
| 팀장    | 이종민 | AWS(EC2, RDS)로 프론트엔드와 백엔드의 통합 배포 및 서버 관리, 풀스택 개발 참여, 팀원 관리와 업무 조율
| 프론트 | 박치호, 황일찬 | React Native, Figma, Expo, Google Maps SDK를 활용해 모바일 UI/UX 설계 및 지도 기반 기능 구현
| 백엔드 | 김남희, 강시원 | Node.js, Express를 활용하여 API 개발, MariaDB를 사용해 데이터 관리 및 서버 구축



* 백엔드 Git Repo: Here!
* [프론트 Git Repo](https://github.com/AlgoFloww/BoongTam-RN) 

## 💫 프로젝트 개요

### ⭐ Key Point
![Image](https://github.com/user-attachments/assets/2c80acad-0c73-4a1b-8f02-0ab7813a297e)

### ⭐ IA
<p align="center"> 
<img src="https://github.com/user-attachments/assets/78270be3-75db-40a6-925b-06b2004e6145" alt="IA" border="1"></p>




### ⭐ ERD
<details>
<summary> 🔍 breif </summary>
<p align="center">
	<img src = "https://github.com/user-attachments/assets/3abec1f4-dc28-42bb-9235-ac3215646fe3"  border="1" alt = "erd"></p>
</details>

<details>
<summary> 🔍 details </summary>
<p align="center">
	<img src = "https://github.com/user-attachments/assets/a1e51fbf-490e-4e0d-a7ba-33a126abde60"  border="1" alt = "erd"></p>
</details>
 
### ⭐ API
🪂 [명세서 노션 링크](https://airy-band-438.notion.site/1882f2b30c4780a4be81cac5af83bb6a?v=1882f2b30c4780008208000cb20bb269&pvs=4)
> 원래 컨플루언스를 사용해 API 명세서를 작성하였으나, 외부 링크 공유가 되지 않아 노션을 활용

----------------
##  📁 폴더 구조
```
📁 BOONGTAM-SERVER
├── 📁 node_modules
├── 📁 src
│   ├── 📁 controllers        # 로직 처리 컨트롤러
│   ├── 📁 database           # 데이터베이스 관련 설정
│   ├── 📁 middleware         # 미들웨어
│   ├── 📁 models             # 데이터 모델 정의
│   ├── 📁 routes             # API 라우트 정의
│   ├── 📁 services           # 서비스 계층
│   └── 📁 util               # 유틸리티 함수들
├── .gitignore             # Git에서 무시할 파일 및 폴더 목록
├── .prettierrc            # Prettier 설정 파일
├── CHANGELOG.md           # 변경 로그
├── database.sql           # 데이터베이스 초기화 스크립트
├── ENVIRONMENT.md         # 환경 설정 관련 문서
├── eslint.config.mjs      # ESLint 설정 파일
├── index.js               # 애플리케이션 진입점
├── package-lock.json     
├── package.json          
└── README.md              
```
<details>
<summary> 🔍 폴더 설명 </summary>
<div markdown="1">

|폴더  |설명  |
|--|--|
|controllers  |클라이언트의 요청을 처리하고 응답을 반환하는 역할을 합니다.  |
|database|데이터베이스와의 연결 및 관련 쿼리를 관리합니다.|
|middleware|요청과 응답의 중간 처리를 담당합니다. 예: JWT 토큰 인증|
|models|데이터베이스의 테이블 구조를 정의하는 모델 파일들이 위치합니다.|
|routes| API 엔드포인트를 정의합니다.|
|services|비즈니스 로직을 처리하는 서비스 계층입니다.|
|util|프로젝트 전반에서 사용되는 유틸리티 함수들을 포함합니다.|
</details>

  ## 📃사용 방법

1. 프로젝트를 클론합니다.
	```bash
	gh repo clone pokmonlove/BoongTam-server
	```
2.  의존성을 설치합니다.
	   ```bash
	   npm install
	   ```

  3. 추가 패키지를 설치합니다.
	 ```bash
	 npm install express
	 npm install --save-dev nodemon
	 npm install body-parser
	 npm install cors
	 npm install mysql2
	 npm install sequelize
	 npm install sequelize-cli
	 npm install jsonwebtoken
	 npm install bcrypt
	 npm install dotenv
	 npm install express-validator
	 npm install --save coolsms-node-sdk
4. 서버를 시작합니다.
	```bash
	 npm start
	```
	
<details>
<summary> 🔍 패키지 설명 </summary>
<div markdown="1">
<br>

1. 기본 패키지
 * express: 웹 프레임워크
 * nodemon: 코드 변경 시 서버 자동 재시작

2. 요청/응답
 * body-parser: 요청 본문 데이터를 파싱 (Express 4.16.0 이후 기본 내장)
 * cors: CORS(Cross-Origin Resource Sharing) 문제 해결

3. 데이터베이스

 * mysql2: MySQL 데이터베이스와 연동
 * sequelize: ORM(Object-Relational Mapping) 사용
 * sequelize-cli: Sequelize CLI 도구
4. 인증/보안

 * jsonwebtoken (JWT): 토큰 기반 인증
 * bcrypt: 비밀번호 암호화 (추가 예정)

5. 환경 변수 관리

 * dotenv: 환경 변수 파일(.env) 관리
6. 유효성 검사
 * express-validator: 요청 데이터 유효성 검사
 </details>





😎 Readme.md 작성: 김남희 | Written with [StackEdit](https://stackedit.io/)
