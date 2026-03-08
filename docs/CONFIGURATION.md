# Cấu Hình Hệ Thống - SPA Bon Lai

## Tổng Quan

Tài liệu này mô tả chi tiết các cấu hình cần thiết để chạy hệ thống SPA Bon Lai.

## 1. Cấu Hình Database (MySQL)

### Thông Tin Kết Nối

```properties
# Trong Docker Environment (.env)
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=exercise201
MYSQL_USER=root
MYSQL_PASSWORD=root123
MYSQL_PORT=3307  # Thay đổi để tránh conflict với MySQL local
```

### Cấu Hình Spring Datasource

```yaml
# Trong docker-compose.yml
SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/exercise201?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
SPRING_DATASOURCE_USERNAME: root
SPRING_DATASOURCE_PASSWORD: root123
```

## 2. Cấu Hình JWT Authentication

```properties
# JWT Secret Key (256-bit)
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# JWT Token Expiration (24 hours in milliseconds)
JWT_EXPIRATION=86400000
```

## 3. Cấu Hình Firebase Authentication

### Firebase Project
- **Project ID**: spa-fa1d5
- **Service Account Key**: `/app/firebase-service-account.json`

### Lưu Ý Firebase
- Firebase authentication là **tùy chọn** (optional)
- Nếu không có file service account key hợp lệ, hệ thống vẫn chạy được
- Chỉ Firebase authentication sẽ không khả dụng
- JWT authentication vẫn hoạt động bình thường

### Để Kích Hoạt Firebase
1. Tải Firebase service account key từ Firebase Console
2. Đặt file tại: `bonlai/src/main/resources/firebase-service-account.json`
3. Uncomment dòng trong docker-compose.yml:
   ```yaml
   - ./bonlai/src/main/resources/firebase-service-account.json:/app/firebase-service-account.json:ro
   ```

## 4. Cấu Hình Email (Gmail SMTP)

```properties
# Email Server
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587

# Gmail Account
MAIL_USERNAME=godspaauth@gmail.com
MAIL_PASSWORD=lqms mtbd uwgo jvfv  # App Password

# Email Settings
SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE=true
SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_REQUIRED=true
SPRING_MAIL_DEFAULT_ENCODING=UTF-8

# Email Template
MAIL_FROM=godspaauth@gmail.com
MAIL_FROM_NAME=SPA Bon Lai
```

### Lưu Ý Gmail
- Cần sử dụng **App Password** thay vì mật khẩu Gmail thông thường
- Bật 2-Step Verification cho Gmail account
- Tạo App Password tại: https://myaccount.google.com/apppasswords

## 5. Cấu Hình JPA/Hibernate

```properties
# DDL Auto Mode
JPA_DDL_AUTO=update  # Tự động cập nhật schema

# Show SQL
JPA_SHOW_SQL=true  # Hiển thị SQL queries (dev only)

# Dialect
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

## 6. Cấu Hình File Upload

```properties
# Upload Directory
FILE_UPLOAD_DIR=/app/uploads

# File Size Limits
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB
```

## 7. Cấu Hình Server

```properties
# Backend Port
BACKEND_PORT=8080

# Spring Profile
SPRING_PROFILES_ACTIVE=dev  # dev hoặc prod

# Frontend Port (nếu deploy cùng Docker)
FRONTEND_PORT=80

