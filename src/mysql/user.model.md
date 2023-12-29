CREATE TABLE `users` (
`user_id` int NOT NULL AUTO_INCREMENT,
`user_age` INT DEFAULT '0',
`user_status` INT DEFAULT '0',
`user_name` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
`user_email` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
`user_address` VARCHAR(128) COLLATE utf8mb4_bin DEFAULT NULL,
-- KEY INDEX
PRIMARY KEY (`user_id`),
KEY `idx_email_age_name` (`user_email`, `user_age`,`user_name`)
KEY `idx_status` (`user_status`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_bin
utf8mb4 - Bộ ký tự mặc định

================================================SAI LAM NEN TRANH================================================
NOTE: Quy luật đặt Key-Index tất cả các chỉ mục MYSQL bắt buộc phải có trường ngoài cùng bên trái khi khai báo ở đầu
ví dụ như trên bắt buộc phải có trường email cho mỗi truy vấn

Có thể truy vấn không cần chỉ trường ngoài cùng bên trái bằng cách thay 
-- SELECT *
Ex: select user_email user_name from users where user_name='Thanh'

Không tính toán các chỉ mục trong khi truy vấn
EXPLAIN select * from users where user_id + 1 = 2;

Không cắt chuỗi trong khi truy vấn
EXPLAIN select * from users where substr(user_status, 1, 2) = 1

Khai báo bằng INT trong khi truy vấn = chuỗi 
EXPLAIN select * from users where user_status = '1'

-- LIKE %
EXPLAIN select * from users where email like 'thanh@%' => True
EXPLAIN select * from users where email like '%thanh@' => False
EXPLAIN select * from users where email like '%thanh@%' => False

-- OR
EXPLAIN select * from users where user_id = 1 OR user_status = 0 or user_address = 'ab'
Lỗi vì user_address không được đánh key index 

-- order by
EXPLAIN select * from users where user_email = 'abc' order by user_email, user_name; => True
EXPLAIN select * from users order by user_email, user_name; => False 
