# 📋 TỔNG QUAN DỰ ÁN: SPA BON LAI

> **Website đặt lịch dịch vụ Spa trực tuyến** — Cho phép khách hàng đặt lịch spa online và admin quản lý hệ thống.
>
> **Cập nhật lần cuối:** 2026-03-08

---

## 1. GIỚI THIỆU

**SPA Bon Lai** là một ứng dụng web Full-stack phục vụ cho một tiệm SPA. Hệ thống bao gồm:

- **Trang khách hàng (User):** Xem dịch vụ, đặt lịch hẹn, quản lý lịch hẹn, áp dụng mã giảm giá
- **Trang quản trị (Admin):** Quản lý dịch vụ, khách hàng, đơn hàng/lịch hẹn, coupon, báo cáo thống kê

---

## 2. TECH STACK

| Thành phần | Công nghệ | Phiên bản | Ghi chú |
|:-----------|:----------|:----------|:--------|
| **Backend** | Java + Spring Boot | Java 17, Spring Boot 3.0.4 | REST API |
| **ORM** | Spring Data JPA / Hibernate | — | Auto DDL update |
| **Security** | Spring Security + JWT | jjwt 0.11.5 | Stateless |
| **Database** | MySQL | — | Schema: `exercise201`, cổng 3306 |
| **Frontend** | React | 19.1.0 | Create React App |
| **UI Library** | Ant Design (antd) | 5.25.1 | Thư viện UI chính |
| **UI bổ trợ** | MUI (Material UI) | 7.1.0 | Icons, một số component |
| **CSS Framework** | Bootstrap + React Bootstrap | 5.3.6 | Layout bổ trợ |
| **HTTP Client** | Axios | 1.9.0 | Interceptors cho JWT |
| **Routing** | React Router DOM | 7.6.0 | Client-side routing |
| **Auth (Social)** | Firebase Authentication | 11.8.1 | Google Sign-in |
| **Email** | Spring Mail + Thymeleaf | — | Gmail SMTP |
| **Icons** | Lucide React + MUI Icons | — | — |
| **Date/Time** | Moment.js | 2.30.1 | Format ngày giờ |
| **Build Tool** | Maven (Backend), npm (Frontend) | — | — |

---

## 3. CẤU TRÚC THƯ MỤC

```
d:\webforspa\
├── bonlai/                         ← 🔧 BACKEND (Spring Boot)
│   ├── pom.xml                     (Maven dependencies)
│   ├── EMAIL_NOTIFICATION_GUIDE.md (Hướng dẫn email)
│   ├── FIREBASE_INTEGRATION_GUIDE.md (Hướng dẫn Firebase)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/hoangduyminh/exercise201/
│   │   │   │   ├── Exercise201Application.java  (Main entry point)
│   │   │   │   ├── auth/           (Authentication module)
│   │   │   │   ├── config/         (WebConfig)
│   │   │   │   ├── constant/       (Constants)
│   │   │   │   ├── controller/     (12 REST Controllers)
│   │   │   │   ├── dto/            (47 DTO files)
│   │   │   │   ├── entity/         (38 JPA Entities)
│   │   │   │   ├── exception/      (Exception handlers)
│   │   │   │   ├── repository/     (34 JPA Repositories)
│   │   │   │   ├── service/        (17 Services + impl/)
│   │   │   │   └── util/           (Utilities)
│   │   │   └── resources/
│   │   │       ├── application.properties  (Config chính)
│   │   │       └── templates/      (3 email templates Thymeleaf)
│   │   └── test/                   (Unit tests)
│   └── target/                     (Build output)
│
├── frontendbonlai/                 ← 🎨 FRONTEND (React)
│   ├── package.json
│   ├── public/                     (Static assets)
│   └── src/
│       ├── App.js                  (Main Router)
│       ├── index.js                (Entry point)
│       ├── index.css               (Global CSS)
│       ├── theme/
│       │   └── themeConfig.js      (Ant Design theme - Pink SPA)
│       ├── auth/
│       │   ├── admin/              (Admin auth: login, context, protected route)
│       │   └── customer/           (Customer auth: login, register, context)
│       ├── admin/
│       │   ├── layouts/AdminLayout (Sidebar + Header admin)
│       │   └── pages/
│       │       ├── Dashboard.jsx   (Thống kê tổng quan)
│       │       ├── services/       (CRUD dịch vụ spa)
│       │       ├── categories/     (Quản lý danh mục)
│       │       ├── customers/      (CRUD khách hàng)
│       │       ├── orders/         (Quản lý đơn hàng/lịch hẹn)
│       │       ├── coupons/        (Quản lý mã giảm giá)
│       │       └── reports/        (Báo cáo doanh thu, dịch vụ)
│       ├── user/
│       │   ├── layouts/            (UserLayout, BookingLayout)
│       │   ├── pages/              (Home, Services, Booking, MyBookings, Profile...)
│       │   └── components/         (ServiceDetailUser, ...)
│       ├── components/             (Shared: ImageUpload, SuccessNotification)
│       └── utils/
│           ├── axios.js            (Axios instance + interceptors)
│           ├── firebase.js         (Firebase config & auth)
│           ├── formatters.js       (Format helpers)
│           ├── imageUtils.js       (Image URL helpers)
│           └── storage.js          (LocalStorage helpers)
│
├── docs/                           ← 📄 TÀI LIỆU
└── .agents/                        ← 🤖 Agent configs
    ├── rules/
    └── skills/                     (13 skills)
```

