-- Database initialization script for SPA Bon Lai
USE exercise201;

-- Create default roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Administrator role'),
(2, 'ROLE_STAFF', 'Staff role'),
(3, 'ROLE_CUSTOMER', 'Customer role')
ON DUPLICATE KEY UPDATE name=name;

-- Create default admin account
-- Password: admin123 (BCrypt hashed)
INSERT INTO staff_accounts (id, username, password, full_name, email, role_id, created_at, updated_at) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye1Ik9hYQjWqZ4z4JJC4xWzvz4mVxP2Ym', 'Administrator', 'admin@spa-bonlai.com', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE username=username;

-- Create default order statuses
INSERT INTO order_statuses (id, name, description, color, created_at, updated_at) VALUES
(1, 'PENDING', 'Chờ xác nhận', '#FFA500', NOW(), NOW()),
(2, 'CONFIRMED', 'Đã xác nhận', '#4CAF50', NOW(), NOW()),
(3, 'COMPLETED', 'Hoàn thành', '#2196F3', NOW(), NOW()),
(4, 'CANCELLED', 'Đã hủy', '#F44336', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Create sample categories
INSERT INTO categories (name, slug, description, is_active, display_order, created_at, updated_at) VALUES
('Massage', 'massage', 'Các dịch vụ massage thư giãn', true, 1, NOW(), NOW()),
('Chăm sóc da', 'cham-soc-da', 'Chăm sóc và điều trị da mặt', true, 2, NOW(), NOW()),
('Nail & Tóc', 'nail-toc', 'Dịch vụ làm nail và tóc', true, 3, NOW(), NOW()),
('Spa body', 'spa-body', 'Các liệu trình chăm sóc toàn thân', true, 4, NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Create sample tags
INSERT INTO tags (name, slug, created_at, updated_at) VALUES
('Thư giãn', 'thu-gian', NOW(), NOW()),
('Cao cấp', 'cao-cap', NOW(), NOW()),
('Hot deal', 'hot-deal', NOW(), NOW()),
('Mới', 'moi', NOW(), NOW())
ON DUPLICATE KEY UPDATE name=name;

-- Create sample coupon
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, usage_limit, used_count, start_date, end_date, is_active, created_at, updated_at) VALUES
('WELCOME10', 'Giảm 10% cho khách hàng mới', 'PERCENTAGE', 10, 300000, 100000, 100, 0, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH), true, NOW(), NOW()),
('SUMMER20', 'Giảm 20% mùa hè', 'PERCENTAGE', 20, 500000, 200000, 50, 0, NOW(), DATE_ADD(NOW(), INTERVAL 3 MONTH), true, NOW(), NOW())
ON DUPLICATE KEY UPDATE code=code;

-- Log initialization
SELECT 'Database initialized successfully' AS Status;
SELECT COUNT(*) AS RolesCount FROM roles;
SELECT COUNT(*) AS CategoriesCount FROM categories;
SELECT COUNT(*) AS CouponsCount FROM coupons;
