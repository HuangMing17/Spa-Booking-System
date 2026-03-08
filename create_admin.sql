-- Create admin user for SPA Bon Lai
USE exercise201;

-- Create default roles if not exists
INSERT INTO roles (id, role_name, privileges) VALUES
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000001', '-', '')), 'ROLE_ADMIN', 'ALL'),
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000002', '-', '')), 'ROLE_STAFF', 'MODERATE'),
(UNHEX(REPLACE('00000000-0000-0000-0000-000000000003', '-', '')), 'ROLE_CUSTOMER', 'LIMITED')
ON DUPLICATE KEY UPDATE role_name=VALUES(role_name);

-- Create admin staff account
-- Default login credentials:
--   Username: admin
--   Password: admin123
--   Email: admin@spa-bonlai.com
-- Password hash generated with BCrypt (strength 10)
INSERT INTO staff_accounts (
    id, 
    user_name, 
    password_hash, 
    first_name, 
    last_name, 
    email, 
    role_id, 
    active, 
    created_at, 
    updated_at
) VALUES (
    UNHEX(REPLACE('10000000-0000-0000-0000-000000000001', '-', '')),
    'admin',
    '$2a$10$n.vMA/11oct8jn20eSk0uOokv.evAftIoQ73tcL928aT4NGawbYSW',
    'Admin',
    'User',
    'admin@spa-bonlai.com',
    UNHEX(REPLACE('00000000-0000-0000-0000-000000000001', '-', '')),
    1,
    NOW(),
    NOW()
)
ON DUPLICATE KEY UPDATE 
    password_hash = VALUES(password_hash),
    updated_at = NOW();

SELECT 'Admin user created/updated successfully' AS status;
SELECT user_name, email, first_name, last_name, active FROM staff_accounts WHERE user_name = 'admin';