---

## 4. CÁC MODULE CHỨC NĂNG

### 4.1. Phía Khách hàng (User-facing)

| # | Trang | Route | Layout | Auth | Mô tả |
|:--|:------|:------|:-------|:-----|:------|
| 1 | Trang chủ | `/` | BookingLayout | Public | Banner carousel, thống kê, dịch vụ nổi bật, đánh giá |
| 2 | Dịch vụ | `/dich-vu` | UserLayout | Public | Danh sách dịch vụ spa, lọc theo danh mục |
| 3 | Chi tiết dịch vụ | `/dich-vu/:id` | UserLayout | Public | Thông tin chi tiết, giá, ảnh dịch vụ |
| 4 | Đặt lịch | `/dat-lich` | BookingLayout | 🔒 Customer | Flow 3 bước: Chọn dịch vụ → Thông tin → Xác nhận |
| 5 | Lịch hẹn của tôi | `/lich-hen` | BookingLayout | 🔒 Customer | Xem, hủy lịch hẹn đã đặt |
| 6 | Khuyến mãi | `/khuyen-mai` | UserLayout | Public | Xem danh sách coupon/mã giảm giá |
| 7 | Giới thiệu | `/gioi-thieu` | UserLayout | Public | Thông tin về spa |
| 8 | Liên hệ | `/lien-he` | UserLayout | Public | Form liên hệ, bản đồ |
| 9 | Hồ sơ cá nhân | `/thong-tin-ca-nhan` | UserLayout | 🔒 Customer | Quản lý thông tin cá nhân |
| 10 | Đăng nhập | `/dang-nhap` | — | Public | Login bằng email/password hoặc Google |
| 11 | Đăng ký | `/dang-ky` | — | Public | Đăng ký tài khoản mới |

### 4.2. Phía Admin

| # | Trang | Route | Auth | Mô tả |
|:--|:------|:------|:-----|:------|
| 1 | Dashboard | `/admin/dashboard` | 🔒 Staff | Thống kê: doanh thu, lịch hẹn, khách hàng, top dịch vụ |
| 2 | Dịch vụ | `/admin/services` | 🔒 Staff | Danh sách, tạo, sửa, xóa dịch vụ spa |
| 3 | Chi tiết dịch vụ | `/admin/services/:id` | 🔒 Staff | Xem chi tiết dịch vụ |
| 4 | Danh mục | `/admin/services/categories` | 🔒 Staff | Quản lý danh mục dịch vụ (hỗ trợ danh mục cha-con) |
| 5 | Khách hàng | `/admin/customers` | 🔒 Staff | Danh sách, tạo, sửa, xem chi tiết khách hàng |
| 6 | Đơn hàng | `/admin/orders` | 🔒 Staff | Quản lý đơn hàng (tạo, sửa, xem, cập nhật trạng thái) |
| 7 | Lịch hẹn | `/admin/appointments` | 🔒 Staff | Quản lý lịch hẹn (tạo, sửa, xem chi tiết) |
| 8 | Coupon | `/admin/coupons` | 🔒 Staff | Tạo, sửa mã giảm giá |
| 9 | Báo cáo doanh thu | `/admin/reports/revenue` | 🔒 Staff | Báo cáo doanh thu theo thời gian |
| 10 | Báo cáo dịch vụ | `/admin/reports/services` | 🔒 Staff | Thống kê dịch vụ được sử dụng |
| 11 | Đăng nhập admin | `/admin/login` | Public | Trang đăng nhập dành cho staff |

