# 1월 1일 버전
CREATE DATABASE Boong_database;

USE Boong_database;

CREATE TABLE `users` (
    `id` BIGINT NOT NULL,
    `nickname` VARCHAR(10) NOT NULL,
    `user_name` VARCHAR(10) DEFAULT NULL,
    `email` VARCHAR(320) DEFAULT NULL,
    `address_1` VARCHAR(225) DEFAULT NULL,
    `address_2` VARCHAR(225) DEFAULT NULL,
    `ph` VARCHAR(15) DEFAULT NULL,
    `profile_picture` VARCHAR(255) DEFAULT NULL,
    `points` INT DEFAULT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `nickname` (`nickname`),
    UNIQUE KEY `email` (`email`),
    CONSTRAINT `users_chk_1` CHECK (
        -- 닉네임 길이와 문자 조건
        LENGTH(`nickname`) BETWEEN 4 AND 10
    ),
    CONSTRAINT `users_chk_2` CHECK (
        -- 이메일 형식 검증 (간단한 LIKE 사용)
        `email` LIKE '%_@__%.__%'
    ),
    CONSTRAINT `users_chk_3` CHECK (
        -- 전화번호에 숫자만 포함되도록 검증
        `ph` REGEXP '^[0-9]+$'
    ),
    CONSTRAINT `users_chk_4` CHECK (
        -- 포인트가 0 이상이어야 함
        `points` >= 0
    )
);

CREATE TABLE `goods` (
   `goods_id` int NOT NULL AUTO_INCREMENT,
    `goods_name` varchar(100) NOT NULL,
    `goods_description` text,
    `goods_price` decimal(10, 2) NOT NULL,
    `goods_stock` int NOT NULL DEFAULT '0',
    `image_url` varchar(255) DEFAULT NULL,
    `Category` varchar(255) NOT NULL,
    `SubCategory` varchar(255) NOT NULL,
    `total_sales` int DEFAULT '0',
    PRIMARY KEY (`goods_id`)
)

CREATE TABLE `cart` (
    `cart_id` int NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL,
    `goods_id` int NOT NULL,
    `quantity` int NOT NULL,
    `added_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `goods_name` varchar(255) NOT NULL DEFAULT '기본이름',
    `goods_price` int NOT NULL DEFAULT '0',
    `goods_image_url` varchar(255) NOT NULL DEFAULT 'www.image.com',
    PRIMARY KEY (`cart_id`),
    KEY `user_id` (`user_id`),
    KEY `goods_id` (`goods_id`),
    CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`goods_id`)

)

CREATE TABLE `stores` (
    `store_id` int NOT NULL AUTO_INCREMENT,
    `store_name` varchar(255) NOT NULL,
    `address` varchar(225) NOT NULL,
    `latitude` decimal(9, 6) DEFAULT NULL,
    `longitude` decimal(9, 6) DEFAULT NULL,
    `description` text,
    `thumbnail_url` varchar(255) DEFAULT NULL,
    `heart_count` int DEFAULT '0',
    `heart_status` tinyint(1) DEFAULT NULL,
    `is_order_online` tinyint(1) NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`store_id`)
) 

CREATE TABLE `store_reviews` (
    `store_review_id` int(11) NOT NULL AUTO_INCREMENT,
    `store_id` int(11) NOT NULL,
    `user_id` bigint(20) NOT NULL,
    `review_text` text DEFAULT NULL,
    `review_rating` int(11) DEFAULT NULL,
    `review_date` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `review_heart` int(11) DEFAULT 0,
    `store_review_photo_url` varchar(255) NOT NULL,
    PRIMARY KEY (`store_review_id`),
    KEY `store_id` (`store_id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `store_reviews_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`),
    CONSTRAINT `store_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
)

CREATE TABLE `comments` (
    `comment_id` int NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL,
    `review_id` int NOT NULL,
    `comment_text` text NOT NULL,
    `comment_heart` int DEFAULT '0',
    `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`comment_id`),
    KEY `user_id` (`user_id`),
    KEY `review_id` (`review_id`),
    CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`review_id`) REFERENCES `store_reviews` (`store_review_id`)
) 

CREATE TABLE `purchase_history` (
    `purchase_id` int NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL,
    `goods_id` int NOT NULL,
    `quantity` int NOT NULL,
    `purchase_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` varchar(50) NOT NULL DEFAULT 'completed',
    PRIMARY KEY (`purchase_id`),
    KEY `user_id` (`user_id`),
    KEY `goods_id` (`goods_id`),
    CONSTRAINT `purchase_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `purchase_history_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`goods_id`)
) 

