# 📚 TÀI LIỆU DỰ ÁN SPA BON LAI

## 🎯 TỔNG QUAN HỆ THỐNG

**SPA Bon Lai** là hệ thống quản lý spa toàn diện, bao gồm website đặt lịch cho khách hàng và hệ thống quản trị cho nhân viên.

### 🏗️ Kiến trúc Tổng thể

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  React Frontend (Port 3000)                                  │
│  ├── User Interface (Booking, Services, Profile)            │
│  └── Admin Dashboard (Management, Reports)                   │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST API / HTTP
┌─────────────────▼───────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  Spring Boot Backend (Port 8080)                            │
│  ├── Controllers (REST APIs)                                │
│  ├── Services (Business Logic)                              │
│  ├── Security (JWT + Firebase Auth)                         │
│  └── Email Notifications (Thymeleaf Templates)              │
└─────────────────┬───────────────────────────────────────────┘
                  │ JDBC
┌─────────────────▼───────────────────────────────────────────┐
│                     DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  MySQL Database (Port 3306)                                 │
│  └── exercise201 database                                   │
└─────────────────────────────────────────────────────────────┘
```

### 🛠️ Công nghệ sử dụng

#### Backend
- **Framework:** Spring Boot 3.0.4
- **Language:** Java 17
- **Database:** MySQL
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security + JWT + Firebase Auth
- **Email:** Spring Mail + Thymeleaf
- **Build Tool:** Maven

#### Frontend
- **Framework:** React 19.1.0
- **UI Library:** Material-UI (MUI), Ant Design, Bootstrap
- **Routing:** React Router DOM 7.6.0
- **HTTP Client:** Axios 1.9.0
- **Authentication:** Firebase 11.8.1
- **Icons:** Lucide React, MUI Icons

### 📂 Cấu trúc Dự án

```
webforspa/
├── bonlai/                          # Backend (Spring Boot)
│   ├── src/main/java/
│   │   └── com/hoangduyminh/exercise201/
│   │       ├── auth/                # Authentication & Authorization
│   │       ├── config/              # Configurations
│   │       ├── controller/          # REST Controllers
│   │       ├── dto/                 # Data Transfer Objects
│   │       ├── repository/          # Data Access Layer
│   │       └── service/             # Business Logic
│   └── src/main/resources/
│       ├── application.properties   # Configuration
│       └── templates/               # Email Templates
│
├── frontendbonlai/                  # Frontend (React)
│   ├── public/                      # Static Assets
│   └── src/
│       ├── admin/                   # Admin Dashboard
│       ├── auth/                    # Authentication
│       ├── components/              # Shared Components
│       ├── user/                    # User Interface
│       └── utils/                   # Utilities
│
└── docs/                            # Documentation (This folder)
    ├── README.md                    # Tổng quan (This file)
    ├── BACKEND.md                   # Backend Documentation
    ├── FRONTEND.md                  # Frontend Documentation
    └── INSTALLATION.md              # Installation Guide