---

## 5. BACKEND CHI TIẾT

### 5.1. Entities (38 JPA Entities)

**Entities chính:**

| Entity | Bảng DB | Mô tả | ID Type |
|:-------|:--------|:------|:--------|
| `Product` | `products` | Dịch vụ spa (tên, giá bán, giá so sánh, mô tả, loại) | UUID |
| `Category` | `categories` | Danh mục dịch vụ (hỗ trợ parent-child) | UUID |
| `Customer` | `customers` | Khách hàng (tên, email, phone, auth provider) | UUID |
| `Order` | `orders` | Đơn hàng/lịch hẹn (ngày hẹn, tổng tiền, trạng thái) | String |
| `OrderItem` | — | Chi tiết đơn hàng (dịch vụ, số lượng, giá) | UUID |
| `OrderStatus` | — | Trạng thái đơn (PENDING, CONFIRMED, COMPLETED, CANCELLED) | — |
| `Coupon` | `coupons` | Mã giảm giá (code, loại, giá trị, thời hạn) | UUID |
| `StaffAccount` | — | Tài khoản nhân viên/admin | UUID |
| `Cart` / `CartItem` | — | Giỏ hàng | UUID |

**Entities phụ trợ:**

| Entity | Mô tả |
|:-------|:------|
| `Gallery` | Ảnh sản phẩm/dịch vụ |
| `Tag` / `ProductTag` | Tag cho dịch vụ |
| `Attribute` / `AttributeValue` / `ProductAttribute` | Thuộc tính dịch vụ |
| `Variant` / `VariantOption` / `VariantValue` | Biến thể dịch vụ |
| `Supplier` / `ProductSupplier` | Nhà cung cấp |
| `ProductShippingInfo` / `ShippingRate` / `ShippingZone` | Vận chuyển |
| `Slideshow` | Banner trang chủ |
| `Notification` | Thông báo |
| `CustomerAddress` | Địa chỉ khách hàng |
| `Country` | Quốc gia |
| `Role` | Vai trò (CUSTOMER, STAFF) |
| `ProductCoupon` / `ProductCategory` | Bảng trung gian N-N |
| `Sell` | Bán hàng |

### 5.2. Controllers (12 REST Controllers)

| Controller | Base URL | Mô tả |
|:-----------|:---------|:------|
| `OrderController` | `/api/orders` | CRUD đơn hàng, cập nhật trạng thái, apply coupon |
| `ProductController` | `/api/products` | CRUD dịch vụ, upload ảnh, tìm kiếm, lọc theo danh mục/tag |
| `CategoryController` | `/api/categories` | CRUD danh mục, quan hệ cha-con |
| `CustomerController` | `/api/customers` | CRUD khách hàng, profile |
| `CouponController` | `/api/coupons` | CRUD mã giảm giá, validate coupon |
| `CartController` | `/api/cart` | Quản lý giỏ hàng |
| `StaffController` | `/api/staff` | Quản lý nhân viên |
| `TagController` | `/api/tags` | CRUD tags |
| `SlideshowController` | `/api/slideshows` | Quản lý banner |
| `ProductReviewController` | `/api/reviews` | Đánh giá sản phẩm |
| `FileUploadController` | `/api/upload` | Upload file/ảnh |
| `EmailTestController` | `/api/test/email` | Test gửi email (dev only) |

### 5.3. Auth Controllers

| Controller | Base URL | Mô tả |
|:-----------|:---------|:------|
| `CustomerAuthController` | `/auth/customer/*` | Login, register, firebase-login cho khách |
| `StaffAuthController` | `/auth/staff/*` | Login, register cho nhân viên |
| `FirebaseAuthController` | `/auth/firebase/*` | Verify Firebase token, register |

### 5.4. Services (17 Service Interfaces + Implementations)

```
CartService, CategoryService, CouponService, CustomerService,
CustomerAddressService, EmailService, NotificationService,
OrderService, OrderStatusService, ProductService, ProductReviewService,
RoleService, RoomService, SlideshowService, StaffAccountService,
TagService, VariantService
```

---

## 6. FRONTEND CHI TIẾT

