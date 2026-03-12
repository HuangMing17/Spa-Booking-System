# 🌸 SPA Bon Lai - Hệ Thống Quản Lý Spa

Hệ thống quản lý spa toàn diện với backend Spring Boot, frontend React, và MySQL database được đóng gói trong Docker.

## 📋 Tính Năng

- **Quản lý sản phẩm/dịch vụ**: CRUD đầy đủ cho products, categories, tags
- **Quản lý đơn hàng**: Xử lý đơn hàng, theo dõi trạng thái, lịch sử
- **Quản lý khách hàng**: Thông tin khách hàng, địa chỉ, lịch sử mua hàng
- **Hệ thống giảm giá**: Coupons, vouchers, discount codes
- **Xác thực & Phân quyền**: JWT authentication, role-based access control
- **Tích hợp Firebase**: Firebase Authentication (optional)
- **Email notifications**: Thông báo qua email với templates
- **Review & Rating**: Đánh giá sản phẩm/dịch vụ
- **Admin Dashboard**: Giao diện quản trị với Material-UI & Ant Design

## 🏗️ Kiến Trúc

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │─────▶│ Spring Boot │─────▶│   MySQL     │
│  Frontend   │      │   Backend   │      │  Database   │
│  (Port 3000)│      │  (Port 8080)│      │ (Internal)  │
└─────────────┘      └─────────────┘      └─────────────┘
```

### Tech Stack

**Backend:**
- Spring Boot 3.0.4
- Spring Security with JWT
- Spring Data JPA / Hibernate
- MySQL 8.0
- Firebase Admin SDK
- Java Mail Sender
- Docker

**Frontend:**
- React 19.1.0
- React Router v6
- Material-UI (MUI)
- Ant Design
- Axios
- Bootstrap 5

**DevOps:**
- Docker & Docker Compose
- Multi-stage Docker builds
- Health checks
- Volume persistence

## 🚀 Quick Start

### Yêu Cầu

- Docker Desktop hoặc Docker Engine
- Docker Compose v2.0+
- Node.js 16+ và npm (cho frontend dev)
- Git

### Clone Repository

```bash
git clone <your-repo-url>
cd webforspa
```

### Khởi Động Backend + Database

```bash
# Build và start Docker containers
docker-compose up -d --build

# Kiểm tra containers đang chạy
docker-compose ps

# Xem logs
docker-compose logs -f
```

### Tạo Admin User

```bash
# Windows PowerShell
Get-Content create_admin.sql | docker-compose exec -T mysql mysql -uroot -proot123 exercise201

# Linux/Mac
docker-compose exec -T mysql mysql -uroot -proot123 exercise201 < create_admin.sql
```

### Khởi Động Frontend

```bash
cd frontendbonlai
npm install
npm start
```

### Truy Cập Ứng Dụng

- **Admin Panel**: http://localhost:3000/admin/login
- **Backend API**: http://localhost:8080
- **Health Check**: http://localhost:8080/actuator/health

**Đăng nhập:**
- Username: `admin`
- Password: `admin123`

## 📚 Tài Liệu

- **[README_SETUP.md](README_SETUP.md)** - Hướng dẫn setup chi tiết cho đồng đội
- **[LOGIN_CREDENTIALS.md](LOGIN_CREDENTIALS.md)** - Thông tin đăng nhập và troubleshooting
- **[docs/README.md](docs/README.md)** - Tổng quan hệ thống
- **[docs/BACKEND.md](docs/BACKEND.md)** - API documentation
- **[docs/FRONTEND.md](docs/FRONTEND.md)** - Frontend documentation
- **[docs/DOCKER_DEPLOYMENT.md](docs/DOCKER_DEPLOYMENT.md)** - Docker deployment guide
- **[docs/INSTALLATION.md](docs/INSTALLATION.md)** - Installation guide

## 🗄️ Database Schema

Hệ thống bao gồm 35+ entities:

- **Products & Services**: products, categories, variants, attributes
- **Orders**: orders, order_items, order_status
- **Customers**: customers, customer_addresses, reviews
- **Staff**: staff_accounts, roles
- **Inventory**: suppliers, shipping_zones, shipping_rates
- **Marketing**: coupons, tags, slideshows

Xem chi tiết trong [docs/BACKEND.md](docs/BACKEND.md)

## 🔧 Development

### Backend Development

```bash
cd bonlai

# Build với Maven
./mvnw clean package

# Run tests
./mvnw test

# Hoặc dùng Docker
docker-compose up -d --build backend
```

### Frontend Development

```bash
cd frontendbonlai

# Install dependencies
npm install

# Start dev server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### Database Operations

