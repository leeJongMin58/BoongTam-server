# **BoongTam-server**
 > 붕어빵 앱 서버 프로젝트

- 붕어빵 매장 정보를 제보하고, 제공받을 수 있습니다.
- 굿즈 샵의 상품을 담고 구매할 수 있습니다.
- 굿즈 및 커뮤니티 리뷰를 관리할 수 있습니다.
- AWS 클라우드 DB를 활용하여 실시간 데이터를 제공하며, 다양한 API를 통해 매장 정보와 리뷰를 처리합니다.
--------------------------

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

6. store_details 테이블 alter
- appearance_time열은 사용 x, nullable로 바꿈
- 가게 여는 시간과 닫는 시간을 각각 저장하는 TIME 타입 컬럼 추가

ALTER TABLE `store_details`
ADD COLUMN `open_hour` TIME NOT NULL AFTER `appearance_time`,
ADD COLUMN `close_hour` TIME NOT NULL AFTER `open_hour`;

7. 리뷰 좋아요 테이블 분리
- 데이터 무결성을 위해 매장 리뷰 좋아요 테이블과 굿즈 리뷰 좋아요 테이블로 분리

CREATE TABLE `store_review_likes` (
    `like_id` INT(11) NOT NULL AUTO_INCREMENT,
    `store_review_id` INT(11) NOT NULL,
    `user_id` BIGINT(20) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`like_id`),
    UNIQUE KEY `unique_user_review` (`store_review_id`, `user_id`),
    FOREIGN KEY (`store_review_id`) REFERENCES `store_reviews` (`store_review_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `goods_review_likes` (
    `like_id` INT(11) NOT NULL AUTO_INCREMENT,
    `goods_review_id` INT(11) NOT NULL,
    `user_id` BIGINT(20) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`like_id`),
    UNIQUE KEY `unique_user_review` (`goods_review_id`, `user_id`),
    FOREIGN KEY (`goods_review_id`) REFERENCES `goods_reviews` (`goods_review_id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

8. goods_reviews_comments 테이블과 goods_reviews_comments_likes 테이블 추가

CREATE TABLE `goods_reviews_comments` (
    `comment_id` INT(11) NOT NULL AUTO_INCREMENT,
    `goods_review_id` INT(11) NOT NULL,
    `user_id` BIGINT(20) NOT NULL,
    `comment_text` TEXT NOT NULL,
    `comment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`comment_id`),
    KEY `goods_review_id` (`goods_review_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `goods_reviews_comments_fk_1` FOREIGN KEY (`goods_review_id`) REFERENCES `goods_reviews` (`goods_review_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `goods_reviews_comments_fk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `goods_reviews_comments_likes` (
    `like_id` INT(11) NOT NULL AUTO_INCREMENT,
    `comment_id` INT(11) NOT NULL,
    `user_id` BIGINT(20) NOT NULL,
    `like_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`like_id`),
    UNIQUE KEY `unique_like` (`comment_id`, `user_id`),
    KEY `comment_id` (`comment_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `goods_reviews_comments_likes_fk_1` FOREIGN KEY (`comment_id`) REFERENCES `goods_reviews_comments` (`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `goods_reviews_comments_likes_fk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

9. 
CREATE TABLE `store_review_comments` (
    `comment_id` INT(11) NOT NULL AUTO_INCREMENT,
    `store_review_id` INT(11) NOT NULL,
    `user_id` BIGINT(20) NOT NULL,
    `comment_text` TEXT NOT NULL,
    `comment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `modified_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`comment_id`),
    KEY `store_review_id` (`store_review_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `store_review_comments_fk_1` FOREIGN KEY (`store_review_id`) REFERENCES `store_reviews` (`store_review_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `store_review_comments_fk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `store_reviews_comments_likes` (
    `like_id` INT(11) NOT NULL AUTO_INCREMENT,
    `comment_id` INT(11) NOT NULL,
    `user_id` BIGINT(20) NOT NULL,
    `like_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`like_id`),
    UNIQUE KEY `unique_like` (`comment_id`, `user_id`),
    KEY `comment_id` (`comment_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `store_reviews_comments_likes_fk_1` FOREIGN KEY (`comment_id`) REFERENCES `store_review_comments` (`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `store_reviews_comments_likes_fk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

10. 붕어빵 주문내역 테이블 추가
- boong_purchases: 낱개 품목 구매내역 저장
- boong_orders: boong_purchases의 정보로 총 가격 및 구매 날짜 저장

CREATE TABLE `boong_orders` (
    `order_id` INT(11) NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT(20) NOT NULL,
    `total_price` DECIMAL(10, 2) NOT NULL,
    `order_date` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP(),
    PRIMARY KEY (`order_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE `boong_purchases` (
    `purchase_id` INT(11) NOT NULL AUTO_INCREMENT,
    `order_id` INT(11) NOT NULL,
    `menu_id` INT(11) NOT NULL,
    `quantity` INT(11) NOT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (`purchase_id`),
    KEY `order_id` (`order_id`),
    KEY `menu_id` (`menu_id`),
    CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `boong_orders` (`order_id`),
    CONSTRAINT `purchases_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `menu` (`menu_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
