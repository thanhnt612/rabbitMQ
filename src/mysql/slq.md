// CREATE TABLE
CREATE TABLE test_table (
id int NOT NULL,
name varchar(255) DEFAULT NULL,
age int DEFAULT NULL,
address varchar(255) DEFAULT NULL,
PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

//CREATE PROCEDURE
CREATE PROCEDURE `insert_data`()
BEGIN
DECLARE max_id INT DEFAULT 1000000;
DECLARE i INT DEFAULT 1;
WHILE i <= max_id DO
INSERT INTO test_table (id, name, age, address) VALUES (i, CONCAT('Name', i), i%100, CONCAT('Address', i));
SET i = i + 1;
END WHILE;
END

//////////////////////////////////////// Docker and MySQL \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
//Config Model (Master - Slave)
CHANGE MASTER TO
MASTER_HOST='172.19.0.2',
MASTER_PORT=3306,
MASTER_USER='root',
MASTER_PASSWORD='12345',
master_log_file='binlog.000002',
master_log_pos=157,
master_connect_retry=60,
GET_MASTER_PUBLIC_KEY=1;

//////////////////////////////////////// Partition Database \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
CREATE TABLE orders {
order_id INT,
order_date DATE NOT NULL,
total_amount DECIMAL(10,2),
PRIMARY KEY (order_id, order_date)
}

PARTITION BY RANGE COLUMNS (order_date) {
PARTITION p0 VALUES LESS THAN ('2022-01-01'),
PARTITION p2023 VALUES LESS THAN ('2023-01-01'),
PARTITION p2024 VALUES LESS THAN ('2024-01-01'),
PARTITION pmax VALUES LESS THAN (MAXVALUE),
}

SELECT * FROM orders;

INSERT INTO orders (order_id, order_date, total_amount) VALUES (1, '2021-10-10', 100.99);
INSERT INTO orders (order_id, order_date, total_amount) VALUES (2, '2022-10-10', 100.99);
INSERT INTO orders (order_id, order_date, total_amount) VALUES (3, '2023-10-10', 100.99);
INSERT INTO orders (order_id, order_date, total_amount) VALUES (4, '2024-10-10', 100.99);

EXPLAIN SELECT * FROM orders PARTITION (p2023)

EXPLAIN SELECT * FROM orders WHERE order_date >= '2022-01-01' AND order_date < '2025-01-01'

NOTE:
Partition Database chỉ có khả năng chia bảng lớn thành nhiều bảng nhỏ để dễ dàng quản lý dữ liệu
Công nghệ này không cải thiện hiệu suất mà chỉ hỗ trợ cơ sở dữ liệu bằng cách quản lý hoặc ví dụ về việc xóa các bảng 1 cách đơn giản


//Partition Database tạo event để tự động mỗi tháng có thể tạo 1 table---------------------------------------------------------------------

//NEXT MONTH
SELECT SUBSTR (
replace(
DATE_ADD(CURDATE(), INTERVAL 1 MONTH),
        '-', ''),
    1, 6); --202311

//DATE NOW
SELECT NOW();

CALL create_table_auto_month();

SHOW EVENTS;

--Create Event
CREATE EVENT
    `create_table_auto_month_event`
ON SCHEDULE EVERY
    1 MONTH
STARTS
    '2023-10-01 00:00:00'
ON COMPLETION
    PRESERVE ENABLE --khong xoa bo count thoi gian khi thuc hien
DO
    CALL create_table_auto_month(); --create table
