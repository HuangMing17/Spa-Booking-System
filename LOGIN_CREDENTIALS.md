# Thông Tin Đăng Nhập / Login Credentials

## Admin/Staff Account

Tài khoản quản trị viên mặc định đã được tạo sẵn trong hệ thống.

### Thông tin đăng nhập:
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@spa-bonlai.com`
- **Role:** `ROLE_ADMIN`

### Đường dẫn đăng nhập:
- **Admin Panel:** http://localhost:3000/admin/login
- **Backend API:** http://localhost:8080

---

## Hướng Dẫn Đăng Nhập / Login Instructions

### 1. Khởi động hệ thống / Start the system:

```bash
# Khởi động Docker containers (Backend + Database)
docker-compose up -d

# Khởi động Frontend (trong terminal riêng)
cd frontendbonlai
npm start
```

### 2. Truy cập Admin Panel:

1. Mở trình duyệt và truy cập: http://localhost:3000/admin/login
2. Nhập thông tin:
   - Tên đăng nhập: `admin`
   - Mật khẩu: `admin123`
3. Nhấn "Đăng nhập"
4. Sau khi đăng nhập thành công, bạn sẽ được chuyển đến Dashboard

### 3. Kiểm tra Backend:

Kiểm tra backend đang chạy:
```bash
curl http://localhost:8080/actuator/health
```

### 4. Test API trực tiếp:

```bash
# Windows PowerShell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/auth/staff/login" -Method POST -Body $body -ContentType "application/json"
```

---

## Lưu Ý Bảo Mật / Security Notes

⚠️ **QUAN TRỌNG:**
- Đây là tài khoản mặc định dùng cho môi trường phát triển
- **PHẢI** thay đổi mật khẩu trước khi triển khai production
- Không commit file này vào Git repository công khai

### Thay đổi mật khẩu:

Để tạo mật khẩu mới với BCrypt hash:

1. Truy cập endpoint test (khi backend đang chạy):
   ```
   http://localhost:8080/api/test/bcrypt/YOUR_NEW_PASSWORD
   ```

2. Copy hash được tạo ra và cập nhật database:
   ```sql
   UPDATE staff_accounts 
   SET password_hash = 'BCRYPT_HASH_HERE' 
   WHERE user_name = 'admin';
   ```

---

## Xử Lý Sự Cố / Troubleshooting

### Không thể đăng nhập (403 Forbidden):

1. **Kiểm tra backend đang chạy:**
   ```bash
   docker-compose ps
   curl http://localhost:8080/actuator/health
   ```

2. **Kiểm tra password hash trong database:**
   ```bash
   docker-compose exec mysql mysql -uroot -proot123 -D exercise201 -e "SELECT user_name, LEFT(password_hash, 30) FROM staff_accounts WHERE user_name='admin';"
   ```
   
   Password hash phải bắt đầu bằng `$2a$10$`

3. **Reset password nếu cần:**
   ```bash
   # Chạy script SQL
   Get-Content update_admin_password.sql | docker-compose exec -T mysql mysql -uroot -proot123 exercise201
   ```

### Frontend không chuyển trang sau khi đăng nhập:

1. Mở Developer Console (F12) kiểm tra lỗi
2. Kiểm tra response từ API có đúng format không
3. Xóa Session Storage và thử lại:
   ```javascript
   sessionStorage.clear();
   ```

### CORS errors:

Backend đã được cấu hình cho phép tất cả origins. Nếu vẫn gặp lỗi CORS:
1. Kiểm tra SecurityConfig.java
2. Kiểm tra backend logs: `docker-compose logs backend`

---

## API Endpoints

### Authentication Endpoints (Public):

- `POST /auth/staff/login` - Admin/Staff login
- `POST /auth/customer/login` - Customer login  
- `POST /auth/customer/register` - Customer registration

### Protected Endpoints:

Tất cả các endpoints khác yêu cầu JWT token trong header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Database Information

- **Host:** localhost (external), mysql (internal Docker network)
- **Port:** 3307 (external mapping, để tránh conflict với MySQL local)
- **Internal Port:** 3306 (trong Docker network)
- **Database:** exercise201
- **Root Password:** root123
- **User:** root

**Lưu ý:** MySQL không expose port ra ngoài trong production. Chỉ backend container có thể kết nối qua internal Docker network.