```

### 🔑 Tính năng chính

#### Dành cho Khách hàng (User)
- 🔐 Đăng ký/Đăng nhập (Email/Password + Firebase)
- 🏠 Trang chủ với slideshow và giới thiệu dịch vụ
- 💆 Xem danh sách và chi tiết dịch vụ spa
- 📅 Đặt lịch hẹn với nhiều dịch vụ
- 🛒 Giỏ hàng và quản lý đơn đặt
- 💳 Áp dụng mã giảm giá (coupon)
- 📧 Nhận email xác nhận và nhắc nhở
- 👤 Quản lý thông tin cá nhân
- 📍 Quản lý địa chỉ giao dịch
- 📋 Xem lịch sử đặt lịch

#### Dành cho Quản trị viên (Admin/Staff)
- 🔐 Đăng nhập với quyền hạn phân cấp
- 📊 Dashboard thống kê tổng quan
- 💆 Quản lý dịch vụ (CRUD + variants)
- 📂 Quản lý danh mục dịch vụ
- 🏷️ Quản lý tags
- 👥 Quản lý khách hàng
- 📅 Quản lý đơn đặt lịch
- 🎫 Quản lý mã giảm giá
- 🖼️ Quản lý slideshow
- 📸 Upload và quản lý hình ảnh
- 📊 Báo cáo doanh thu và thống kê
- ⚙️ Quản lý nhân viên và phân quyền

### 🔒 Bảo mật

- **JWT Authentication:** Token-based authentication cho API
- **Firebase Integration:** Social login với Google
- **Role-based Access:** Phân quyền Customer/Staff/Admin
- **Password Encryption:** BCrypt hashing
- **CORS Configuration:** Bảo vệ cross-origin requests
- **Input Validation:** Validation ở cả frontend và backend

### 📧 Hệ thống Email

- ✅ Email xác nhận đặt lịch
- ✅ Email cập nhật trạng thái đơn hàng
- ✅ Email nhắc nhở lịch hẹn
- 🎨 HTML templates với Thymeleaf
- 📱 Responsive email design

### 🌐 API Endpoints

**Authentication:**
- `POST /api/customers/register` - Đăng ký khách hàng
- `POST /api/customers/login` - Đăng nhập khách hàng
- `POST /api/staff/login` - Đăng nhập nhân viên
- `POST /api/auth/firebase` - Xác thực Firebase

**Services:**
- `GET /api/products` - Danh sách dịch vụ
- `GET /api/products/{id}` - Chi tiết dịch vụ
- `POST /api/products` - Tạo dịch vụ (Admin)
- `PUT /api/products/{id}` - Cập nhật dịch vụ (Admin)
- `DELETE /api/products/{id}` - Xóa dịch vụ (Admin)

**Orders:**
- `GET /api/orders` - Danh sách đơn hàng
- `GET /api/orders/{id}` - Chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/{id}/status` - Cập nhật trạng thái

**Categories, Coupons, Customers, Tags...** - Xem chi tiết trong [`BACKEND.md`](BACKEND.md:1)

### 📱 Giao diện người dùng

#### User Interface
- 🏠 **Home:** Landing page với slideshow
- 💆 **Services:** Danh sách và chi tiết dịch vụ
- 📅 **Booking:** Form đặt lịch hẹn
- 👤 **Profile:** Quản lý thông tin cá nhân
- 📋 **My Bookings:** Lịch sử đặt lịch
- 💰 **Coupons:** Xem mã giảm giá khả dụng

#### Admin Dashboard
- 📊 **Dashboard:** Thống kê tổng quan
- 💆 **Services Management:** CRUD dịch vụ
- 📂 **Categories:** Quản lý danh mục
- 👥 **Customers:** Quản lý khách hàng
- 📅 **Orders:** Quản lý đơn đặt
- 🎫 **Coupons:** Quản lý mã giảm giá
- 📊 **Reports:** Báo cáo và thống kê

### 📝 Tài liệu chi tiết

1. **[BACKEND.md](BACKEND.md:1)** - Chi tiết Backend
   - Kiến trúc và cấu trúc code
   - API Documentation đầy đủ
   - Database Schema
   - Authentication & Security
   - Services và Business Logic

2. **[FRONTEND.md](FRONTEND.md:1)** - Chi tiết Frontend
   - Cấu trúc components
   - Routing và Navigation
   - State Management
   - Authentication Flow
   - UI/UX Design

3. **[INSTALLATION.md](INSTALLATION.md:1)** - Hướng dẫn Cài đặt
   - Yêu cầu hệ thống
   - Cài đặt Backend
   - Cài đặt Frontend
   - Cấu hình Database
   - Deployment Guide

### 🔗 Liên kết nhanh

- **Backend Source:** [`bonlai/`](../bonlai)
- **Frontend Source:** [`frontendbonlai/`](../frontendbonlai)
- **Email Guide:** [`bonlai/EMAIL_NOTIFICATION_GUIDE.md`](../bonlai/EMAIL_NOTIFICATION_GUIDE.md:1)
- **Firebase Guide:** [`bonlai/FIREBASE_INTEGRATION_GUIDE.md`](../bonlai/FIREBASE_INTEGRATION_GUIDE.md:1)

---

## 📮 Liên hệ & Hỗ trợ

Nếu có câu hỏi hoặc cần hỗ trợ, vui lòng tham khảo các tài liệu chi tiết hoặc liên hệ team phát triển.

**© 2026 SPA Bon Lai - All Rights Reserved**
