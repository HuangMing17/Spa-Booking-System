# SPA Bon Lai - Hướng Dẫn Setup Dự Án

## Yêu Cầu Hệ Thống

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Docker Compose v2.0+
- Node.js 16+ và npm (cho frontend development)
- Git

## Bước 1: Clone Repository

```bash
git clone <repository-url>
cd webforspa
```

## Bước 2: Khởi Động Backend và Database

### Khởi động Docker containers:

```bash
# Build và khởi động tất cả services
docker-compose up -d --build

# Hoặc chỉ khởi động (không build lại)
docker-compose up -d
```

### Kiểm tra services đang chạy:

```bash
docker-compose ps
```

Bạn sẽ thấy 2 containers:
- `spa-mysql` - MySQL database (port 3306 internal)
- `spa-backend` - Spring Boot backend (port 8080)

### Kiểm tra logs:

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của backend
docker-compose logs -f backend

# Xem logs của database
docker-compose logs -f mysql
```

### Kiểm tra backend health:

```bash
# Windows PowerShell
Invoke-RestMethod -Uri "http://localhost:8080/actuator/health"

# Linux/Mac
curl http://localhost:8080/actuator/health
```

## Bước 3: Khởi Tạo Database và Admin User

Database sẽ tự động được khởi tạo khi container MySQL start lần đầu, nhưng bạn cần tạo admin user:

```bash
# Windows PowerShell
Get-Content create_admin.sql | docker-compose exec -T mysql mysql -uroot -proot123 exercise201

# Linux/Mac
docker-compose exec -T mysql mysql -uroot -proot123 exercise201 < create_admin.sql
```

Hoặc thủ công:

```bash
docker-compose exec mysql mysql -uroot -proot123 exercise201
```

Sau đó paste nội dung file `create_admin.sql`.

## Bước 4: Khởi Động Frontend

```bash
cd frontendbonlai

# Cài đặt dependencies (chỉ cần lần đầu)
npm install

# Khởi động development server
npm start
```

Frontend sẽ chạy tại: http://localhost:3000

## Bước 5: Đăng Nhập

Truy cập: http://localhost:3000/admin/login

**Thông tin đăng nhập:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@spa-bonlai.com`

Xem chi tiết trong file [`LOGIN_CREDENTIALS.md`](LOGIN_CREDENTIALS.md)

## Các Lệnh Hữu Ích

### Dừng tất cả containers:

```bash
docker-compose down
```

### Dừng và xóa tất cả data (bao gồm database):

```bash
docker-compose down -v
```

### Restart một service:

```bash
# Restart backend
docker-compose restart backend

# Restart database
docker-compose restart mysql
```

### Backup database:

```bash
# Windows
.\scripts\backup-db.bat

# Linux/Mac
./scripts/backup-db.sh
```

### Xem logs realtime:

```bash
docker-compose logs -f backend
```

### Truy cập MySQL CLI:

```bash
docker-compose exec mysql mysql -uroot -proot123 exercise201
```

### Rebuild và restart backend sau khi sửa code:

```bash
docker-compose up -d --build backend
```

## Cấu Trúc Dự Án

```
webforspa/
├── bonlai/                      # Backend Spring Boot
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── frontendbonlai/             # Frontend React
│   ├── src/
│   ├── package.json
│   └── package-lock.json
├── docker/                      # Docker configuration
│   ├── mysql/
│   │   ├── init.sql           # Database initialization
│   │   └── my.cnf             # MySQL config
│   └── README.md
├── docs/                        # Documentation
├── scripts/                     # Utility scripts
├── docker-compose.yml          # Docker Compose configuration
├── .env                        # Environment variables (committed)
├── create_admin.sql            # Admin user creation script
└── README_SETUP.md             # This file
```

## Environment Variables

File `.env` đã được commit vào repository với các giá trị mặc định:

