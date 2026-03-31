# SQL Script: Dọn dẹp cơ sở dữ liệu Spa Bon Lai

-- 1. Xóa các bảng liên quan đến Vận chuyển và Nhà cung cấp
DROP TABLE IF EXISTS product_suppliers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS product_shipping_info;
DROP TABLE IF EXISTS shipping_rates;
DROP TABLE IF EXISTS shipping_zones;

-- 2. Xóa các cột e-commerce trong bảng products
ALTER TABLE products DROP COLUMN IF EXISTS quantity;
ALTER TABLE products DROP COLUMN IF EXISTS disable_out_of_stock;

-- 3. Xóa các cột e-commerce trong bảng variant_options
ALTER TABLE variant_options DROP COLUMN IF EXISTS quantity;
ALTER TABLE variant_options DROP COLUMN IF EXISTS buying_price;

-- 4. (Tùy chọn) Xóa các cột không cần thiết khác nếu bạn muốn triệt để
-- ALTER TABLE products DROP COLUMN IF EXISTS buying_price;
