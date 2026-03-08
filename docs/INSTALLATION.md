# 🚀 HƯỚNG DẪN CÀI ĐẶT VÀ TRIỂN KHAI - SPA BON LAI

## 📋 MỤC LỤC

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Cài đặt Database](#cài-đặt-database)
3. [Cài đặt Backend](#cài-đặt-backend)
4. [Cài đặt Frontend](#cài-đặt-frontend)
5. [Cấu hình Firebase](#cấu-hình-firebase)
6. [Cấu hình Email](#cấu-hình-email)
7. [Chạy ứng dụng](#chạy-ứng-dụng)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 💻 YÊU CẦU HỆ THỐNG

### Backend Requirements

- ☕ **Java:** JDK 17 hoặc cao hơn
- 🔧 **Maven:** 3.6+
- 🗄️ **MySQL:** 8.0+
- 💾 **RAM:** Tối thiểu 2GB
- 💿 **Disk:** Tối thiểu 1GB trống

### Frontend Requirements

- 📦 **Node.js:** 16.x hoặc cao hơn
- 📦 **npm:** 8.x+ hoặc **yarn:** 1.22+
- 🌐 **Browser:** Chrome, Firefox, Safari (phiên bản mới nhất)

### Development Tools (Khuyến nghị)

- **IDE:** IntelliJ IDEA / Eclipse (Backend)
- **Editor:** VS Code (Frontend)
- **API Testing:** Postman / Insomnia
- **Database Tool:** MySQL Workbench / DBeaver
- **Git:** Version control

---

## 🗄️ CÀI ĐẶT DATABASE

### 1. Cài đặt MySQL

#### Windows
1. Tải MySQL Installer từ [mysql.com](https://dev.mysql.com/downloads/installer/)
2. Chạy installer và chọn "Developer Default"
3. Thiết lập root password
4. Port mặc định: 3306

#### macOS
```bash
# Sử dụng Homebrew
brew install mysql

# Khởi động MySQL
brew services start mysql

# Thiết lập password
mysql_secure_installation
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

### 2. Tạo Database

Mở MySQL command line hoặc MySQL Workbench:

```sql
-- Tạo database
CREATE DATABASE exercise201 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Tạo user (tuỳ chọn - cho production)
CREATE USER 'spauser'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON exercise201.* TO 'spauser'@'localhost';
FLUSH PRIVILEGES;

-- Kiểm tra
USE exercise201;
SHOW TABLES;
```

### 3. Import Data mẫu (Optional)

Nếu có file SQL backup:
```bash
mysql -u root -p exercise201 < backup.sql
```

---

## ⚙️ CÀI ĐẶT BACKEND

### 1. Clone Repository

```bash
git clone <repository-url>
cd webforspa/bonlai
```

### 2. Cấu hình application.properties

Mở file [`bonlai/src/main/resources/application.properties`](../bonlai/src/main/resources/application.properties:1):

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/exercise201
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration
jwt.secret=YOUR_SECRET_KEY_HERE_MINIMUM_256_BITS
jwt.expiration=86400000

# File Upload Configuration
file.upload-dir=${user.dir}/uploads
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB

# Firebase Configuration
firebase.service-account-key=classpath:firebase-service-account.json
firebase.project-id=spa-fa1d5

# Email Configuration (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.default-encoding=UTF-8

# Email Template Configuration
spa.email.from=your-email@gmail.com
spa.email.from-name=SPA Bon Lai

# Logging
logging.level.org.springframework.security=DEBUG
```

**⚠️ Quan trọng:**
- Thay `YOUR_MYSQL_PASSWORD` bằng password MySQL của bạn
- Thay `YOUR_SECRET_KEY_HERE` bằng secret key 256-bit (có thể generate online)
- Thay email credentials (xem [Cấu hình Email](#cấu-hình-email))

### 3. Tải Dependencies

```bash
# Windows
mvnw.cmd clean install

# macOS/Linux
./mvnw clean install
```

Hoặc nếu đã cài Maven globally:
```bash
mvn clean install
```

### 4. Tạo thư mục uploads

```bash
mkdir uploads
```

### 5. Chạy Backend

```bash
# Windows
mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run

# Hoặc
mvn spring-boot:run
```

Backend sẽ chạy tại: **http://localhost:8080**

### 6. Kiểm tra Backend

Mở browser hoặc Postman, test API:
```
GET http://localhost:8080/api/products
```

Nếu thấy response (có thể là array rỗng) => Backend hoạt động ✅

---

## 🎨 CÀI ĐẶT FRONTEND

### 1. Navigate to Frontend Directory

```bash
cd ../frontendbonlai
```

### 2. Install Dependencies

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng yarn
yarn install
```

**Lưu ý:** Quá trình này có thể mất 5-10 phút tùy tốc độ mạng.

### 3. Cấu hình Environment (Optional)

Tạo file `.env` trong thư mục `frontendbonlai/`:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8080

# Firebase Configuration (nếu sử dụng)
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=spa-fa1d5.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=spa-fa1d5
REACT_APP_FIREBASE_STORAGE_BUCKET=spa-fa1d5.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

**Lưu ý:** File `.env` không nên commit vào Git. Thêm vào `.gitignore`.

### 4. Cập nhật API URL (nếu cần)

Nếu không dùng `.env`, cập nhật trực tiếp trong [`frontendbonlai/src/utils/axios.js`](../frontendbonlai/src/utils/axios.js:5):

```javascript
export const API_BASE_URL = "http://localhost:8080";
```

### 5. Chạy Frontend

```bash
npm start
```

Frontend sẽ chạy tại: **http://localhost:3000**

Browser sẽ tự động mở ứng dụng.

### 6. Kiểm tra Frontend

- Trang chủ hiển thị: ✅
- Có thể xem danh sách dịch vụ: ✅
- Đăng ký/Đăng nhập hoạt động: ✅

---

## 🔥 CÀU HÌNH FIREBASE

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Nhập tên project: "SPA Bon Lai"
4. Bỏ chọn Google Analytics (không bắt buộc)
5. Click "Create project"

### 2. Bật Authentication

1. Trong Firebase Console, chọn "Authentication"
2. Click "Get started"
3. Chọn "Google" provider
4. Enable và điền thông tin:
   - Project support email
   - Project public-facing name
5. Click "Save"

### 3. Tạo Web App

1. Trong Firebase Console, chọn Settings (⚙️) > Project settings
2. Click "Add app" > Web (</> icon)
3. Nhập app nickname: "SPA Web"
4. Click "Register app"
5. Copy Firebase configuration

### 4. Cấu hình Frontend Firebase

Cập nhật [`frontendbonlai/src/utils/firebase.js`](../frontendbonlai/src/utils/firebase.js:1):

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "spa-fa1d5.firebaseapp.com",
  projectId: "spa-fa1d5",
  storageBucket: "spa-fa1d5.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 5. Tạo Service Account cho Backend

1. Firebase Console > Settings > Service accounts
2. Click "Generate new private key"
3. Download file JSON
4. Đổi tên file thành `firebase-service-account.json`
5. Copy vào `bonlai/src/main/resources/`

**⚠️ Lưu ý bảo mật:**
- File này chứa credentials nhạy cảm
- Không commit vào Git
- Thêm vào `.gitignore`: `**/firebase-service-account.json`

### 6. Kiểm tra Firebase Integration

Test Firebase login:
1. Mở frontend
2. Click "Đăng nhập với Google"
3. Chọn tài khoản Google
4. Kiểm tra đăng nhập thành công

---

## 📧 CẤU HÌNH EMAIL

### 1. Thiết lập Gmail App Password

**Yêu cầu:** Tài khoản Gmail với 2-Step Verification đã bật.

**Các bước:**

1. Đăng nhập Gmail
2. Truy cập [Google Account Security](https://myaccount.google.com/security)
3. Tìm "2-Step Verification" > Click vào
4. Scroll xuống "App passwords"
5. Click "App passwords"
6. Chọn app: "Mail"
7. Chọn device: "Other" > Nhập "SPA Bon Lai"
8. Click "Generate"
9. Copy **16-character password** (dạng: xxxx xxxx xxxx xxxx)

### 2. Cập nhật application.properties

```properties
spring.mail.username=your-email@gmail.com
spring.mail.password=xxxx xxxx xxxx xxxx    # App password (16 ký tự)

spa.email.from=your-email@gmail.com
spa.email.from-name=SPA Bon Lai
```

### 3. Test Email

Chạy backend và test endpoint:

```bash
POST http://localhost:8080/api/test/email/booking-confirmation?email=test@example.com
```

Kiểm tra email trong hộp thư đến.

**Lưu ý:**
- Sử dụng email thật để test
- Kiểm tra cả Spam folder
- Gmail có thể block nếu gửi quá nhiều trong thời gian ngắn

---

## ▶️ CHẠY ỨNG DỤNG

### Development Mode

**Terminal 1: Backend**
```bash
cd bonlai
mvn spring-boot:run
```
Chạy tại: http://localhost:8080

**Terminal 2: Frontend**
```bash
cd frontendbonlai
npm start
```
Chạy tại: http://localhost:3000

### Khởi động cả 2 cùng lúc

**Windows (Command Prompt):**
```bash
start cmd /k "cd bonlai && mvn spring-boot:run"
start cmd /k "cd frontendbonlai && npm start"
```

**Windows (PowerShell):**
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd bonlai; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontendbonlai; npm start"
```

**macOS/Linux:**
```bash
# Backend
cd bonlai && mvn spring-boot:run &

# Frontend
cd frontendbonlai && npm start &
```

### Truy cập ứng dụng

- **User Website:** http://localhost:3000
- **Admin Dashboard:** http://localhost:3000/admin
- **Backend API:** http://localhost:8080/api

### Tài khoản mặc định

**Admin/Staff Login:**
```
URL: http://localhost:3000/admin/login
Username: admin
Password: admin123
```

**Customer:**
- Đăng ký tài khoản mới tại: http://localhost:3000/dang-ky
- Hoặc đăng nhập với Google

---

## 🚀 DEPLOYMENT

### Backend Deployment

#### Option 1: JAR File (Standalone)

1. **Build JAR:**
```bash
cd bonlai
mvn clean package -DskipTests
```

JAR file: `target/exercise201-0.0.1-SNAPSHOT.jar`

2. **Run JAR:**
```bash
java -jar target/exercise201-0.0.1-SNAPSHOT.jar
```

3. **Run with custom port:**
```bash
java -jar target/exercise201-0.0.1-SNAPSHOT.jar --server.port=8081
```

#### Option 2: Docker

**Dockerfile:**
```dockerfile
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Build & Run:**
```bash
# Build image
docker build -t spa-backend .

# Run container
docker run -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:mysql://host.docker.internal:3306/exercise201 \
  -e SPRING_DATASOURCE_USERNAME=root \
  -e SPRING_DATASOURCE_PASSWORD=password \
  spa-backend
```

#### Option 3: Deploy to Cloud

**Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create spa-bonlai-api

# Deploy
git push heroku main
```

**AWS Elastic Beanstalk:**
1. Tạo JAR file
2. Upload lên Elastic Beanstalk
3. Cấu hình environment variables
4. Deploy

**Google Cloud Platform:**
```bash
# Build & Deploy
gcloud app deploy
```

### Frontend Deployment

#### Build Production

```bash
cd frontendbonlai
npm run build
```

Build output: `build/` folder

#### Option 1: Static Hosting

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=build
```

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Option 2: Nginx

1. **Copy build files to server:**
```bash
scp -r build/* user@server:/var/www/spa-bonlai/
```

2. **Nginx configuration:**
```nginx
server {
    listen 80;
    server_name spa-bonlai.com;
    root /var/www/spa-bonlai;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Restart Nginx:**
```bash
sudo nginx -t
sudo systemctl restart nginx
```

#### Option 3: Docker

**Dockerfile:**
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build & Run:**
```bash
docker build -t spa-frontend .
docker run -p 80:80 spa-frontend
```

### Database Migration (Production)

1. **Backup database:**
```bash
mysqldump -u root -p exercise201 > backup-$(date +%F).sql
```

2. **Update production config:**
```properties
# Production Database
spring.datasource.url=jdbc:mysql://production-server:3306/exercise201
spring.jpa.hibernate.ddl-auto=validate  # Never use 'update' in production!
```

3. **Use Flyway/Liquibase for migrations:**
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

### Environment Variables (Production)

**Backend:**
```bash
export DB_URL=jdbc:mysql://production-server:3306/exercise201
export DB_USERNAME=spauser
export DB_PASSWORD=secure_password
export JWT_SECRET=production_secret_key_256_bits
export MAIL_USERNAME=production@email.com
export MAIL_PASSWORD=production_app_password
```

**Frontend:**
```bash
export REACT_APP_API_URL=https://api.spa-bonlai.com
export REACT_APP_FIREBASE_API_KEY=production_api_key
```

### SSL/HTTPS Setup

**Let's Encrypt (Free SSL):**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d spa-bonlai.com -d www.spa-bonlai.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## 🐛 TROUBLESHOOTING

### Backend Issues

#### 1. Database Connection Failed

**Error:** `Communications link failure`

**Solutions:**
- Kiểm tra MySQL đang chạy: `systemctl status mysql`
- Kiểm tra port 3306 đang mở
- Kiểm tra username/password trong `application.properties`
- Ping database: `mysql -u root -p`

#### 2. Port 8080 Already in Use

**Error:** `Port 8080 is already in use`

**Solutions:**
```bash
# Tìm process đang dùng port 8080
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8080
kill -9 <PID>

# Hoặc đổi port trong application.properties
server.port=8081
```

#### 3. JWT Secret Key Error

**Error:** `The specified key byte array is X bits...`

**Solution:**
- JWT secret phải ít nhất 256 bits (32 characters)
- Generate key: https://www.allkeysgenerator.com/
- Hoặc: `openssl rand -base64 32`

#### 4. Email Sending Failed

**Error:** `AuthenticationFailedException`

**Solutions:**
- Kiểm tra 2-Step Verification đã bật
- Sử dụng App Password, không phải password Gmail thường
- Kiểm tra Less Secure Apps (nếu cần)
- Test SMTP connection:
```bash
telnet smtp.gmail.com 587
```

#### 5. File Upload Error

**Error:** `FileNotFoundException` hoặc `Access Denied`

**Solutions:**
```bash
# Tạo thư mục uploads
mkdir uploads

# Set permissions (Linux/macOS)
chmod 755 uploads

# Windows: Right-click > Properties > Security > Edit
```

### Frontend Issues

#### 1. npm install Failed

**Error:** `EACCES: permission denied`

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Try with sudo (macOS/Linux)
sudo npm install

# Or fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

#### 2. CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
- Kiểm tra backend WebConfig có allow origin: `http://localhost:3000`
- Restart backend sau khi thay đổi
- Clear browser cache
- Try incognito mode

#### 3. Firebase Authentication Error

**Error:** `Firebase: Error (auth/invalid-api-key)`

**Solutions:**
- Kiểm tra Firebase config trong `firebase.js`
- Verify API key tại Firebase Console
- Kiểm tra domain được whitelist trong Firebase
- Check Browser Console cho error chi tiết

#### 4. Module Not Found

**Error:** `Cannot find module 'react-router-dom'`

**Solutions:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or install specific package
npm install react-router-dom
```

#### 5. Build Failed

**Error:** `JavaScript heap out of memory`

**Solutions:**
```bash
# Increase Node memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Or in package.json
"scripts": {
  "build": "node --max-old-space-size=4096 node_modules/.bin/react-scripts build"
}
```

### Database Issues

#### 1. Table Not Found

**Error:** `Table 'exercise201.products' doesn't exist`

**Solutions:**
- Kiểm tra `spring.jpa.hibernate.ddl-auto=update`
- Restart backend để tạo tables
- Hoặc import SQL schema manually
- Check database:
```sql
USE exercise201;
SHOW TABLES;
```

#### 2. Foreign Key Constraint

**Error:** `Cannot add or update a child row`

**Solutions:**
- Đảm bảo foreign key records tồn tại
- Check order of data insertion
- Temporarily disable foreign key checks:
```sql
SET FOREIGN_KEY_CHECKS=0;
-- Your SQL
SET FOREIGN_KEY_CHECKS=1;
```

#### 3. Character Encoding Issues

**Error:** Vietnamese characters display as `???`

**Solutions:**
```sql
-- Check database charset
SHOW CREATE DATABASE exercise201;

-- Alter database
ALTER DATABASE exercise201 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Alter table
ALTER TABLE products 
CONVERT TO CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### Performance Issues

#### 1. Backend Slow

**Solutions:**
- Enable database indexing
- Use pagination for large datasets
- Enable query caching
- Monitor with Spring Actuator
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

#### 2. Frontend Slow

**Solutions:**
- Enable code splitting
- Lazy load components
- Optimize images (use WebP)
- Enable browser caching
- Use CDN for static assets

---

## 📚 USEFUL COMMANDS

### Backend

```bash
# Clean build
mvn clean

# Compile
mvn compile

# Run tests
mvn test

# Package (skip tests)
mvn package -DskipTests

# Run with profile
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# Check dependencies
mvn dependency:tree
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm start

# Build production
npm run build

# Run tests
npm test

# Check outdated packages
npm outdated

# Update packages
npm update

# Audit security
npm audit
npm audit fix
```

### Database

```bash
# Connect to MySQL
mysql -u root -p

# Backup database
mysqldump -u root -p exercise201 > backup.sql

# Restore database
mysql -u root -p exercise201 < backup.sql

# Show databases
SHOW DATABASES;

# Use database
USE exercise201;

# Show tables
SHOW TABLES;

# Describe table
DESCRIBE products;
```

### Git

```bash
# Clone repository
git clone <url>

# Create branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Pull latest
git pull origin main
```

---

## 🔐 SECURITY CHECKLIST

### Production Deployment

- [ ] Change all default passwords
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS/SSL
- [ ] Set `spring.jpa.hibernate.ddl-auto=validate`
- [ ] Enable CSRF protection
- [ ] Configure rate limiting
- [ ] Set up database backups
- [ ] Enable logging and monitoring
- [ ] Use secure JWT secret (256+ bits)
- [ ] Configure firewall rules
- [ ] Keep dependencies updated
- [ ] Set proper CORS origins
- [ ] Disable debug mode
- [ ] Remove test/debug endpoints

---

## 📞 SUPPORT & RESOURCES

### Documentation
- [Backend Documentation](BACKEND.md)
- [Frontend Documentation](FRONTEND.md)
- [Email Guide](../bonlai/EMAIL_NOTIFICATION_GUIDE.md)
- [Firebase Guide](../bonlai/FIREBASE_INTEGRATION_GUIDE.md)

### External Resources
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev/)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [Firebase Docs](https://firebase.google.com/docs)

### Common Links
- MySQL Download: https://dev.mysql.com/downloads/
- Node.js Download: https://nodejs.org/
- Java JDK: https://www.oracle.com/java/technologies/downloads/
- Maven: https://maven.apache.org/download.cgi

---

## ✅ POST-INSTALLATION CHECKLIST

Sau khi cài đặt xong, kiểm tra:

### Backend
- [ ] Database connection thành công
- [ ] Backend chạy tại http://localhost:8080
- [ ] API products trả về data: `GET /api/products`
- [ ] Upload thư mục tồn tại và có quyền ghi

### Frontend
- [ ] Frontend chạy tại http://localhost:3000
- [ ] Trang chủ hiển thị đúng
- [ ] Có thể xem danh sách dịch vụ
- [ ] Đăng ký tài khoản mới hoạt động

### Authentication
- [ ] Đăng nhập Email/Password hoạt động
- [ ] Đăng nhập Google (Firebase) hoạt động
- [ ] JWT token được lưu và gửi kèm requests
- [ ] Logout xóa token và redirect đúng

### Email
- [ ] Test email confirmation gửi thành công
- [ ] Email format đúng (không lỗi font)
- [ ] Email không vào Spam

### Features
- [ ] Đặt lịch dịch vụ thành công
- [ ] Coupon áp dụng được
- [ ] Upload ảnh hoạt động
- [ ] Admin dashboard truy cập được

---

**🎉 Chúc mừng! Bạn đã cài đặt thành công hệ thống SPA Bon Lai.**

Nếu gặp vấn đề, tham khảo phần [Troubleshooting](#troubleshooting) hoặc liên hệ team phát triển.

**© 2026 SPA Bon Lai - Installation Guide**