```env
# MySQL Configuration
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=exercise201
MYSQL_PORT=3307  # External port (internal: 3306)

# Backend Configuration
BACKEND_PORT=8080
SPRING_PROFILES_ACTIVE=prod

# JWT Configuration
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970

# Email Configuration
MAIL_USERNAME=godspaauth@gmail.com
MAIL_PASSWORD=lqms mtbd uwgo jvfv
```

⚠️ **Lưu ý:** Các giá trị này chỉ dùng cho development. Trong production, hãy thay đổi tất cả các secrets.

## Xử Lý Sự Cố

### Port đã được sử dụng:

Nếu port 8080 hoặc 3307 đã được sử dụng, sửa trong file `.env`:

```env
BACKEND_PORT=8081
MYSQL_PORT=3308
```

Sau đó restart:

```bash
docker-compose down
docker-compose up -d
```

### Frontend không kết nối được backend:

1. Kiểm tra backend đang chạy:
   ```bash
   docker-compose ps
   curl http://localhost:8080/actuator/health
   ```

2. Kiểm tra CORS trong file `bonlai/src/main/java/.../config/SecurityConfig.java`

3. Kiểm tra `REACT_APP_API_URL` trong frontend

### Database không khởi tạo:

```bash
# Xóa và tạo lại database
docker-compose down -v
docker-compose up -d

# Sau đó chạy lại create_admin.sql
Get-Content create_admin.sql | docker-compose exec -T mysql mysql -uroot -proot123 exercise201
```

### Không thể đăng nhập (403 Error):

1. Kiểm tra admin user đã được tạo:
   ```bash
   docker-compose exec mysql mysql -uroot -proot123 -D exercise201 -e "SELECT user_name, email FROM staff_accounts WHERE user_name='admin';"
   ```

2. Nếu chưa có, chạy lại script:
   ```bash
   Get-Content create_admin.sql | docker-compose exec -T mysql mysql -uroot -proot123 exercise201
   ```

3. Kiểm tra password hash đúng format (phải bắt đầu với `$2a$10$`)

### Backend container bị crash/restart liên tục:

```bash
# Xem logs để tìm lỗi
docker-compose logs backend

# Thường là do:
# - Database chưa sẵn sàng
# - Missing environment variables
# - Port conflict
```

## Cleanup

### Xóa tất cả containers và volumes:

```bash
docker-compose down -v
```

### Xóa images đã build:

```bash
docker rmi spa-bonlai-backend
```

### Xóa tất cả Docker data (cẩn thận!):

```bash
docker system prune -a
```

## Tài Liệu Bổ Sung

- [`docs/README.md`](docs/README.md) - Tổng quan hệ thống
- [`docs/BACKEND.md`](docs/BACKEND.md) - Chi tiết backend API
- [`docs/FRONTEND.md`](docs/FRONTEND.md) - Chi tiết frontend
- [`docs/DOCKER_DEPLOYMENT.md`](docs/DOCKER_DEPLOYMENT.md) - Hướng dẫn deployment
- [`docs/INSTALLATION.md`](docs/INSTALLATION.md) - Hướng dẫn cài đặt
- [`LOGIN_CREDENTIALS.md`](LOGIN_CREDENTIALS.md) - Thông tin đăng nhập

## Support

Nếu gặp vấn đề, hãy:
1. Kiểm tra logs: `docker-compose logs -f`
2. Kiểm tra file documentation trong thư mục `docs/`
3. Kiểm tra file `LOGIN_CREDENTIALS.md` cho các lỗi đăng nhập

## Production Deployment

Xem hướng dẫn chi tiết trong [`docs/DOCKER_DEPLOYMENT.md`](docs/DOCKER_DEPLOYMENT.md)

Các bước chính:
1. Thay đổi tất cả passwords và secrets trong `.env`
2. Cấu hình HTTPS/SSL
3. Setup reverse proxy (nginx)
4. Cấu hình backup tự động
5. Setup monitoring và logging
