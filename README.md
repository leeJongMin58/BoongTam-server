# **BoongTam-server**

### 12.16 first commit_gitignore
### 12.16 first commit_gitignore

### 12.17 db연동 및 테스트 완료
### 12.18 환경 변수 설정을 .env 파일로 분리하여 데이터베이스 연결 정보 관리
### 12.18 환경 변수 설정을 .env 파일로 분리하여 데이터베이스 연결 정보 관리

### .env 작성요령 (12월 26일 업데이트)
src 밖에 .env 파일 생성
```
DB_HOST=localhost
DB_USER=root          # MariaDB 사용자명
DB_PASSWORD=1234          # MariaDB 비밀번호
DB_DATABASE=test      # 사용할 데이터베이스명
DB_PORT=3307          # MariaDB 포트 (기본 3306)

```
- 각자의 정보에 맞게 바꿔야 합니다! 또한 공백은 없게 해야 해요
- 소스코드는 /config.js  부분 살펴보세요
- 각자의 정보에 맞게 바꿔야 합니다! 또한 공백은 없게 해야 해요
- 소스코드는 /config.js  부분 살펴보세요

### 12.23 sql 쿼리 추가
1. vscode 확장 프로그램 "MySQL" 설치
2. Connect to server에 자신의 db 정보 입력
 - HOST, PORT, USERNAME, Password
3. src/database.sql 에서 하나씩 ▷RUN 실행
3. src/database.sql 에서 하나씩 ▷RUN 실행

### 12월 23일 map api 실제 작동 방식으로 수정
### 12월 23일 map api 실제 작동 방식으로 수정
- DB에 가상의 매장 15개 생성
    1) 엔드포인트로 받아온 (query형식의) 좌표값을 활용하여 화면 안에 있는 매장들 추린 후
    2) 현재 위치에서 가장 가까운 5개의 매장 뽑아올 수 있게 하였습니다

### 12월 26일 map api 및 기타 파일 수정
### 12월 26일 map api 및 기타 파일 수정
- 시원 님과 db 호출 방식 통일
- test용으로 만들었던 api 삭제
- map -> boong으로 이름 변경
  >> {{base}}boong?lat=37.501&lng=127.035&lat_lu=37.5015&lng_lu=127.0355&lat_rd=37.500000&lng_rd=127.0345 
  이로 인해 URL 변경


# 12월 28일
- 메인_맵 api 완성
    - boong?

# 12월 30일
- 메인_매장 상세 정보 api 완성
    - boong/store?


# 12월 31일
- 마이페이지 간단 수정 및 회원 정보 수정 api 추가

# 1월 1일
authUtil 및 다른 model에 errorcode 통합 적용

# 1월 2일
AWS 클라우드 DB로 연동
메인, 맵 API 대폭 수정

> sql 수정 사항
1. CREATE TABLE `photos` (
    `photo_id` int NOT NULL AUTO_INCREMENT,
    `store_id` int NOT NULL,
    `photo_url` varchar(255) NOT NULL,
    `photo_category` enum('inner', 'outer', 'menu') NOT NULL, #여기 수정 영어로
    PRIMARY KEY (`photo_id`),
    KEY `store_id` (`store_id`),
    CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
)

2. CREATE TABLE `store_reviews` (
    `store_review_id` int(11) NOT NULL AUTO_INCREMENT,
    `store_id` int(11) NOT NULL,
    `user_id` bigint(20) NOT NULL,
    `review_text` text DEFAULT NULL,
    `review_rating` int(11) DEFAULT NULL,
    `review_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(), #TIMESTAMP로 변경
    `review_heart` int(11) DEFAULT 0,
    `store_review_photo_url` varchar(255) NOT NULL,
    PRIMARY KEY (`store_review_id`),
    KEY `store_id` (`store_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `store_reviews_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`),
    CONSTRAINT `store_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) 


3. goods_orders 테이블 DROP

4. store_reviews, goods_reviews 에 modified_date 추가
ALTER TABLE `goods_reviews`
ADD COLUMN `modified_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE `store_reviews`
ADD COLUMN `modified_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

5. 리뷰에 누르는 하트 테이블 추가
CREATE TABLE `review_likes` (
    `like_id` INT NOT NULL AUTO_INCREMENT,
    `review_type` ENUM('goods', 'store') NOT NULL, -- 리뷰 유형을 구분
    `review_id` INT NOT NULL, -- 리뷰 ID (goods_review_id 또는 store_review_id)
    `user_id` BIGINT NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`like_id`),
    UNIQUE KEY `unique_user_review` (`review_type`, `review_id`, `user_id`), -- 중복 방지
    KEY `review_id` (`review_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `review_likes_ibfk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
