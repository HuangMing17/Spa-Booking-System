# 🔧 TÀI LIỆU CHI TIẾT BACKEND - SPA BON LAI

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Kiến trúc Backend](#kiến-trúc-backend)
3. [Cấu trúc Dự án](#cấu-trúc-dự-án)
4. [Database Schema](#database-schema)
5. [Authentication & Security](#authentication--security)
6. [API Documentation](#api-documentation)
7. [Services & Business Logic](#services--business-logic)
8. [Email System](#email-system)
9. [File Upload](#file-upload)
10. [Configuration](#configuration)

---

## 🎯 TỔNG QUAN

Backend của SPA Bon Lai được xây dựng trên **Spring Boot 3.0.4** với **Java 17**, tuân theo kiến trúc **MVC** và **RESTful API** patterns.

### Công nghệ sử dụng

- **Framework:** Spring Boot 3.0.4
- **Language:** Java 17
- **Database:** MySQL (JDBC)
- **ORM:** Spring Data JPA / Hibernate
- **Security:** Spring Security + JWT
- **Authentication:** JWT + Firebase Auth
- **Email:** Spring Mail + Thymeleaf
- **Build Tool:** Maven
- **Validation:** Spring Validation

---

## 🏗️ KIẾN TRÚC BACKEND

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  Controllers (REST APIs)                                 │
│  - CustomerAuthController, StaffAuthController           │
│  - ProductController, OrderController                    │
│  - CategoryController, CouponController...               │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   SECURITY LAYER                         │
│  - JwtAuthFilter (Token validation)                      │
│  - SecurityConfig (Authorization rules)                  │
│  - FirebaseAuthService (Social login)                    │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   SERVICE LAYER                          │
│  Business Logic                                          │
│  - ProductService, OrderService                          │
│  - CategoryService, CouponService                        │
│  - EmailService, NotificationService...                  │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   REPOSITORY LAYER                       │
│  Data Access (Spring Data JPA)                          │
│  - ProductRepository, OrderRepository                    │
│  - CategoryRepository, CouponRepository...               │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   DATABASE LAYER                         │
│  MySQL Database (exercise201)                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📂 CẤU TRÚC DỰ ÁN

```
bonlai/src/main/java/com/hoangduyminh/exercise201/
├── Exercise201Application.java          # Main application class
│
├── auth/                                 # Authentication & Authorization
│   ├── config/
│   │   ├── FirebaseConfig.java          # Firebase configuration
│   │   ├── JwtAuthFilter.java           # JWT filter for requests
│   │   └── SecurityConfig.java          # Spring Security config
│   ├── controller/
│   │   ├── CustomerAuthController.java  # Customer auth endpoints
│   │   ├── StaffAuthController.java     # Staff auth endpoints
│   │   └── FirebaseAuthController.java  # Firebase auth endpoints
│   ├── dto/
│   │   ├── request/                     # Auth request DTOs
│   │   └── response/                    # Auth response DTOs
│   └── service/
│       ├── JwtService.java              # JWT token operations
│       ├── CustomerDetailsService.java  # Customer UserDetails
│       ├── StaffDetailsService.java     # Staff UserDetails
│       ├── FirebaseAuthService.java     # Firebase integration
│       └── CombinedUserDetailsService   # Combined authentication
│
├── config/
│   └── WebConfig.java                   # CORS & Web configuration
│
├── constant/
│   └── OrderStatusConstant.java         # Order status constants
│
├── controller/                          # REST Controllers
│   ├── ProductController.java           # Product/Service management
│   ├── OrderController.java             # Order management
│   ├── CategoryController.java          # Category management
│   ├── CouponController.java            # Coupon management
│   ├── CustomerController.java          # Customer management
│   ├── CartController.java              # Shopping cart
│   ├── TagController.java               # Tag management
│   ├── SlideshowController.java         # Slideshow management
│   ├── StaffController.java             # Staff management
│   ├── ProductReviewController.java     # Product reviews
│   ├── FileUploadController.java        # File upload
│   └── EmailTestController.java         # Email testing
│
├── dto/                                 # Data Transfer Objects
│   ├── request/                         # Request DTOs
│   └── response/                        # Response DTOs
│
├── entity/                              # JPA Entities
│   ├── BaseEntity.java                  # Base entity with audit fields
│   ├── Product.java                     # Product/Service entity
│   ├── Order.java                       # Order entity
│   ├── Customer.java                    # Customer entity
│   ├── StaffAccount.java                # Staff entity
│   ├── Category.java                    # Category entity
│   ├── Coupon.java                      # Coupon entity
│   ├── Cart.java, CartItem.java         # Cart entities
│   ├── Variant.java, VariantOption.java # Product variants
│   ├── Tag.java                         # Tag entity
│   ├── Slideshow.java                   # Slideshow entity
│   ├── ProductReview.java               # Review entity
│   └── ... (35+ entities)
│
├── exception/                           # Exception handling
│   ├── BusinessException.java           # Business logic exceptions
│   └── ResourceNotFoundException.java   # Resource not found
│
├── repository/                          # Spring Data JPA Repositories
│   ├── ProductRepository.java
│   ├── OrderRepository.java
│   ├── CustomerRepository.java
│   └── ... (35+ repositories)
│
├── service/                             # Service interfaces
│   ├── ProductService.java
│   ├── OrderService.java
│   ├── EmailService.java
│   └── ... (15+ services)
│
├── service/impl/                        # Service implementations
│   ├── ProductServiceImpl.java
│   ├── OrderServiceImpl.java
│   ├── EmailServiceImpl.java
│   └── ... (15+ implementations)
│
└── util/                                # Utility classes
    ├── OrderUtils.java
    └── ...
```

---

## 💾 DATABASE SCHEMA

### Core Entities

#### 1. **Customer** (customers)
```sql
CREATE TABLE customers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    auth_provider VARCHAR(50),  -- EMAIL, GOOGLE, FIREBASE
    firebase_uid VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 2. **StaffAccount** (staff_accounts)
```sql
CREATE TABLE staff_accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    role_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

#### 3. **Product** (products) - Dịch vụ Spa
```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    cost_per_item DECIMAL(10,2),
    image_url VARCHAR(500),
    sku VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    featured BOOLEAN DEFAULT false,
    duration INT,  -- Thời gian thực hiện dịch vụ (phút)
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 4. **Order** (orders) - Đơn đặt lịch
```sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE,
    customer_id BIGINT NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(20),
    customer_name VARCHAR(255),
    booking_date DATE,          -- Ngày đặt lịch
    booking_time TIME,          -- Giờ đặt lịch
    subtotal DECIMAL(10,2),
    discount_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    coupon_code VARCHAR(50),
    notes TEXT,
    status_id BIGINT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (status_id) REFERENCES order_statuses(id)
);
```

#### 5. **OrderItem** (order_items)
```sql
CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    variant_option_id BIGINT,
    product_name VARCHAR(255),
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),
    total DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_option_id) REFERENCES variant_options(id)
);
```

#### 6. **Category** (categories)
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    parent_id BIGINT,
    display_order INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);
```

#### 7. **Coupon** (coupons)
```sql
CREATE TABLE coupons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20),  -- PERCENTAGE, FIXED_AMOUNT
    discount_value DECIMAL(10,2),
    min_purchase_amount DECIMAL(10,2),
    max_discount_amount DECIMAL(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 8. **Cart** & **CartItem**
```sql
CREATE TABLE carts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT,
    session_id VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cart_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    variant_option_id BIGINT,
    quantity INT DEFAULT 1,
    price DECIMAL(10,2),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (cart_id) REFERENCES carts(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (variant_option_id) REFERENCES variant_options(id)
);
```

#### 9. **Variant System** (Product Variations)
```sql
CREATE TABLE variants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    name VARCHAR(255),  -- e.g., "Thời lượng", "Gói dịch vụ"
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE variant_options (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    variant_id BIGINT NOT NULL,
    option_value VARCHAR(255),  -- e.g., "60 phút", "90 phút"
    price_adjustment DECIMAL(10,2),
    FOREIGN KEY (variant_id) REFERENCES variants(id)
);
```

#### 10. **Tag** & **ProductTag**
```sql
CREATE TABLE tags (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE product_tags (
    product_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (product_id, tag_id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (tag_id) REFERENCES tags(id)
);
```

#### 11. **Slideshow** (slideshows)
```sql
CREATE TABLE slideshows (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    link_url VARCHAR(500),
    display_order INT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

#### 12. **ProductReview** (product_reviews)
```sql
CREATE TABLE product_reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    UNIQUE (product_id, customer_id)
);
```

#### 13. **OrderStatus** (order_statuses)
```sql
CREATE TABLE order_statuses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,  -- PENDING, CONFIRMED, COMPLETED, CANCELLED
    description TEXT,
    color VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Database Relationships

```
Customer ──1:N──> Order ──1:N──> OrderItem ──N:1──> Product
   │                                                     │
   │                                                     │
   └──1:N──> Cart ──1:N──> CartItem ──────────────────┘
   │                                                     │
   └──1:N──> ProductReview ──────────────────────────────┘
   │
   └──1:N──> CustomerAddress

Product ──N:M──> Category (via product_categories)
Product ──N:M──> Tag (via product_tags)
Product ──1:N──> Variant ──1:N──> VariantOption

StaffAccount ──N:1──> Role
```

---

## 🔒 AUTHENTICATION & SECURITY

### 1. JWT Authentication

#### JwtService ([`auth/service/JwtService.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/auth/service/JwtService.java:1))

```java
// JWT Token generation & validation
String generateToken(String username, String role)
String extractUsername(String token)
boolean isTokenValid(String token)
boolean isTokenExpired(String token)
```

**Configuration:**
- Secret Key: Trong [`application.properties`](../bonlai/src/main/resources/application.properties:2)
- Expiration: 24 hours (86400000 ms)
- Algorithm: HS256

#### JwtAuthFilter ([`auth/config/JwtAuthFilter.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/auth/config/JwtAuthFilter.java:1))

Filter để xác thực mỗi request:
1. Extract JWT từ Authorization header
2. Validate token
3. Load user details
4. Set authentication trong SecurityContext

### 2. Firebase Authentication

#### FirebaseAuthService ([`auth/service/FirebaseAuthService.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/auth/service/FirebaseAuthService.java:1))

Hỗ trợ đăng nhập với Google:
- Verify Firebase ID token
- Tạo hoặc cập nhật Customer
- Generate JWT token cho hệ thống

### 3. Security Configuration

#### SecurityConfig ([`auth/config/SecurityConfig.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/auth/config/SecurityConfig.java:1))

```java
// Public endpoints (không cần authentication)
- POST /api/customers/register
- POST /api/customers/login
- POST /api/staff/login
- POST /api/auth/firebase
- GET /api/products/**
- GET /api/categories/**
- GET /uploads/**

// Customer endpoints (role: CUSTOMER)
- /api/orders/**
- /api/cart/**
- /api/customers/profile/**

// Admin/Staff endpoints (role: ADMIN, STAFF)
- POST /api/products/**
- PUT /api/products/**
- DELETE /api/products/**
- /api/staff/**
- /api/coupons/**
```

### 4. Password Encryption

- **Algorithm:** BCrypt
- **Strength:** 10 rounds (default)
- Implemented trong [`SecurityConfig`](../bonlai/src/main/java/com/hoangduyminh/exercise201/auth/config/SecurityConfig.java:1)

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

### 5. User Roles

- **CUSTOMER:** Khách hàng
- **STAFF:** Nhân viên
- **ADMIN:** Quản trị viên (full access)

---

## 📡 API DOCUMENTATION

### Base URL
```
http://localhost:8080/api
```

### 🔑 Authentication APIs

#### Customer Registration
```http
POST /api/customers/register
Content-Type: application/json

Request Body:
{
    "email": "customer@example.com",
    "password": "password123",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789"
}

Response: 200 OK
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "customer": {
        "id": 1,
        "email": "customer@example.com",
        "fullName": "Nguyễn Văn A",
        "phone": "0123456789"
    }
}
```

#### Customer Login
```http
POST /api/customers/login
Content-Type: application/json

Request Body:
{
    "email": "customer@example.com",
    "password": "password123"
}

Response: 200 OK
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "customer": { ... }
}
```

#### Staff Login
```http
POST /api/staff/login
Content-Type: application/json

Request Body:
{
    "username": "staff001",
    "password": "password123"
}

Response: 200 OK
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "staff": {
        "id": 1,
        "username": "staff001",
        "fullName": "Trần Thị B",
        "role": "STAFF"
    }
}
```

#### Firebase Authentication
```http
POST /api/auth/firebase
Content-Type: application/json

Request Body:
{
    "idToken": "firebase-id-token-here"
}

Response: 200 OK
{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "customer": { ... }
}
```

---

### 💆 Product/Service APIs

#### Get All Products
```http
GET /api/products
Query Parameters:
  - page (default: 0)
  - size (default: 10)
  - categoryId (optional)
  - featured (optional)

Response: 200 OK
{
    "content": [
        {
            "id": 1,
            "name": "Massage Thư Giãn Toàn Thân",
            "slug": "massage-thu-gian-toan-than",
            "description": "Dịch vụ massage...",
            "price": 500000,
            "imageUrl": "/uploads/massage1.jpg",
            "duration": 90,
            "featured": true,
            "categories": [...],
            "tags": [...]
        }
    ],
    "totalPages": 5,
    "totalElements": 50
}
```

#### Get Product Detail
```http
GET /api/products/{id}

Response: 200 OK
{
    "id": 1,
    "name": "Massage Thư Gi ãn Toàn Thân",
    "slug": "massage-thu-gian-toan-than",
    "description": "Dịch vụ massage chuyên sâu...",
    "price": 500000,
    "comparePrice": 600000,
    "imageUrl": "/uploads/massage1.jpg",
    "duration": 90,
    "variants": [
        {
            "id": 1,
            "name": "Thời lượng",
            "options": [
                {"id": 1, "value": "60 phút", "priceAdjustment": 0},
                {"id": 2, "value": "90 phút", "priceAdjustment": 150000}
            ]
        }
    ],
    "gallery": [...],
    "reviews": [...],
    "averageRating": 4.5,
    "reviewCount": 25
}
```

#### Create Product (Admin/Staff)
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "name": "Chăm Sóc Da Mặt Cao Cấp",
    "slug": "cham-soc-da-mat-cao-cap",
    "description": "Liệu trình chăm sóc da...",
    "shortDescription": "Chăm sóc da chuyên sâu",
    "price": 800000,
    "comparePrice": 1000000,
    "duration": 120,
    "featured": true,
    "categoryIds": [1, 3],
    "tagIds": [1, 2],
    "variants": [
        {
            "name": "Gói dịch vụ",
            "options": [
                {"value": "Cơ bản", "priceAdjustment": 0},
                {"value": "Premium", "priceAdjustment": 300000}
            ]
        }
    ]
}

Response: 201 Created
{
    "id": 10,
    "name": "Chăm Sóc Da Mặt Cao Cấp",
    ...
}
```

#### Update Product (Admin/Staff)
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

Request Body: (same as create)

Response: 200 OK
```

#### Delete Product (Admin/Staff)
```http
DELETE /api/products/{id}
Authorization: Bearer {token}

Response: 204 No Content
```

---

### 📅 Order APIs

#### Get All Orders
```http
GET /api/orders
Authorization: Bearer {token}
Query Parameters:
  - page, size
  - status (optional)
  - customerId (optional - for customer's own orders)

Response: 200 OK
{
    "content": [
        {
            "id": 1,
            "orderNumber": "SP2026001",
            "customerName": "Nguyễn Văn A",
            "customerEmail": "customer@example.com",
            "customerPhone": "0123456789",
            "bookingDate": "2026-03-15",
            "bookingTime": "14:00:00",
            "totalAmount": 650000,
            "status": "CONFIRMED",
            "items": [...]
        }
    ]
}
```

#### Get Order Detail
```http
GET /api/orders/{id}
Authorization: Bearer {token}

Response: 200 OK
{
    "id": 1,
    "orderNumber": "SP2026001",
    "customerName": "Nguyễn Văn A",
    "customerEmail": "customer@example.com",
    "customerPhone": "0123456789",
    "bookingDate": "2026-03-15",
    "bookingTime": "14:00:00",
    "subtotal": 500000,
    "discountAmount": 50000,
    "totalAmount": 450000,
    "couponCode": "DISCOUNT10",
    "notes": "Khách yêu cầu phòng yên tĩnh",
    "status": {
        "id": 2,
        "name": "CONFIRMED",
        "description": "Đã xác nhận"
    },
    "items": [
        {
            "id": 1,
            "productName": "Massage Thư Giãn",
            "quantity": 1,
            "price": 500000,
            "variantOption": "90 phút",
            "total": 500000
        }
    ]
}
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "customerEmail": "customer@example.com",
    "customerPhone": "0123456789",
    "customerName": "Nguyễn Văn A",
    "bookingDate": "2026-03-15",
    "bookingTime": "14:00:00",
    "notes": "Khách yêu cầu phòng yên tĩnh",
    "couponCode": "DISCOUNT10",
    "items": [
        {
            "productId": 1,
            "variantOptionId": 2,
            "quantity": 1,
            "price": 500000
        }
    ]
}

Response: 201 Created
{
    "id": 1,
    "orderNumber": "SP2026001",
    ...
}

// Tự động gửi email xác nhận
```

#### Update Order Status (Admin/Staff)
```http
PUT /api/orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "statusId": 3  // COMPLETED
}

Response: 200 OK
{
    "id": 1,
    "status": "COMPLETED",
    ...
}

// Tự động gửi email cập nhật trạng thái
```

---

### 🛒 Cart APIs

#### Get Cart
```http
GET /api/cart
Authorization: Bearer {token}

Response: 200 OK
{
    "id": 1,
    "customerId": 1,
    "items": [
        {
            "id": 1,
            "product": {
                "id": 1,
                "name": "Massage Thư Giãn",
                "price": 500000,
                "imageUrl": "/uploads/massage1.jpg"
            },
            "variantOption": {
                "id": 2,
                "value": "90 phút",
                "priceAdjustment": 150000
            },
            "quantity": 1,
            "price": 650000
        }
    ],
    "totalAmount": 650000
}
```

#### Add Item to Cart
```http
POST /api/cart/items
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "productId": 1,
    "variantOptionId": 2,
    "quantity": 1
}

Response: 200 OK
{
    "cart": { ... }
}
```

#### Update Cart Item
```http
PUT /api/cart/items/{itemId}
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "quantity": 2
}

Response: 200 OK
```

#### Remove Cart Item
```http
DELETE /api/cart/items/{itemId}
Authorization: Bearer {token}

Response: 204 No Content
```

#### Clear Cart
```http
DELETE /api/cart
Authorization: Bearer {token}

Response: 204 No Content
```

---

### 📂 Category APIs

#### Get All Categories
```http
GET /api/categories

Response: 200 OK
[
    {
        "id": 1,
        "name": "Massage",
        "slug": "massage",
        "description": "Các dịch vụ massage",
        "imageUrl": "/uploads/cat-massage.jpg",
        "productCount": 15
    }
]
```

#### Create Category (Admin)
```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "name": "Chăm sóc da",
    "slug": "cham-soc-da",
    "description": "Các dịch vụ chăm sóc da mặt",
    "parentId": null
}

Response: 201 Created
```

---

### 🎫 Coupon APIs

#### Get All Coupons
```http
GET /api/coupons

Response: 200 OK
[
    {
        "id": 1,
        "code": "DISCOUNT10",
        "description": "Giảm 10% cho đơn hàng đầu tiên",
        "discountType": "PERCENTAGE",
        "discountValue": 10,
        "minPurchaseAmount": 300000,
        "maxDiscountAmount": 100000,
        "startDate": "2026-03-01T00:00:00",
        "endDate": "2026-03-31T23:59:59",
        "isActive": true
    }
]
```

#### Validate Coupon
```http
POST /api/coupons/validate
Content-Type: application/json

Request Body:
{
    "code": "DISCOUNT10",
    "orderAmount": 500000
}

Response: 200 OK
{
    "valid": true,
    "discountAmount": 50000,
    "message": "Mã giảm giá hợp lệ"
}
```

#### Create Coupon (Admin)
```http
POST /api/coupons
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "code": "SUMMER2026",
    "description": "Giảm 20% mùa hè",
    "discountType": "PERCENTAGE",
    "discountValue": 20,
    "minPurchaseAmount": 500000,
    "maxDiscountAmount": 200000,
    "usageLimit": 100,
    "startDate": "2026-06-01T00:00:00",
    "endDate": "2026-08-31T23:59:59"
}

Response: 201 Created
```

---

### 👥 Customer APIs

#### Get Customer Profile
```http
GET /api/customers/profile
Authorization: Bearer {token}

Response: 200 OK
{
    "id": 1,
    "email": "customer@example.com",
    "fullName": "Nguyễn Văn A",
    "phone": "0123456789",
    "addresses": [...]
}
```

#### Update Customer Profile
```http
PUT /api/customers/profile
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "fullName": "Nguyễn Văn A Updated",
    "phone": "0987654321"
}

Response: 200 OK
```

#### Get All Customers (Admin/Staff)
```http
GET /api/customers
Authorization: Bearer {token}

Response: 200 OK
[
    {
        "id": 1,
        "email": "customer@example.com",
        "fullName": "Nguyễn Văn A",
        "phone": "0123456789",
        "totalOrders": 5,
        "totalSpent": 2500000
    }
]
```

---

### 🏷️ Tag APIs

#### Get All Tags
```http
GET /api/tags

Response: 200 OK
[
    {
        "id": 1,
        "name": "Thư giãn",
        "slug": "thu-gian"
    }
]
```

#### Create Tag (Admin)
```http
POST /api/tags
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "name": "Cao cấp",
    "slug": "cao-cap"
}

Response: 201 Created
```

---

### 🖼️ Slideshow APIs

#### Get Active Slideshows
```http
GET /api/slideshows

Response: 200 OK
[
    {
        "id": 1,
        "title": "Khuyến mãi mùa hè",
        "description": "Giảm giá 20%...",
        "imageUrl": "/uploads/slide1.jpg",
        "linkUrl": "/services",
        "displayOrder": 1
    }
]
```

#### Create Slideshow (Admin)
```http
POST /api/slideshows
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "title": "Banner mới",
    "description": "Mô tả...",
    "imageUrl": "/uploads/banner.jpg",
    "linkUrl": "/services",
    "displayOrder": 1,
    "isActive": true
}

Response: 201 Created
```

---

### 📸 File Upload API

#### Upload File
```http
POST /api/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
  - file: [binary file]

Response: 200 OK
{
    "url": "/uploads/filename-123456.jpg"
}
```

**Supported formats:** JPG, PNG, GIF  
**Max size:** 5MB  
**Upload directory:** `${user.dir}/uploads`

---

### ⭐ Product Review APIs

#### Get Product Reviews
```http
GET /api/products/{productId}/reviews

Response: 200 OK
[
    {
        "id": 1,
        "customer": {
            "fullName": "Nguyễn Văn A"
        },
        "rating": 5,
        "comment": "Dịch vụ rất tốt!",
        "createdAt": "2026-03-01T10:00:00"
    }
]
```

#### Create Review
```http
POST /api/products/{productId}/reviews
Authorization: Bearer {token}
Content-Type: application/json

Request Body:
{
    "rating": 5,
    "comment": "Dịch vụ tuyệt vời!"
}

Response: 201 Created
```

---

## 🔧 SERVICES & BUSINESS LOGIC

### Core Services

#### 1. ProductService ([`service/impl/ProductServiceImpl.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/service/impl/ProductServiceImpl.java:1))

**Main Methods:**
- `getAllProducts(pageable, filters)` - Lấy danh sách sản phẩm với phân trang
- `getProductById(id)` - Lấy chi tiết sản phẩm
- `createProduct(request)` - Tạo sản phẩm mới
- `updateProduct(id, request)` - Cập nhật sản phẩm
- `deleteProduct(id)` - Xóa sản phẩm
- `getFeaturedProducts()` - Lấy sản phẩm nổi bật
- `getProductsByCategory(categoryId)` - Lọc theo danh mục

#### 2. OrderService ([`service/impl/OrderServiceImpl.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/service/impl/OrderServiceImpl.java:1))

**Main Methods:**
- `createOrder(orderDTO)` - Tạo đơn đặt lịch
  - Generate order number
  - Validate products & variants
  - Apply coupon (if any)
  - Calculate totals
  - **Send confirmation email**
  
- `updateOrderStatus(orderId, statusId)` - Cập nhật trạng thái
  - Validate status transition
  - Update order status
  - **Send status update email**
  
- `getCustomerOrders(customerId)` - Lấy đơn hàng của khách
- `getAllOrders(filters)` - Lấy tất cả đơn (Admin)

#### 3. EmailService ([`service/impl/EmailServiceImpl.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/service/impl/EmailServiceImpl.java:1))

**Main Methods:**
- `sendBookingConfirmationEmail(order)` - Email xác nhận đặt lịch
- `sendOrderStatusUpdateEmail(order)` - Email cập nhật trạng thái
- `sendAppointmentReminderEmail(order)` - Email nhắc nhở lịch hẹn

**Features:**
- HTML templates với Thymeleaf
- Async sending (không block main thread)
- Error handling
- Support Vietnamese characters (UTF-8)

#### 4. CartService ([`service/impl/CartServiceImpl.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/service/impl/CartServiceImpl.java:1))

**Main Methods:**
- `getOrCreateCart(customerId)` - Lấy hoặc tạo giỏ hàng
- `addItem(customerId, item)` - Thêm sản phẩm vào giỏ
- `updateItemQuantity(itemId, quantity)` - Cập nhật số lượng
- `removeItem(itemId)` - Xóa sản phẩm
- `clearCart(customerId)` - Xóa toàn bộ giỏ hàng
- `calculateTotal(cartId)` - Tính tổng tiền

#### 5. CouponService ([`service/impl/CouponServiceImpl.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/service/impl/CouponServiceImpl.java:1))

**Main Methods:**
- `validateCoupon(code, orderAmount)` - Kiểm tra mã giảm giá
- `calculateDiscount(coupon, orderAmount)` - Tính số tiền giảm
- `applyCoupon(orderId, code)` - Áp dụng mã giảm giá
- `incrementUsage(couponId)` - Tăng số lần sử dụng

#### 6. CustomerService ([`service/impl/CustomerServiceImpl.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/service/impl/CustomerServiceImpl.java:1))

**Main Methods:**
- `register(request)` - Đăng ký khách hàng mới
- `authenticate(email, password)` - Xác thực đăng nhập
- `getProfile(customerId)` - Lấy thông tin cá nhân
- `updateProfile(customerId, request)` - Cập nhật thông tin
- `changePassword(customerId, oldPwd, newPwd)` - Đổi mật khẩu

---

## 📧 EMAIL SYSTEM

Chi tiết đầy đủ trong [`EMAIL_NOTIFICATION_GUIDE.md`](../bonlai/EMAIL_NOTIFICATION_GUIDE.md:1)

### Email Templates

1. **booking-confirmation.html** - Email xác nhận đặt lịch
2. **order-status-update.html** - Email cập nhật trạng thái
3. **appointment-reminder.html** - Email nhắc nhở lịch hẹn

### SMTP Configuration

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

### Email Flow

```
Order Created ──> OrderService.createOrder()
                    ↓
               EmailService.sendBookingConfirmationEmail()
                    ↓
               Thymeleaf renders template
                    ↓
               Send via SMTP ──> Customer Email
```

---

## 📤 FILE UPLOAD

### FileUploadController ([`controller/FileUploadController.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/controller/FileUploadController.java:1))

**Endpoint:** `POST /api/upload`

**Configuration:**
```properties
file.upload-dir=${user.dir}/uploads
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB
```

**Supported Formats:**
- Images: JPG, JPEG, PNG, GIF
- Max size: 5MB

**File Naming:**
- Original filename + timestamp
- Example: `product-123456789.jpg`

**Storage:**
- Local filesystem: `${user.dir}/uploads/`
- Accessible via: `http://localhost:8080/uploads/filename.jpg`

---

## ⚙️ CONFIGURATION

### application.properties ([`src/main/resources/application.properties`](../bonlai/src/main/resources/application.properties:1))

```properties
# Server
server.port=8080

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/exercise201
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT
jwt.secret=YOUR_SECRET_KEY
jwt.expiration=86400000

# File Upload
file.upload-dir=${user.dir}/uploads
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB

# Firebase
firebase.service-account-key=classpath:firebase-service-account.json
firebase.project-id=spa-fa1d5

# Email (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.default-encoding=UTF-8

# Logging
logging.level.org.springframework.security=DEBUG
```

### WebConfig ([`config/WebConfig.java`](../bonlai/src/main/java/com/hoangduyminh/exercise201/config/WebConfig.java:1))

**CORS Configuration:**
```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

**Static Resources:**
```java
@Override
public void addResourceHandlers(ResourceHandlerRegistry registry) {
    registry.addResourceHandler("/uploads/**")
            .addResourceLocations("file:" + uploadDir + "/");
}
```

---

## 🚀 RUNNING THE BACKEND

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+

### Setup Steps

1. **Create Database:**
```sql
CREATE DATABASE exercise201 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. **Configure application.properties:**
   - Update database credentials
   - Set JWT secret
   - Configure email settings
   - Add Firebase service account key

3. **Build & Run:**
```bash
cd bonlai
mvn clean install
mvn spring-boot:run
```

4. **Access API:**
```
http://localhost:8080/api
```

### Testing

```bash
# Run tests
mvn test

# Run specific test
mvn test -Dtest=OrderServiceTest
```

---

## 📝 BEST PRACTICES

### 1. Error Handling
- Use [`BusinessException`](../bonlai/src/main/java/com/hoangduyminh/exercise201/exception/BusinessException.java:1) for business logic errors
- Use [`ResourceNotFoundException`](../bonlai/src/main/java/com/hoangduyminh/exercise201/exception/ResourceNotFoundException.java:1) for not found errors
- Global exception handler with `@ControllerAdvice`

### 2. Validation
- Use `@Valid` annotation on request bodies
- Custom validators when needed
- Clear error messages

### 3. DTOs
- Always use DTOs for API requests/responses
- Never expose entities directly
- Use MapStruct or manual mapping

### 4. Security
- Never log sensitive data
- Use parameterized queries (JPA does this)
- Validate all user inputs
- Use HTTPS in production

### 5. Performance
- Use pagination for large datasets
- Index database columns appropriately
- Use lazy loading for relationships
- Cache frequently accessed data

---

## 📚 ADDITIONAL RESOURCES

- [Email Notification Guide](../bonlai/EMAIL_NOTIFICATION_GUIDE.md:1)
- [Firebase Integration Guide](../bonlai/FIREBASE_INTEGRATION_GUIDE.md:1)
- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security Documentation](https://docs.spring.io/spring-security/reference/)

---

**© 2026 SPA Bon Lai - Backend Documentation**
