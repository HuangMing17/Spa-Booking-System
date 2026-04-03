-- Database initialization script for SPA Bon Lai
-- Khớp với cấu trúc UUID và tên cột thực tế trong code Java
USE exercise201;

-- 1. Khởi tạo Roles (Dùng chuỗi UUID giả định để trùng khớp hoặc để Hibernate tự sinh)
-- Ở đây chúng ta nạp dữ liệu mầm với tên cột đúng là 'role_name'
INSERT INTO roles (id, role_name, privileges) VALUES
(UUID_TO_BIN(UUID()), 'ADMIN', 'ALL_PRIVILEGES'),
(UUID_TO_BIN(UUID()), 'STAFF', 'STAFF_PRIVILEGES'),
(UUID_TO_BIN(UUID()), 'CUSTOMER', 'CUSTOMER_PRIVILEGES')
ON DUPLICATE KEY UPDATE role_name=role_name;

-- 2. Khởi tạo Order Statuses (Tên cột: status_name)
INSERT INTO order_statuses (id, status_name, color, privacy, created_at, updated_at) VALUES
(UUID_TO_BIN(UUID()), 'PENDING', '#FFA500', 'public_', NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'CONFIRMED', '#4CAF50', 'public_', NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'COMPLETED', '#2196F3', 'public_', NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'CANCELLED', '#F44336', 'public_', NOW(), NOW())
ON DUPLICATE KEY UPDATE status_name=status_name;

-- 3. Khởi tạo Categories (Tên cột: category_name)
INSERT INTO categories (id, category_name, category_description, active, created_at, updated_at) VALUES
(UUID_TO_BIN(UUID()), 'Massage', 'Các dịch vụ massage thư giãn', true, NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'Chăm sóc da', 'Chăm sóc và điều trị da mặt', true, NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'Nail & Tóc', 'Dịch vụ làm nail và tóc', true, NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'Spa body', 'Các liệu trình chăm sóc toàn thân', true, NOW(), NOW())
ON DUPLICATE KEY UPDATE category_name=category_name;

-- 4. Khởi tạo Tags (Tên cột: tag_name)
INSERT INTO tags (id, tag_name, created_at, updated_at) VALUES
(UUID_TO_BIN(UUID()), 'Thư giãn', NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'Cao cấp', NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'Hot deal', NOW(), NOW()),
(UUID_TO_BIN(UUID()), 'Mới', NOW(), NOW())
ON DUPLICATE KEY UPDATE tag_name=tag_name;

-- Log kết quả
SELECT 'Database seeds initialized successfully' AS Status;