### 6.1. Theme & Design

```javascript
// Theme chính: Tone hồng/lavender — phù hợp SPA
colorPrimary: "#FFB6C1"      // Light Pink
colorPrimaryHover: "#FF99AC"  // Pink
colorBgLayout: "#FFF0F5"      // Lavender Blush
colorBorder: "#FFD1DC"        // Pink border
fontFamily: "'Segoe UI', sans-serif"
borderRadius: 8
```

### 6.2. State Management & Data Flow

- **Không dùng** global state manager (không Zustand/Redux)
- Mỗi page **tự fetch data** bằng `useEffect` + `useState`
- Mỗi module admin có file `*API.js` riêng (ví dụ: `serviceAPI.js`, `orderAPI.js`, `customerAPI.js`)
- **Axios interceptors** tự động gắn JWT token vào mọi request

### 6.3. API Client (`utils/axios.js`)

```javascript
// Base URL
API_BASE_URL = "http://localhost:8080"

// Interceptors:
// - Request: Tự gắn JWT token từ localStorage
// - Response: Xử lý lỗi 401 (redirect login), 403, 404, 500

// API Endpoints:
CUSTOMER.LOGIN:          "/auth/customer/login"
CUSTOMER.REGISTER:       "/auth/customer/register"
CUSTOMER.FIREBASE_LOGIN: "/auth/customer/firebase-login"
CUSTOMER.PROFILE:        "/customers/profile"
```

### 6.4. Layouts

| Layout | Sử dụng cho | Đặc điểm |
|:-------|:------------|:---------|
| `UserLayout` | Trang user thông thường | Header + Footer cho khách |
| `BookingLayout` | Trang chủ, đặt lịch, lịch hẹn | Layout tối ưu cho booking flow |
| `AdminLayout` | Toàn bộ trang admin | Sidebar navigation + Header |

---

## 7. AUTHENTICATION & AUTHORIZATION

### 7.1. Luồng xác thực

```
┌─────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                   │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  CUSTOMER:                                               │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │ Email/   │───→│ POST /auth/  │───→│ JWT Token     │  │
│  │ Password │    │ customer/    │    │ (localStorage) │  │
│  └──────────┘    │ login        │    └───────────────┘  │
│                  └──────────────┘                        │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │ Google   │───→│ Firebase     │───→│ POST /auth/   │  │
│  │ Sign-in  │    │ ID Token     │    │ customer/     │  │
│  └──────────┘    └──────────────┘    │ firebase-login│  │
│                                      └───────┬───────┘  │
│                                              ↓          │
│                                      ┌───────────────┐  │
│                                      │ JWT Token     │  │
│                                      └───────────────┘  │
│                                                          │
│  ADMIN/STAFF:                                            │
│  ┌──────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │ Email/   │───→│ POST /auth/  │───→│ JWT Token     │  │
│  │ Password │    │ staff/login  │    │ (localStorage) │  │
│  └──────────┘    └──────────────┘    └───────────────┘  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 7.2. Phân quyền (Roles)

| Role | Quyền | Mô tả |
|:-----|:------|:------|
| `CUSTOMER` | Đặt lịch, xem/hủy lịch hẹn, quản lý profile | Khách hàng đăng ký |
| `STAFF` | Toàn quyền CRUD trên admin panel | Nhân viên/admin |

### 7.3. Security Config

- **Public endpoints:** Login, register, Firebase auth, GET products/categories/coupons, uploads
- **Protected endpoints:** Tất cả endpoint còn lại cần JWT token hợp lệ
- **Method-level security:** `@PreAuthorize("hasRole('STAFF')")` hoặc `@PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF')")`
- **CORS:** Cho phép tất cả origins (development mode)
- **Session:** Stateless (không dùng session)

---

## 8. HỆ THỐNG EMAIL

### 8.1. Kiến trúc

```
OrderService ──→ EmailService ──→ Thymeleaf Templates ──→ Gmail SMTP ──→ Customer
```

### 8.2. Các loại email

| Loại email | Trigger | Template |
|:-----------|:--------|:---------|
| Xác nhận đặt lịch | Tự động khi tạo order | `booking-confirmation.html` |
| Cập nhật trạng thái | Khi admin đổi status | `order-status-update.html` |
| Nhắc nhở lịch hẹn | Thủ công / scheduled | `appointment-reminder.html` |

