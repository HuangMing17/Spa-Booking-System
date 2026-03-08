# 📤 Hướng Dẫn Push Dự Án Lên GitHub

## Checklist Trước Khi Push

### ✅ Files Cần Có

- [x] README.md - Main readme cho GitHub
- [x] README_SETUP.md - Hướng dẫn setup cho đồng đội
- [x] LOGIN_CREDENTIALS.md - Thông tin đăng nhập
- [x] .gitignore - Files cần ignore
- [x] .env - Environment variables (COMMITTED cho team)
- [x] docker-compose.yml - Docker configuration
- [x] create_admin.sql - Admin user creation script

### ✅ Backend Files

- [x] bonlai/Dockerfile
- [x] bonlai/pom.xml
- [x] bonlai/src/ - Source code
- [x] bonlai/.dockerignore

### ✅ Frontend Files

- [x] frontendbonlai/package.json
- [x] frontendbonlai/package-lock.json
- [x] frontendbonlai/src/ - Source code
- [x] frontendbonlai/.gitignore

### ✅ Docker & Scripts

- [x] docker/mysql/init.sql - Database schema
- [x] docker/mysql/my.cnf - MySQL configuration
- [x] scripts/backup-db.bat - Backup script (Windows)
- [x] scripts/backup-db.sh - Backup script (Linux/Mac)
- [x] scripts/restore-db.bat - Restore script (Windows)
- [x] scripts/restore-db.sh - Restore script (Linux/Mac)

### ✅ Documentation

- [x] docs/README.md - System overview
- [x] docs/BACKEND.md - Backend documentation
- [x] docs/FRONTEND.md - Frontend documentation
- [x] docs/DOCKER_DEPLOYMENT.md - Deployment guide
- [x] docs/INSTALLATION.md - Installation guide
- [x] docs/CONFIGURATION.md - Configuration reference

### ⚠️ Files KHÔNG Push (đã có trong .gitignore)

- [ ] node_modules/
- [ ] target/
- [ ] build/
- [ ] uploads/ (production data)
- [ ] backups/ (database backups)
- [ ] test-*.ps1 (temporary test files)
- [ ] *.log (log files)

## 📋 Bước 1: Kiểm Tra Các File

```bash
# Kiểm tra structure
ls -la

# Kiểm tra .gitignore
cat .gitignore

# Kiểm tra các file quan trọng tồn tại
ls README.md README_SETUP.md LOGIN_CREDENTIALS.md .env docker-compose.yml
```

## 🔧 Bước 2: Initialize Git Repository (nếu chưa có)

```bash
# Initialize git (nếu chưa có .git folder)
git init

# Hoặc nếu đã có remote
git remote -v
```

## 📝 Bước 3: Tạo Repository Trên GitHub

1. Đăng nhập vào GitHub: https://github.com
2. Click "New repository" hoặc truy cập: https://github.com/new
3. Nhập thông tin:
   - **Repository name**: `spa-bonlai` hoặc `webforspa`
   - **Description**: "Hệ Thống Quản Lý Spa - Spring Boot + React + Docker"
   - **Visibility**: 
     - ✅ **Private** (Recommend - vì có .env với secrets)
     - ⚠️ Public (chỉ nếu bạn đã xóa tất cả sensitive data)
   - **Initialize this repository with**: 
     - ❌ KHÔNG chọn README (vì chúng ta đã có)
     - ❌ KHÔNG chọn .gitignore (vì chúng ta đã có)
     - ❌ KHÔNG chọn license
4. Click "Create repository"

## 🚀 Bước 4: Push Lên GitHub

### Lần Đầu Tiên (Repository mới)

```bash
# Kiểm tra Git đã được cài đặt
git --version

# Set username và email (nếu chưa có)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add tất cả files
git add .

# Kiểm tra files sẽ được commit
git status

# Commit với message
git commit -m "Initial commit: SPA Bon Lai - Full stack app with Docker

- Spring Boot 3.0.4 backend
- React 19.1.0 frontend  
- MySQL 8.0 database
- Docker & Docker Compose setup
- Complete documentation
- Admin authentication working
- Database backup scripts"

# Add remote repository (thay YOUR-USERNAME và YOUR-REPO)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git

# Hoặc dùng SSH (nếu đã setup SSH key)
git remote add origin git@github.com:YOUR-USERNAME/YOUR-REPO.git

# Push lên GitHub
git push -u origin master

# Hoặc nếu branch là main
git push -u origin main
```

### Các Lần Sau

```bash
# Add files đã thay đổi
git add .

# Hoặc add specific files
git add path/to/file.js

# Commit
git commit -m "Mô tả thay đổi của bạn"

# Push
git push
```

## 👥 Bước 5: Chia Sẻ Với Đồng Đội

### Option 1: Thêm Collaborators (Private Repo)

1. Vào repository trên GitHub
2. Click **Settings** > **Collaborators**
3. Click **Add people**
4. Nhập GitHub username hoặc email của đồng đội
5. Gửi invitation