CREATE TABLE `exchange_return` (
    `exchange_return_id` int NOT NULL AUTO_INCREMENT,
    `purchase_id` int NOT NULL DEFAULT '1',
    `reason` text NOT NULL,
    `status` enum(
        'pending',
        'completed',
        'rejected'
    ) DEFAULT 'pending',
    `request_date` datetime DEFAULT CURRENT_TIMESTAMP,
    `processed_date` datetime DEFAULT NULL,
    `type` enum('exchange', 'return') NOT NULL,
    `goods_id` int NOT NULL DEFAULT '1',
    `quantity` int NOT NULL,
    PRIMARY KEY (`exchange_return_id`)
) 


CREATE TABLE `goods_orders` (
    `order_id` int NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL,
    `goods_id` int NOT NULL,
    `quantity` int NOT NULL,
    `order_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `status` varchar(50) NOT NULL DEFAULT 'pending',
    PRIMARY KEY (`order_id`),
    KEY `user_id` (`user_id`),
    KEY `goods_id` (`goods_id`),
    CONSTRAINT `goods_orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `goods_orders_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`goods_id`)
) 

CREATE TABLE `goods_reviews` (
    `goods_review_id` int NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL,
    `goods_id` int NOT NULL,
    `goods_rating` tinyint NOT NULL,
    `review_text` text,
    `review_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `goods_review_photo_url` varchar(255) NOT NULL,
    PRIMARY KEY (`goods_review_id`),
    KEY `user_id` (`user_id`),
    KEY `goods_id` (`goods_id`),
    CONSTRAINT `goods_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `goods_reviews_ibfk_2` FOREIGN KEY (`goods_id`) REFERENCES `goods` (`goods_id`),
    CONSTRAINT `goods_reviews_chk_1` CHECK (
        (
            `goods_rating` between 1 and 5
        )
    )
) 


CREATE TABLE `likes_for_comments` (
    `like_id` int NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL,
    `comment_id` int NOT NULL,
    `liked_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`like_id`),
    KEY `user_id` (`user_id`),
    KEY `comment_id` (`comment_id`),
    CONSTRAINT `likes_for_comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `likes_for_comments_ibfk_2` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`)
) 

CREATE TABLE `likes_for_reviews` (
    `like_id` int NOT NULL AUTO_INCREMENT,
    `user_id` bigint NOT NULL,
    `review_id` int NOT NULL,
    `liked_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`like_id`),
    KEY `user_id` (`user_id`),
    KEY `review_id` (`review_id`),
    CONSTRAINT `likes_for_reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `likes_for_reviews_ibfk_2` FOREIGN KEY (`review_id`) REFERENCES `store_reviews` (`store_review_id`)
) 

CREATE TABLE `menu` (
    `menu_id` int NOT NULL AUTO_INCREMENT,
    `store_id` int NOT NULL,
    `menu_photo_url` varchar(255) NOT NULL,
    `menu_name` varchar(255) NOT NULL,
    `menu_description` text,
    `menu_price` decimal(10, 2) DEFAULT NULL,
    PRIMARY KEY (`menu_id`),
    KEY `store_id` (`store_id`),
    CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
)

CREATE TABLE `photos` (
    `photo_id` int NOT NULL AUTO_INCREMENT,
    `store_id` int NOT NULL,
    `photo_url` varchar(255) NOT NULL,
    `photo_category` enum('inner', 'outer', 'menu') NOT NULL,
    PRIMARY KEY (`photo_id`),
    KEY `store_id` (`store_id`),
    CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
)


CREATE TABLE `store_details` (
    `store_id` int NOT NULL,
    `store_type` enum('길거리', '매장', '편의점') NOT NULL,
    `appearance_day` set(
        '월',
        '화',
        '수',
        '목',
        '금',
        '토',
        '일'
    ) NOT NULL,
    `appearance_time` varchar(100) NOT NULL,
    `payment_method` set('현금', '카드', '붕탐오더') NOT NULL,
    PRIMARY KEY (`store_id`),
    CONSTRAINT `store_details_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`)
)


CREATE TABLE `user_ban` (
    `user_id` bigint NOT NULL,
    `ban_reason` varchar(255) NOT NULL,
    `ban_count` int NOT NULL DEFAULT '0',
    `ban_until` datetime DEFAULT NULL,
    `is_permanent` tinyint(1) DEFAULT '0',
    PRIMARY KEY (`user_id`),
    CONSTRAINT `user_ban_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) 