### 8.3. Cấu hình SMTP

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
# Sử dụng Gmail App Password
```

---

## 9. DATABASE

### 9.1. Thông tin kết nối

```properties
URL:      jdbc:mysql://localhost:3306/exercise201
Username: root
Password: (trống)
DDL:      spring.jpa.hibernate.ddl-auto=update  (tự động sync schema)
```

### 9.2. Sơ đồ quan hệ chính

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  categories  │     │   products   │     │    tags      │
│──────────────│     │──────────────│     │──────────────│
│ id (UUID)    │     │ id (UUID)    │     │ id (UUID)    │
│ parent_id    │←──┐ │ product_name │     │ tag_name     │
│ category_name│   │ │ sale_price   │     └──────┬───────┘
│ active       │   │ │ compare_price│            │
└──────┬───────┘   │ │ quantity     │     ┌──────┴───────┐
       │           │ │ published    │     │ product_tags │
┌──────┴───────┐   │ │ product_type │     │──────────────│
│product_       │   │ └──────┬───────┘     │ product_id   │
│ categories   │   │        │             │ tag_id       │
│──────────────│   │        │             └──────────────┘
│ product_id   │───┘        │
│ category_id  │            │
└──────────────┘     ┌──────┴───────┐
                     │   orders     │
┌──────────────┐     │──────────────│     ┌──────────────┐
│  customers   │     │ id (String)  │     │ order_status │
│──────────────│     │ customer_id  │─────│──────────────│
│ id (UUID)    │←────│ coupon_id    │     │ status_code  │
│ email        │     │ total_price  │     │ status_name  │
│ firebase_uid │     │ appointment_ │     │ color        │
│ auth_provider│     │   date       │     └──────────────┘
│ active       │     │ created_at   │
└──────────────┘     └──────┬───────┘     ┌──────────────┐
                            │             │  coupons     │
                     ┌──────┴───────┐     │──────────────│
                     │ order_items  │     │ id (UUID)    │
                     │──────────────│     │ code         │
                     │ order_id     │     │ discount_    │
                     │ product_id   │     │   value      │
                     │ quantity     │     │ discount_type│
                     │ price        │     │ max_usage    │
                     └──────────────┘     └──────────────┘
```

---

## 10. FIREBASE INTEGRATION

### 10.1. Cấu hình

```javascript
// Firebase Project: spa-fa1d5
{
  projectId: "spa-fa1d5",
  authDomain: "spa-fa1d5.firebaseapp.com",
  storageBucket: "spa-fa1d5.firebasestorage.app"
}
```

### 10.2. Tính năng sử dụng

| Tính năng | Trạng thái | Mô tả |
|:----------|:-----------|:------|
| Google Sign-in | ✅ Hoạt động | Đăng nhập bằng Google cho khách |
| Firebase Auth | ✅ Hoạt động | Quản lý user, token verification |
| Firebase Storage | ✅ Hoạt động | Upload & hiển thị ảnh |
| Analytics | ✅ Cấu hình | Google Analytics tracking |

### 10.3. Luồng Google Sign-in

1. User click "Đăng nhập bằng Google"
2. Firebase popup → User chọn tài khoản Google
3. Frontend nhận Firebase ID Token
4. Gửi token đến backend: `POST /auth/customer/firebase-login`
5. Backend verify token bằng Firebase Admin SDK
6. Tạo/cập nhật Customer entity (set `auth_provider = GOOGLE`)
7. Trả JWT token cho frontend
8. Frontend lưu JWT vào localStorage

---

## 11. CẤU HÌNH CHẠY DỰ ÁN

### 11.1. Yêu cầu

- **Java 17** (JDK)
- **Node.js** (16+ khuyến nghị)
- **MySQL** chạy trên `localhost:3306`
- **Maven** (hoặc dùng `mvnw` có sẵn)

### 11.2. Khởi chạy Backend

```bash
# Di chuyển vào thư mục backend
cd d:\webforspa\bonlai

# Chạy với Maven Wrapper
./mvnw spring-boot:run

# Backend chạy tại: http://localhost:8080
```

### 11.3. Khởi chạy Frontend

```bash
# Di chuyển vào thư mục frontend
cd d:\webforspa\frontendbonlai

# Cài dependencies (lần đầu)
npm install

# Chạy dev server
npm start

# Frontend chạy tại: http://localhost:3000
```

### 11.4. Chuẩn bị Database