### Option 2: Clone Repository (Cho Đồng Đội)

Đồng đội của bạn sẽ làm theo:

```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

# Xem README_SETUP.md để setup
cat README_SETUP.md

# Setup và chạy
docker-compose up -d --build
Get-Content create_admin.sql | docker-compose exec -T mysql mysql -uroot -proot123 exercise201

# Frontend
cd frontendbonlai
npm install
npm start
```

## 🔐 Bước 6: Bảo Mật (QUAN TRỌNG!)

### Nếu Repository là Private:

✅ **OK** - File .env có thể commit  
✅ **OK** - Passwords có thể để mặc định cho development  
✅ **OK** - Đồng đội có thể clone và chạy ngay

### Nếu Repository là Public:

⚠️ **PHẢI LÀM:**

1. **XÓA file .env khỏi Git:**
   ```bash
   git rm --cached .env
   echo ".env" >> .gitignore
   git commit -m "Remove .env from repository"
   git push
   ```

2. **Tạo .env từ .env.example:**
   - Đổi tên `.env` thành `.env.development`
   - Copy `.env.example` thành template
   - Đồng đội sẽ copy `.env.example` thành `.env` và điền values

3. **Thay đổi tất cả secrets:**
   - JWT_SECRET
   - MYSQL_ROOT_PASSWORD
   - MAIL_PASSWORD
   - Tất cả API keys

4. **Update README_SETUP.md** với instruction về .env:
   ```bash
   # Đồng đội sẽ làm:
   cp .env.example .env
   # Sau đó edit .env với values riêng
   ```

## 📊 Bước 7: Tạo Release & Tags (Optional)

```bash
# Tag version đầu tiên
git tag -a v1.0.0 -m "Version 1.0.0 - Initial release"
git push origin v1.0.0

# Tạo release trên GitHub
# Vào repository > Releases > Create a new release
```

## 🔄 Workflow Sau Này

### Khi Bạn Thay Đổi Code:

```bash
# 1. Pull latest changes
git pull

# 2. Make changes
# ... edit files ...

# 3. Test locally
docker-compose up -d --build

# 4. Commit and push
git add .
git commit -m "Description of changes"
git push
```

### Khi Đồng Đội Cần Update:

```bash
# 1. Pull latest changes
git pull

# 2. Rebuild Docker containers (nếu có thay đổi backend)
docker-compose up -d --build

# 3. Update frontend dependencies (nếu package.json thay đổi)
cd frontendbonlai
npm install

# 4. Restart frontend
npm start
```

## 🆘 Troubleshooting

### Error: "remote origin already exists"

```bash
# Xóa remote cũ
git remote remove origin

# Add lại remote mới
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
```

### Error: "failed to push some refs"

```bash
# Pull trước khi push
git pull origin master --rebase

# Hoặc
git pull origin main --rebase

# Sau đó push
git push
```

### Error: "Authentication failed"

```bash
# Sử dụng Personal Access Token thay vì password
# Tạo token tại: https://github.com/settings/tokens

# Hoặc setup SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"
# Add public key vào GitHub Settings > SSH keys
```

### Large files warning

```bash
# Nếu có files quá lớn, thêm vào .gitignore
echo "path/to/large/file" >> .gitignore
git rm --cached path/to/large/file
git commit -m "Remove large file"
```

## 📱 Git Tips

### Xem trạng thái:
```bash
git status
```

### Xem history:
```bash
git log --oneline --graph
```

### Undo changes:
```bash
# Undo file chưa commit
git checkout -- filename

# Undo last commit (giữ changes)
git reset --soft HEAD~1

# Undo last commit (xóa changes)
git reset --hard HEAD~1
```

### Create branch:
```bash
# Tạo branch mới
git checkout -b feature/new-feature

# Push branch
git push -u origin feature/new-feature

# Merge về master
git checkout master
git merge feature/new-feature
```

## ✅ Final Checklist

Trước khi chia sẻ repository link với đồng đội:

- [ ] README.md hiển thị đẹp trên GitHub
- [ ] All documentation files có mặt
- [ ] .env được xử lý đúng (private: commit, public: ignore)
- [ ] .gitignore hoạt động đúng
- [ ] Test clone repository và chạy được
- [ ] Admin login credentials được document
- [ ] Scripts có executable permissions (Linux/Mac)

## 🎉 Done!

Repository của bạn đã sẵn sàng! Đồng đội có thể:

1. Clone repository
2. Đọc README_SETUP.md
3. Run `docker-compose up -d --build`
4. Run admin creation script
5. Start frontend với `npm start`
6. Login với credentials trong LOGIN_CREDENTIALS.md

---

**Link Repository Template:**
```
https://github.com/YOUR-USERNAME/spa-bonlai
```

**Clone Command cho đồng đội:**
```bash
git clone https://github.com/YOUR-USERNAME/spa-bonlai.git
cd spa-bonlai
```
