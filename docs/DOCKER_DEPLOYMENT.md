# 🐳 KẾ HOẠCH TRIỂN KHAI DOCKER - SPA BON LAI

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Cấu trúc Docker](#cấu-trúc-docker)
3. [Dockerfile cho Backend](#dockerfile-cho-backend)
4. [Docker Compose](#docker-compose)
5. [Biến môi trường](#biến-môi-trường)
6. [Build và Deploy](#build-và-deploy)
7. [Quản lý và Monitoring](#quản-lý-và-monitoring)
8. [Backup và Recovery](#backup-và-recovery)
9. [Best Practices](#best-practices)

---

## 🎯 TỔNG QUAN

Triển khai dự án SPA Bon Lai với Docker bao gồm 3 containers chính:
- **MySQL Database** - Container cho database
- **Spring Boot Backend** - Container cho API server
- **Nginx Frontend** - Container cho React application (optional)

### Lợi ích của Docker

✅ **Consistency:** Môi trường giống nhau trên dev và production  
✅ **Isolation:** Mỗi service chạy độc lập  
✅ **Scalability:** Dễ dàng scale up/down  
✅ **Portability:** Deploy ở bất kỳ đâu có Docker  
✅ **Easy Setup:** Một lệnh để khởi động toàn bộ hệ thống  

---

## 📁 CẤU TRÚC DOCKER

```
webforspa/
├── bonlai/                          # Backend
│   ├── Dockerfile                   # Dockerfile cho backend
│   ├── .dockerignore               # Ignore files
│   └── src/...
│
├── frontendbonlai/                  # Frontend (optional)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/...
│
├── docker/                          # Docker configurations
│   ├── mysql/
│   │   ├── init.sql                # Database initialization
│   │   └── my.cnf                  # MySQL configuration
│   └── nginx/
│       └── nginx.conf              # Nginx configuration
│
├── docker-compose.yml              # Docker Compose file
├── docker-compose.dev.yml          # Development override
├── docker-compose.prod.yml         # Production override
└── .env.example                    # Environment variables template
```

---

## 🔧 DOCKERFILE CHO BACKEND

### Dockerfile (Multi-stage Build)

Tạo file [`bonlai/Dockerfile`](../bonlai/Dockerfile):

```dockerfile
# Stage 1: Build stage
FROM maven:3.8.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml and download dependencies (cached layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build application (skip tests for faster build)
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Copy resources (if needed)
COPY src/main/resources/firebase-service-account.json /app/firebase-service-account.json

# Create uploads directory
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run application
ENTRYPOINT ["java", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod}", \
    "-jar", \
    "app.jar"]
```

### .dockerignore

Tạo file [`bonlai/.dockerignore`](../bonlai/.dockerignore):

```
# Maven
target/
.mvn/
mvnw
mvnw.cmd

# IDE
.idea/
*.iml
.vscode/
.settings/
.project
.classpath

# Logs
*.log
logs/

# OS
.DS_Store
Thumbs.db

# Git
.git/
.gitignore

# Uploads
uploads/

# Environment
.env
*.env
```

---

## 🗄️ DOCKER COMPOSE

### docker-compose.yml (Base Configuration)

Tạo file [`docker-compose.yml`](../docker-compose.yml) ở root:

```yaml
version: '3.8'

services:
  # MySQL Database
  mysql:
    image: mysql:8.0
    container_name: spa-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD:-root123}
      MYSQL_DATABASE: ${MYSQL_DATABASE:-exercise201}
      MYSQL_USER: ${MYSQL_USER:-spauser}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD:-spapass123}
      MYSQL_ROOT_HOST: '%'
    ports:
      - "${MYSQL_PORT:-3306}:3306"
    volumes:
      # Persistent data
      - mysql_data:/var/lib/mysql
      # Custom MySQL config
      - ./docker/mysql/my.cnf:/etc/mysql/conf.d/my.cnf:ro
      # Initialization scripts
      - ./docker/mysql/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - spa-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-p${MYSQL_ROOT_PASSWORD:-root123}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  # Spring Boot Backend
  backend:
    build:
      context: ./bonlai
      dockerfile: Dockerfile
    container_name: spa-backend
    restart: unless-stopped
    depends_on:
      mysql:
        condition: service_healthy
    environment:
      # Spring profiles
      SPRING_PROFILES_ACTIVE: ${SPRING_PROFILES_ACTIVE:-prod}
      
      # Database
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/${MYSQL_DATABASE:-exercise201}?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: ${MYSQL_USER:-spauser}
      SPRING_DATASOURCE_PASSWORD: ${MYSQL_PASSWORD:-spapass123}
      
      # JPA
      SPRING_JPA_HIBERNATE_DDL_AUTO: ${JPA_DDL_AUTO:-update}
      SPRING_JPA_SHOW_SQL: ${JPA_SHOW_SQL:-false}
      
      # JWT
      JWT_SECRET: ${JWT_SECRET}
      JWT_EXPIRATION: ${JWT_EXPIRATION:-86400000}
      
      # File Upload
      FILE_UPLOAD_DIR: /app/uploads
      
      # Firebase
      FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID}
      FIREBASE_SERVICE_ACCOUNT_KEY: file:/app/firebase-service-account.json
      
      # Email
      SPRING_MAIL_HOST: ${MAIL_HOST:-smtp.gmail.com}
      SPRING_MAIL_PORT: ${MAIL_PORT:-587}
      SPRING_MAIL_USERNAME: ${MAIL_USERNAME}
      SPRING_MAIL_PASSWORD: ${MAIL_PASSWORD}
      
      # Email Template
      SPA_EMAIL_FROM: ${MAIL_FROM}
      SPA_EMAIL_FROM_NAME: ${MAIL_FROM_NAME:-SPA Bon Lai}
      
    ports:
      - "${BACKEND_PORT:-8080}:8080"
    volumes:
      # Persistent uploads
      - upload_data:/app/uploads
      # Firebase credentials (mount from host)
      - ./bonlai/src/main/resources/firebase-service-account.json:/app/firebase-service-account.json:ro
    networks:
      - spa-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  # Frontend (Optional - for production)
  frontend:
    build:
      context: ./frontendbonlai
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: ${REACT_APP_API_URL:-http://localhost:8080}
    container_name: spa-frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "${FRONTEND_PORT:-80}:80"
    networks:
      - spa-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:80"]
      interval: 30s
      timeout: 5s
      retries: 3

networks:
  spa-network:
    driver: bridge

volumes:
  mysql_data:
    driver: local
  upload_data:
    driver: local
```

### docker-compose.dev.yml (Development Override)

```yaml
version: '3.8'

services:
  mysql:
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
    volumes:
      - ./docker/mysql/dev-init.sql:/docker-entrypoint-initdb.d/init.sql:ro

  backend:
    build:
      context: ./bonlai
      target: build  # Use build stage for hot reload
    environment:
      SPRING_PROFILES_ACTIVE: dev
      SPRING_JPA_SHOW_SQL: "true"
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
    volumes:
      # Mount source for hot reload (if using spring-boot-devtools)
      - ./bonlai/src:/app/src
      - ./bonlai/target:/app/target
    command: mvn spring-boot:run

  # Frontend with hot reload
  frontend:
    build:
      context: ./frontendbonlai
      target: development
    volumes:
      - ./frontendbonlai/src:/app/src
      - ./frontendbonlai/public:/app/public
    environment:
      - CHOKIDAR_USEPOLLING=true
    command: npm start
```

### docker-compose.prod.yml (Production Override)

```yaml
version: '3.8'

services:
  mysql:
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}  # Use strong password
    volumes:
      - mysql_prod_data:/var/lib/mysql
    command: --default-authentication-plugin=mysql_native_password

  backend:
    environment:
      SPRING_PROFILES_ACTIVE: prod
      SPRING_JPA_SHOW_SQL: "false"
      SPRING_JPA_HIBERNATE_DDL_AUTO: validate  # Never use 'update' in prod
    deploy:
      replicas: 2  # Run 2 instances for high availability
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M

  frontend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

volumes:
  mysql_prod_data:
    driver: local
```

---

## ⚙️ BIẾN MÔI TRƯỜNG

### .env.example

Tạo file [`.env.example`](../.env.example):

```env
# Environment
COMPOSE_PROJECT_NAME=spa-bonlai
SPRING_PROFILES_ACTIVE=prod

# MySQL Configuration
MYSQL_ROOT_PASSWORD=your_strong_root_password_here
MYSQL_DATABASE=exercise201
MYSQL_USER=spauser
MYSQL_PASSWORD=your_strong_password_here
MYSQL_PORT=3306

# Backend Configuration
BACKEND_PORT=8080
JPA_DDL_AUTO=update
JPA_SHOW_SQL=false

# JWT Configuration (IMPORTANT: Generate strong secret)
JWT_SECRET=your_256_bit_secret_key_here_minimum_32_characters
JWT_EXPIRATION=86400000

# Firebase Configuration
FIREBASE_PROJECT_ID=spa-fa1d5

# Email Configuration (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM=your-email@gmail.com
MAIL_FROM_NAME=SPA Bon Lai

# Frontend Configuration
FRONTEND_PORT=80
REACT_APP_API_URL=http://localhost:8080
```

### Tạo .env file

```bash
# Copy template
cp .env.example .env

# Edit with your actual values
nano .env  # or vim, code, etc.
```

**⚠️ Lưu ý bảo mật:**
- File `.env` chứa thông tin nhạy cảm
- Thêm `.env` vào `.gitignore`
- Không commit `.env` vào Git
- Sử dụng secrets management trong production

---

## 🐳 MYSQL CONFIGURATION

### docker/mysql/my.cnf

Tạo file [`docker/mysql/my.cnf`](../docker/mysql/my.cnf):

```ini
[mysqld]
# Character set
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# Performance
max_connections=200
innodb_buffer_pool_size=256M
innodb_log_file_size=128M

# Timezone
default-time-zone='+07:00'

# Logging
general_log=0
slow_query_log=1
slow_query_log_file=/var/log/mysql/slow.log
long_query_time=2

[client]
default-character-set=utf8mb4
```

### docker/mysql/init.sql

Tạo file [`docker/mysql/init.sql`](../docker/mysql/init.sql):

```sql
-- Database initialization script
USE exercise201;

-- Create default roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_ADMIN', 'Administrator role'),
(2, 'ROLE_STAFF', 'Staff role'),
(3, 'ROLE_CUSTOMER', 'Customer role')
ON DUPLICATE KEY UPDATE name=name;

-- Create default admin account
-- Password: admin123 (BCrypt hashed)
INSERT INTO staff_accounts (id, username, password, full_name, email, role_id) VALUES
(1, 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMye1Ik9hYQjWqZ4z4JJC4xWzvz4mVxP2Ym', 'Administrator', 'admin@spa-bonlai.com', 1)
ON DUPLICATE KEY UPDATE username=username;

-- Create default order statuses
INSERT INTO order_statuses (id, name, description, color) VALUES
(1, 'PENDING', 'Chờ xác nhận', '#FFA500'),
(2, 'CONFIRMED', 'Đã xác nhận', '#4CAF50'),
(3, 'COMPLETED', 'Hoàn thành', '#2196F3'),
(4, 'CANCELLED', 'Đã hủy', '#F44336')
ON DUPLICATE KEY UPDATE name=name;

-- Create sample categories
INSERT INTO categories (name, slug, description, is_active) VALUES
('Massage', 'massage', 'Các dịch vụ massage thư giãn', true),
('Chăm sóc da', 'cham-soc-da', 'Chăm sóc và điều trị da mặt', true),
('Nail & Tóc', 'nail-toc', 'Dịch vụ làm nail và tóc', true)
ON DUPLICATE KEY UPDATE name=name;

-- Create sample coupon
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, usage_limit, used_count, start_date, end_date, is_active) VALUES
('WELCOME10', 'Giảm 10% cho khách hàng mới', 'PERCENTAGE', 10, 300000, 100000, 100, 0, NOW(), DATE_ADD(NOW(), INTERVAL 6 MONTH), true)
ON DUPLICATE KEY UPDATE code=code;

-- Optimize tables
ANALYZE TABLE customers, products, orders, order_items;
```

---

## 🚀 BUILD VÀ DEPLOY

### 1. Build Images

```bash
# Build tất cả services
docker-compose build

# Build specific service
docker-compose build backend

# Build with no cache
docker-compose build --no-cache

# Build với args
docker-compose build --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ')
```

### 2. Start Services

```bash
# Start all services (detached mode)
docker-compose up -d

# Start specific service
docker-compose up -d mysql backend

# Start with logs
docker-compose up

# Start với production config
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 3. Stop Services

```bash
# Stop all services
docker-compose stop

# Stop specific service
docker-compose stop backend

# Stop and remove containers
docker-compose down

# Stop and remove volumes (⚠️ DATA LOSS)
docker-compose down -v
```

### 4. View Logs

```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend

# View last 100 lines
docker-compose logs --tail=100 backend
```

### 5. Execute Commands

```bash
# Execute command in running container
docker-compose exec backend bash

# Run MySQL commands
docker-compose exec mysql mysql -u root -p

# Check backend health
docker-compose exec backend curl http://localhost:8080/actuator/health

# Maven commands
docker-compose exec backend mvn clean package
```

### 6. Scale Services

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3

# With load balancer
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --scale backend=3
```

---

## 📊 QUẢN LÝ VÀ MONITORING

### 1. Container Status

```bash
# List running containers
docker-compose ps

# List all containers (including stopped)
docker-compose ps -a

# Show container stats
docker stats
```

### 2. Health Checks

```bash
# Check backend health
curl http://localhost:8080/actuator/health

# Check MySQL
docker-compose exec mysql mysqladmin ping -u root -p

# Check all healthchecks
docker inspect --format='{{json .State.Health}}' spa-backend | jq
```

### 3. Resource Usage

```bash
# Container resource usage
docker-compose top

# System-wide info
docker system df

# Detailed container stats
docker stats spa-backend spa-mysql
```

### 4. Docker Compose Management

```bash
# Restart service
docker-compose restart backend

# Recreate containers
docker-compose up -d --force-recreate

# Pull latest images
docker-compose pull

# Remove unused images
docker image prune -a
```

### 5. Database Management

```bash
# Connect to MySQL
docker-compose exec mysql mysql -u root -p exercise201

# Export database
docker-compose exec mysql mysqldump -u root -p exercise201 > backup.sql

# Import database
docker-compose exec -T mysql mysql -u root -p exercise201 < backup.sql

# Show tables
docker-compose exec mysql mysql -u root -p -e "USE exercise201; SHOW TABLES;"
```

---

## 💾 BACKUP VÀ RECOVERY

### 1. Database Backup

**Script tự động backup:**

Tạo file [`scripts/backup-db.sh`](../scripts/backup-db.sh):

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="./backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="spa_backup_${DATE}.sql"
CONTAINER_NAME="spa-mysql"
DB_NAME="exercise201"
DB_USER="root"
DB_PASSWORD="${MYSQL_ROOT_PASSWORD}"

# Create backup directory
mkdir -p ${BACKUP_DIR}

# Create backup
echo "Creating backup: ${BACKUP_FILE}"
docker exec ${CONTAINER_NAME} mysqldump -u ${DB_USER} -p${DB_PASSWORD} ${DB_NAME} > ${BACKUP_DIR}/${BACKUP_FILE}

# Compress backup
gzip ${BACKUP_DIR}/${BACKUP_FILE}

# Keep only last 7 days
find ${BACKUP_DIR} -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_DIR}/${BACKUP_FILE}.gz"
```

**Chạy backup:**
```bash
chmod +x scripts/backup-db.sh
./scripts/backup-db.sh
```

**Setup cron job (tự động hàng ngày):**
```bash
# Edit crontab
crontab -e

# Add line (backup at 2 AM daily)
0 2 * * * /path/to/scripts/backup-db.sh >> /var/log/spa-backup.log 2>&1
```

### 2. Database Restore

```bash
# Extract backup
gunzip backups/mysql/spa_backup_20260308_020000.sql.gz

# Restore database
docker exec -i spa-mysql mysql -u root -p${MYSQL_ROOT_PASSWORD} exercise201 < backups/mysql/spa_backup_20260308_020000.sql
```

### 3. Volume Backup

```bash
# Backup MySQL data volume
docker run --rm \
  -v spa-bonlai_mysql_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/mysql_volume_backup.tar.gz -C /data .

# Backup uploads volume
docker run --rm \
  -v spa-bonlai_upload_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/uploads_backup.tar.gz -C /data .
```

### 4. Full System Backup

```bash
# Stop services
docker-compose stop

# Backup volumes
docker run --rm \
  -v spa-bonlai_mysql_data:/mysql \
  -v spa-bonlai_upload_data:/uploads \
  -v $(pwd)/backups:/backup \
  alpine sh -c "tar czf /backup/full_backup_$(date +%Y%m%d).tar.gz /mysql /uploads"

# Start services
docker-compose start
```

---

## ✅ BEST PRACTICES

### 1. Security

```yaml
# Sử dụng secrets thay vì environment variables
services:
  backend:
    secrets:
      - db_password
      - jwt_secret

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### 2. Multi-stage Builds

```dockerfile
# Optimize image size
FROM maven:3.8.6-temurin-17 AS build
# ... build steps ...

FROM eclipse-temurin:17-jre-alpine
# ... only runtime dependencies
```

### 3. Health Checks

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 60s
```

### 4. Resource Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

### 5. Logging

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

### 6. Networks

```yaml
# Isolate services
networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    internal: true  # No external access
```

### 7. Update Strategy

```bash
# Zero-downtime update
docker-compose up -d --no-deps --build backend

# Rolling update with orchestration
docker stack deploy -c docker-compose.yml spa-stack
```

---

## 🎯 DEPLOYMENT WORKFLOW

### Development

```bash
# 1. Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# 2. Check logs
docker-compose logs -f

# 3. Access application
# Backend: http://localhost:8080
# Frontend: http://localhost:3000 (if running separately)
# MySQL: localhost:3306
```

### Production

```bash
# 1. Set environment variables
cp .env.example .env
nano .env  # Configure production values

# 2. Build images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# 3. Start services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# 4. Check health
docker-compose ps
docker-compose logs backend

# 5. Setup SSL (behind Nginx/Traefik)
# See Nginx configuration for reverse proxy
```

---

## 📝 TROUBLESHOOTING

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Check container status
docker-compose ps

# Inspect container
docker inspect spa-backend
```

### Database connection failed

```bash
# Check MySQL is ready
docker-compose exec mysql mysqladmin ping -u root -p

# Check network
docker network inspect spa-bonlai_spa-network

# Test connection from backend
docker-compose exec backend nc -zv mysql 3306
```

### Port conflicts

```bash
# Change ports in .env
MYSQL_PORT=3307
BACKEND_PORT=8081
FRONTEND_PORT=8080

# Or stop conflicting services
docker stop $(docker ps -aq)
```

---

## 📚 USEFUL COMMANDS CHEAT SHEET

```bash
# Build và Start
docker-compose up -d --build

# Restart service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Execute command
docker-compose exec backend bash

# Stop và Remove
docker-compose down

# Clean up everything
docker-compose down -v --rmi all

# Database backup
docker-compose exec mysql mysqldump -u root -p exercise201 > backup.sql

# Database restore
docker-compose exec -T mysql mysql -u root -p exercise201 < backup.sql
```

---

**🎉 Hệ thống Docker đã sẵn sàng triển khai!**

Với cấu hình này, bạn có thể dễ dàng deploy SPA Bon Lai trên bất kỳ môi trường nào có Docker.

**© 2026 SPA Bon Lai - Docker Deployment Guide**