```sql
-- Tạo database
CREATE DATABASE exercise201;

-- Schema sẽ tự động tạo bởi Hibernate (ddl-auto=update)
```

---

## 12. API ENDPOINTS TỔNG HỢP

### 12.1. Authentication (Public)

| Method | Endpoint | Mô tả |
|:-------|:---------|:------|
| POST | `/auth/customer/login` | Đăng nhập khách hàng |
| POST | `/auth/customer/register` | Đăng ký khách hàng |
| POST | `/auth/customer/firebase-login` | Đăng nhập bằng Google/Firebase |
| GET | `/auth/customer/auth-methods` | Lấy phương thức auth |
| POST | `/auth/staff/login` | Đăng nhập nhân viên |
| POST | `/auth/staff/register` | Đăng ký nhân viên |

### 12.2. Products / Services

| Method | Endpoint | Auth | Mô tả |
|:-------|:---------|:-----|:------|
| GET | `/api/products` | Public | Lấy tất cả dịch vụ |
| GET | `/api/products/:id` | Public | Chi tiết dịch vụ |
| GET | `/api/products/search?keyword=` | Public | Tìm kiếm dịch vụ |
| GET | `/api/products/category/:id` | Public | Lọc theo danh mục |
| GET | `/api/products/tag/:id` | Public | Lọc theo tag |
| POST | `/api/products` | Staff | Tạo dịch vụ mới |
| PUT | `/api/products/:id` | Staff | Cập nhật dịch vụ |
| DELETE | `/api/products/:id` | Staff | Xóa dịch vụ |
| POST | `/api/products/:id/images` | Staff | Upload ảnh |
| PUT | `/api/products/:id/status` | Staff | Bật/tắt dịch vụ |

### 12.3. Orders / Appointments

| Method | Endpoint | Auth | Mô tả |
|:-------|:---------|:-----|:------|
| GET | `/api/orders` | Staff | Lấy tất cả đơn hàng |
| GET | `/api/orders/:id` | Customer/Staff | Chi tiết đơn hàng |
| POST | `/api/orders` | Customer/Staff | Tạo đơn hàng mới |
| PUT | `/api/orders/:id` | Staff | Cập nhật đơn hàng |
| DELETE | `/api/orders/:id` | Customer/Staff | Hủy đơn hàng |
| GET | `/api/orders/customer/:id` | Customer/Staff | Đơn theo khách hàng |
| GET | `/api/orders/status/:code` | Staff | Đơn theo trạng thái |
| PUT | `/api/orders/:id/status/:code` | Staff | Cập nhật trạng thái |
| PUT | `/api/orders/customer/:id/status/:code` | Customer | Khách cập nhật (chỉ CANCELLED/RECEIVED) |
| POST | `/api/orders/:id/coupon/:code` | Customer/Staff | Áp dụng coupon |
| DELETE | `/api/orders/:id/coupon` | Customer/Staff | Gỡ coupon |

### 12.4. Categories, Customers, Coupons, etc.

> Tương tự pattern CRUD chuẩn REST cho từng module.

---

## 13. ĐÁNH GIÁ & GHI CHÚ

### 13.1. Điểm mạnh ✅

- Kiến trúc **tách biệt rõ ràng** Backend/Frontend
- **JWT + Firebase** authentication đầy đủ
- **Email notification** tự động
- UI theme **phù hợp** với domain SPA
- **Role-based security** với Spring Security
- **RESTful API** chuẩn với validation

### 13.2. Cần cải thiện ⚠️

- `console.log` debug **còn nhiều** trong production code
- **Hardcoded credentials** trong `application.properties` (email password, JWT secret)
- Chưa có **pagination** ở backend (trả về toàn bộ list)
- Chưa có **global error handling** chuẩn ở frontend
- Không dùng **state management** (Redux/Zustand) → props drilling
- `RoomService.java` tồn tại nhưng **không có entity Room** → code thừa?
- CORS config đang **cho phép tất cả** (`*`) → cần restrict cho production

### 13.3. Cổng mặc định

| Service | Port | URL |
|:--------|:-----|:----|
| Backend API | 8080 | `http://localhost:8080` |
| Frontend Dev | 3000 | `http://localhost:3000` |
| MySQL | 3306 | `localhost:3306` |

---

> 📝 **Ghi chú:** File này được tạo tự động dựa trên phân tích source code thực tế của dự án.