# Frontend API URL
REACT_APP_API_URL=http://localhost:8080
```

## 8. Tài Khoản Mặc Định

### Admin Account
```
Username: admin
Password: admin123
Email: admin@spa-bonlai.com
Role: ROLE_ADMIN
```

### Roles
- **ROLE_ADMIN**: Quản trị viên hệ thống
- **ROLE_STAFF**: Nhân viên spa
- **ROLE_CUSTOMER**: Khách hàng

## 9. Order Statuses

1. **PENDING** (Chờ xác nhận) - #FFA500 (Orange)
2. **CONFIRMED** (Đã xác nhận) - #4CAF50 (Green)
3. **COMPLETED** (Hoàn thành) - #2196F3 (Blue)
4. **CANCELLED** (Đã hủy) - #F44336 (Red)

## 10. Sample Data

### Categories
1. Massage - Các dịch vụ massage thư giãn
2. Chăm sóc da - Chăm sóc và điều trị da mặt
3. Nail & Tóc - Dịch vụ làm nail và tóc
4. Spa body - Các liệu trình chăm sóc toàn thân

### Tags
1. Thư giãn
2. Cao cấp
3. Hot deal
4. Mới

### Coupons
1. **WELCOME10**: Giảm 10% cho khách hàng mới (min 300k, max 100k)
2. **SUMMER20**: Giảm 20% mùa hè (min 500k, max 200k)

## 11. Biến Môi Trường Đầy Đủ (.env)

```env
# Environment
COMPOSE_PROJECT_NAME=spa-bonlai
SPRING_PROFILES_ACTIVE=dev

# MySQL Configuration
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=exercise201
MYSQL_USER=root
MYSQL_PASSWORD=root123
MYSQL_PORT=3307

# Backend Configuration
BACKEND_PORT=8080
JPA_DDL_AUTO=update
JPA_SHOW_SQL=true

# JWT Configuration
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000

# Firebase Configuration
FIREBASE_PROJECT_ID=spa-fa1d5

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=godspaauth@gmail.com
MAIL_PASSWORD=lqms mtbd uwgo jvfv
MAIL_FROM=godspaauth@gmail.com
MAIL_FROM_NAME=SPA Bon Lai

# Frontend Configuration
FRONTEND_PORT=80
REACT_APP_API_URL=http://localhost:8080
```

## 12. Kiểm Tra Cấu Hình

### Kiểm Tra Database Connection
```bash
docker exec -it spa-mysql mysql -uroot -proot123 -e "SELECT DATABASE();"
```

### Kiểm Tra Backend Health
```bash
curl http://localhost:8080/actuator/health
```

### Kiểm Tra Backend Logs
```bash
docker logs spa-backend --tail 50
```

### Kiểm Tra MySQL Logs
```bash
docker logs spa-mysql --tail 50
```

## 13. Troubleshooting

### Lỗi: Access denied for user 'root'
- Kiểm tra MYSQL_PASSWORD trong .env khớp với SPRING_DATASOURCE_PASSWORD
- Giá trị hiện tại: `root123`

### Lỗi: Firebase initialization failed
- Đây là **cảnh báo bình thường** nếu không có file service account key
- Hệ thống vẫn chạy được, chỉ Firebase auth không khả dụng
- JWT authentication vẫn hoạt động

### Lỗi: Port already in use
- MySQL port đã đổi sang 3307 để tránh conflict
- Backend port: 8080
- Kiểm tra: `docker ps` để xem ports đang sử dụng

### Lỗi: Email sending failed
- Kiểm tra Gmail App Password đúng
- Kiểm tra 2-Step Verification đã bật
- Kiểm tra network có thể truy cập smtp.gmail.com:587

## 14. Best Practices

### Bảo Mật
1. **Không commit** file `.env` vào Git
2. **Thay đổi** JWT_SECRET trong môi trường production
3. **Sử dụng** secrets management trong production
4. **Thay đổi** mật khẩu admin mặc định sau khi deploy

### Performance
1. Tắt `JPA_SHOW_SQL=false` trong production
2. Sử dụng connection pooling (đã cấu hình HikariCP)
3. Enable caching cho các queries thường xuyên
4. Tối ưu database indexes

### Monitoring
1. Sử dụng Spring Actuator endpoints
2. Monitor Docker container health
3. Set up logging aggregation
4. Monitor database performance

## 15. Tài Liệu Liên Quan

- [README.md](README.md) - Tổng quan hệ thống
- [BACKEND.md](BACKEND.md) - Chi tiết backend
- [FRONTEND.md](FRONTEND.md) - Chi tiết frontend
- [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) - Hướng dẫn deploy Docker
- [INSTALLATION.md](INSTALLATION.md) - Hướng dẫn cài đặt