```bash
# Backup database
.\scripts\backup-db.bat      # Windows
./scripts/backup-db.sh       # Linux/Mac

# Restore database
.\scripts\restore-db.bat backups/spa_bonlai_20260308.sql    # Windows
./scripts/restore-db.sh backups/spa_bonlai_20260308.sql.gz  # Linux/Mac

# Access MySQL CLI
docker-compose exec mysql mysql -uroot -proot123 exercise201
```

## 🔐 Environment Variables

File `.env` chứa các cấu hình:

```env
# MySQL
MYSQL_ROOT_PASSWORD=root123
MYSQL_DATABASE=exercise201

# Backend
BACKEND_PORT=8080
JWT_SECRET=<your-secret>

# Email
MAIL_USERNAME=<your-email>
MAIL_PASSWORD=<your-password>
```

⚠️ **Lưu ý**: File `.env` được commit cho development. Trong production, hãy thay đổi tất cả secrets.

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View logs
docker-compose logs -f [service-name]

# Execute commands in containers
docker-compose exec backend bash
docker-compose exec mysql mysql -uroot -proot123

# Remove all data (including volumes)
docker-compose down -v
```

## 📁 Project Structure

```
webforspa/
├── bonlai/                 # Spring Boot Backend
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
├── frontendbonlai/        # React Frontend
│   ├── src/
│   └── package.json
├── docker/                # Docker configs
│   └── mysql/
│       ├── init.sql      # Database init script
│       └── my.cnf        # MySQL config
├── docs/                  # Documentation
├── scripts/               # Utility scripts
├── docker-compose.yml    # Docker Compose config
├── .env                  # Environment variables
├── create_admin.sql      # Admin user script
└── README.md             # This file
```

## 🔍 API Endpoints

### Public Endpoints

```
POST   /auth/staff/login          # Admin/Staff login
POST   /auth/customer/login       # Customer login
POST   /auth/customer/register    # Customer registration
GET    /api/products              # List products
GET    /api/categories            # List categories
GET    /api/coupons               # List coupons
```

### Protected Endpoints (Require JWT)

```
POST   /api/products              # Create product
PUT    /api/products/{id}         # Update product
DELETE /api/products/{id}         # Delete product
GET    /api/orders                # List orders
POST   /api/orders                # Create order
GET    /admin/customers           # List customers
```

Xem đầy đủ trong [docs/BACKEND.md](docs/BACKEND.md)

## 🚦 Testing

### Backend API Testing

```bash
# Health check
curl http://localhost:8080/actuator/health

# Login test
curl -X POST http://localhost:8080/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

Hoặc dùng script:

```bash
# Windows
powershell -ExecutionPolicy Bypass -File test-login.ps1

# Sử dụng Postman/Insomnia với collection có sẵn
```

## 🐛 Troubleshooting

### Port conflicts

```bash
# Thay đổi port trong .env
BACKEND_PORT=8081
MYSQL_PORT=3308

# Restart
docker-compose down
docker-compose up -d
```

### Database connection errors

```bash
# Check MySQL is running
docker-compose ps mysql

# Check logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Login 403 errors

```bash
# Verify admin user exists
docker-compose exec mysql mysql -uroot -proot123 -D exercise201 \
  -e "SELECT user_name, email FROM staff_accounts WHERE user_name='admin';"

# Recreate admin user
Get-Content create_admin.sql | docker-compose exec -T mysql mysql -uroot -proot123 exercise201
```

Xem thêm trong [LOGIN_CREDENTIALS.md](LOGIN_CREDENTIALS.md)

## 📊 Database Backup & Restore

### Automatic Backup

```bash
# Windows
.\scripts\backup-db.bat

# Linux/Mac
./scripts/backup-db.sh
```

Backup sẽ được lưu trong thư mục `backups/`

### Restore from Backup

```bash
# Windows
.\scripts\restore-db.bat backups\spa_bonlai_20260308_140000.sql

# Linux/Mac
./scripts/restore-db.sh backups/spa_bonlai_20260308_140000.sql.gz
```

## 🔒 Security Notes

⚠️ **QUAN TRỌNG cho Production:**

1. Thay đổi tất cả passwords trong `.env`
2. Thay đổi JWT_SECRET
3. Thay đổi admin password
4. Setup HTTPS/SSL
5. Cấu hình firewall
6. Không expose MySQL port ra ngoài
7. Setup backup tự động
8. Enable logging và monitoring

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

## 📝 License

This project is proprietary and confidential.

## 👥 Team

- **Development Team**: Spa Bon Lai Dev Team
- **Contact**: admin@spa-bonlai.com

## 🆘 Support

Nếu gặp vấn đề:

1. Kiểm tra [README_SETUP.md](README_SETUP.md)
2. Kiểm tra [LOGIN_CREDENTIALS.md](LOGIN_CREDENTIALS.md)
3. Xem logs: `docker-compose logs -f`
4. Kiểm tra documentation trong `docs/`
5. Liên hệ team qua email hoặc issue tracker

---

Made with ❤️ by GODTeam
