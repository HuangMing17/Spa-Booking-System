# 🎨 TÀI LIỆU CHI TIẾT FRONTEND - SPA BON LAI

## 📋 MỤC LỤC

1. [Tổng quan](#tổng-quan)
2. [Công nghệ sử dụng](#công-nghệ-sử-dụng)
3. [Cấu trúc Dự án](#cấu-trúc-dự-án)
4. [Routing & Navigation](#routing--navigation)
5. [Authentication System](#authentication-system)
6. [State Management](#state-management)
7. [Components](#components)
8. [Pages](#pages)
9. [API Integration](#api-integration)
10. [Styling & UI](#styling--ui)
11. [Utils & Helpers](#utils--helpers)

---

## 🎯 TỔNG QUAN

Frontend của SPA Bon Lai được xây dựng với **React 19.1.0**, cung cấp:
- 🛍️ **User Interface:** Website đặt lịch cho khách hàng
- 👨‍💼 **Admin Dashboard:** Hệ thống quản trị cho nhân viên/admin

### Đặc điểm nổi bật

- ⚡ **Single Page Application (SPA)** với React Router
- 🔐 **Dual Authentication:** Email/Password + Firebase Google Login
- 🎨 **Multiple UI Libraries:** Material-UI, Ant Design, Bootstrap
- 📱 **Responsive Design:** Tối ưu cho mobile, tablet, desktop
- 🚀 **Modern React:** Hooks, Context API, Functional Components
- 🔄 **Real-time Updates:** Axios interceptors & error handling

---

## 🛠️ CÔNG NGHỆ SỬ DỤNG

### Core Technologies

```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "react-router-dom": "^7.6.0"
}
```

### UI Libraries

```json
{
  "@mui/material": "^7.1.0",           // Material-UI
  "@mui/icons-material": "^7.1.0",     // MUI Icons
  "antd": "^5.25.1",                   // Ant Design
  "bootstrap": "^5.3.6",               // Bootstrap
  "react-bootstrap": "^2.10.10",       // React Bootstrap
  "lucide-react": "^0.511.0"           // Lucide Icons
}
```

### HTTP & Authentication

```json
{
  "axios": "^1.9.0",                   // HTTP Client
  "firebase": "^11.8.1"                // Firebase Auth
}
```

### Utilities

```json
{
  "moment": "^2.30.1"                  // Date formatting
}
```

---

## 📂 CẤU TRÚC DỰ ÁN

```
frontendbonlai/src/
├── App.js                           # Main application component
├── index.js                         # Entry point
│
├── admin/                           # Admin Dashboard
│   ├── layouts/
│   │   └── AdminLayout.jsx          # Admin layout wrapper
│   └── pages/                       # Admin pages
│       ├── Dashboard.jsx            # Dashboard overview
│       ├── categories/              # Category management
│       │   ├── CategoryList.jsx
│       │   ├── CategoryForm.jsx
│       │   ├── CategoryDetail.jsx
│       │   ├── categoryAPI.js
│       │   └── index.js
│       ├── coupons/                 # Coupon management
│       │   ├── CouponList.jsx
│       │   ├── CouponForm.jsx
│       │   ├── CouponDetail.jsx
│       │   ├── couponAPI.js
│       │   └── index.js
│       ├── customers/               # Customer management
│       │   ├── CustomerList.jsx
│       │   ├── CustomerForm.jsx
│       │   ├── CustomerDetail.jsx
│       │   ├── customerAPI.js
│       │   └── index.js
│       ├── orders/                  # Order/Booking management
│       │   ├── OrderList.jsx
│       │   ├── OrderForm.jsx
│       │   ├── OrderDetail.jsx
│       │   ├── orderAPI.js
│       │   └── index.js
│       ├── services/                # Service management
│       │   ├── ServiceList.jsx
│       │   ├── ServiceForm.jsx
│       │   ├── ServiceDetail.jsx
│       │   ├── serviceAPI.js
│       │   └── index.js
│       └── reports/                 # Reports & Analytics
│           ├── RevenueReport.jsx
│           ├── ServicesReport.jsx
│           └── index.js
│
├── auth/                            # Authentication
│   ├── customer/                    # Customer auth
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx   # Route protection
│   │   ├── context/
│   │   │   └── CustomerAuthContext.jsx  # Auth state management
│   │   └── pages/
│   │       ├── CustomerLogin.jsx
│   │       └── CustomerRegister.jsx
│   └── admin/                       # Admin auth
│       ├── components/
│       │   ├── AdminProtectedRoute.jsx
│       │   ├── AdminHeader.jsx
│       │   └── AdminSidebar.jsx
│       ├── context/
│       │   └── AdminAuthContext.jsx
│       └── pages/
│           └── AdminLogin.jsx
│
├── user/                            # User Interface
│   ├── components/                  # User components
│   │   ├── Header.jsx               # Main header with navigation
│   │   ├── Footer.jsx               # Footer
│   │   ├── Sidebar.jsx              # Sidebar for mobile
│   │   ├── ServiceCard.jsx          # Service display card
│   │   └── ServiceDetailUser.jsx    # Service detail view
│   ├── layouts/                     # User layouts
│   │   ├── UserLayout.jsx           # Standard user layout
│   │   └── BookingLayout.jsx        # Booking flow layout
│   └── pages/                       # User pages
│       ├── Home.jsx                 # Landing page
│       ├── Services.jsx             # Services listing
│       ├── Booking.jsx              # Booking form
│       ├── MyBookings.jsx           # Booking history
│       ├── Profile.jsx              # User profile
│       ├── CouponsView.jsx          # Available coupons
│       ├── Contact.jsx              # Contact page
│       └── About.jsx                # About page
│
├── components/                      # Shared components
│   ├── ImageUpload.jsx              # Image upload component
│   ├── UploadButton.jsx             # Upload button
│   ├── SuccessNotification.jsx      # Success notification
│   ├── FirebaseTest.jsx             # Firebase testing
│   └── index.js                     # Component exports
│
├── utils/                           # Utilities
│   ├── axios.js                     # Axios configuration
│   ├── firebase.js                  # Firebase configuration
│   ├── formatters.js                # Data formatters
│   └── storage.js                   # Local storage helpers
│
├── theme/
│   └── themeConfig.js               # Theme configuration
│
└── App.css, index.css               # Global styles
```

---

## 🗺️ ROUTING & NAVIGATION

### Routing Architecture

[`App.js`](../frontendbonlai/src/App.js:1) sử dụng **React Router v7** với nested routes:

```javascript
<Router>
  <AdminAuthProvider>
    <CustomerAuthProvider>
      <Routes>
        {/* Public Routes */}
        {/* Admin Routes (Protected) */}
        {/* Customer Routes (Mix) */}
      </Routes>
    </CustomerAuthProvider>
  </AdminAuthProvider>
</Router>
```

### Route Structure

#### 🔓 Public Routes (Không cần đăng nhập)

```javascript
// Authentication
/dang-nhap                  // Customer login
/dang-ky                    // Customer register
/admin/login                // Admin/Staff login

// Public Pages
/                          // Home page
/dich-vu                   // Services listing
/dich-vu/:id               // Service detail
/khuyen-mai                // Coupons view
/lien-he                   // Contact
/gioi-thieu                // About
```

#### 🔐 Protected Customer Routes

```javascript
/dat-lich                  // Booking page (Customer only)
/lich-hen                  // My bookings (Customer only)
/thong-tin-ca-nhan         // Profile (Customer only)
```

#### 👨‍💼 Protected Admin Routes

```javascript
/admin/*                   // All admin routes require authentication

// Dashboard
/admin/dashboard           // Admin dashboard

// Services Management
/admin/services            // Service list
/admin/services/create     // Create service
/admin/services/:id/edit   // Edit service
/admin/services/:id        // Service detail
/admin/services/categories // Category management

// Orders Management
/admin/orders              // Order list
/admin/orders/create       // Create order
/admin/orders/:id/edit     // Edit order
/admin/orders/:id          // Order detail

// Appointments (same as orders)
/admin/appointments        // Appointment list
/admin/appointments/create // Create appointment
/admin/appointments/:id    // Appointment detail

// Customer Management
/admin/customers           // Customer list
/admin/customers/create    // Create customer
/admin/customers/:id/edit  // Edit customer
/admin/customers/:id       // Customer detail

// Coupon Management
/admin/coupons             // Coupon list
/admin/coupons/create      // Create coupon
/admin/coupons/:id/edit    // Edit coupon

// Reports
/admin/reports/revenue     // Revenue report
/admin/reports/services    // Services report
```

### Navigation Components

#### User Navigation ([`user/components/Header.jsx`](../frontendbonlai/src/user/components/Header.jsx:1))

```javascript
// Main navigation links
const navLinks = [
  { path: '/', label: 'Trang chủ' },
  { path: '/dich-vu', label: 'Dịch vụ' },
  { path: '/khuyen-mai', label: 'Khuyến mãi' },
  { path: '/lien-he', label: 'Liên hệ' },
  { path: '/gioi-thieu', label: 'Giới thiệu' }
];

// Authenticated user menu
- Thông tin cá nhân
- Lịch hẹn của tôi
- Đặt lịch
- Đăng xuất
```

#### Admin Navigation ([`auth/admin/components/AdminSidebar.jsx`](../frontendbonlai/src/auth/admin/components/AdminSidebar.jsx:1))

```javascript
// Admin sidebar menu
const menuItems = [
  { icon: <DashboardIcon />, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: <PeopleIcon />, label: 'Khách hàng', path: '/admin/customers' },
  { icon: <ServiceIcon />, label: 'Dịch vụ', path: '/admin/services' },
  { icon: <BookingIcon />, label: 'Đặt lịch', path: '/admin/orders' },
  { icon: <CouponIcon />, label: 'Mã giảm giá', path: '/admin/coupons' },
  { icon: <ReportIcon />, label: 'Báo cáo', path: '/admin/reports' },
];
```

---

## 🔐 AUTHENTICATION SYSTEM

### Customer Authentication

#### CustomerAuthContext ([`auth/customer/context/CustomerAuthContext.jsx`](../frontendbonlai/src/auth/customer/context/CustomerAuthContext.jsx:1))

**State Management:**
```javascript
const [user, setUser] = useState(null);
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [loading, setLoading] = useState(true);
```

**Authentication Methods:**

1. **Traditional Login (Email/Password)**
```javascript
const login = async (email, password, redirectPath = "/") => {
  const response = await axiosInstance.post("/auth/customer/login", {
    email,
    password,
  });
  
  setAuthData(response);  // Save to localStorage
  setUser(response.user);
  setIsLoggedIn(true);
  navigate(redirectPath);
};
```

2. **Firebase Google Login**
```javascript
const firebaseLogin = async (redirectPath = "/") => {
  // Đăng nhập với Firebase
  const firebaseResult = await firebaseAuthService.signInWithGoogle();
  const idToken = await firebaseResult.user.getIdToken();
  
  // Gửi token tới backend
  const response = await axiosInstance.post(
    "/auth/customer/firebase-login",
    { firebaseToken: idToken }
  );
  
  setAuthData(response);
  setUser(response.user);
  setIsLoggedIn(true);
  navigate(redirectPath);
};
```

3. **Logout**
```javascript
const logout = () => {
  clearAuthData();
  setUser(null);
  setIsLoggedIn(false);
  navigate("/dang-nhap");
};
```

**Context Values:**
```javascript
{
  user,              // User data object
  isLoggedIn,        // Boolean auth status
  loading,           // Loading state
  login,             // Traditional login function
  firebaseLogin,     // Firebase login function
  logout,            // Logout function
  updateUserInfo     // Update user info
}
```

#### Protected Routes ([`auth/customer/components/ProtectedRoute.jsx`](../frontendbonlai/src/auth/customer/components/ProtectedRoute.jsx:1))

```javascript
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useCustomerAuth();
  const location = useLocation();
  
  if (loading) return <LoadingSpinner />;
  
  if (!isLoggedIn) {
    // Redirect to login, save intended destination
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }
  
  return children;
};
```

### Admin Authentication

#### AdminAuthContext ([`auth/admin/context/AdminAuthContext.jsx`](../frontendbonlai/src/auth/admin/context/AdminAuthContext.jsx:1))

**Similar structure with staff-specific features:**
```javascript
const login = async (username, password) => {
  const response = await axiosInstance.post("/auth/staff/login", {
    username,
    password,
  });
  
  // Save with role information
  setAuthData(response);
  setStaff(response.staff);
  setIsLoggedIn(true);
};
```

**Admin Roles:**
- `ADMIN`: Full access
- `STAFF`: Limited access based on permissions

---

## 📦 STATE MANAGEMENT

### Context API

Dự án sử dụng **React Context API** cho state management:

1. **CustomerAuthContext** - Customer authentication state
2. **AdminAuthContext** - Admin/Staff authentication state

### Local Component State

Sử dụng React Hooks:
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Form State

Ant Design Form hoặc controlled components:
```javascript
const [form] = Form.useForm();

// Or native React
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});
```

---

## 🧩 COMPONENTS

### Shared Components

#### 1. ImageUpload ([`components/ImageUpload.jsx`](../frontendbonlai/src/components/ImageUpload.jsx:1))

Upload hình ảnh lên server:
```javascript
<ImageUpload
  onUploadSuccess={(url) => setImageUrl(url)}
  currentImage={imageUrl}
/>
```

**Features:**
- Preview image before upload
- Progress indicator
- Error handling
- Multiple format support (JPG, PNG, GIF)

#### 2. SuccessNotification ([`components/SuccessNotification.jsx`](../frontendbonlai/src/components/SuccessNotification.jsx:1))

Hiển thị thông báo thành công:
```javascript
<SuccessNotification
  message="Đặt lịch thành công!"
  description="Chúng tôi đã gửi xác nhận qua email"
  onClose={() => navigate('/')}
/>
```

### User Components

#### 1. Header ([`user/components/Header.jsx`](../frontendbonlai/src/user/components/Header.jsx:1))

Main navigation header:
```javascript
<Header>
  - Logo
  - Navigation links
  - User menu (if logged in)
  - Login button (if not logged in)
  - Mobile menu toggle
</Header>
```

**Features:**
- Responsive design
- Sticky header on scroll
- User dropdown menu
- Shopping cart icon (with badge)

#### 2. ServiceCard ([`user/components/ServiceCard.jsx`](../frontendbonlai/src/user/components/ServiceCard.jsx:1))

Display service in card format:
```javascript
<ServiceCard
  service={{
    id: 1,
    name: "Massage Thư Giãn",
    price: 500000,
    duration: 90,
    imageUrl: "/uploads/massage.jpg"
  }}
/>
```

**Layout:**
- Service image
- Service name
- Price & duration
- Rating stars
- "Đặt lịch" button

#### 3. ServiceDetailUser ([`user/components/ServiceDetailUser.jsx`](../frontendbonlai/src/user/components/ServiceDetailUser.jsx:1))

Full service detail view:
```javascript
<ServiceDetailUser serviceId={id}>
  - Image gallery
  - Service info (name, price, duration)
  - Description
  - Variant options
  - Reviews & ratings
  - "Thêm vào giỏ" button
</ServiceDetailUser>
```

### Admin Components

#### 1. AdminHeader ([`auth/admin/components/AdminHeader.jsx`](../frontendbonlai/src/auth/admin/components/AdminHeader.jsx:1))

Admin dashboard header:
```javascript
<AdminHeader>
  - Sidebar toggle
  - Page title
  - Breadcrumbs
  - User menu (Admin info, Logout)
  - Notifications
</AdminHeader>
```

#### 2. AdminSidebar ([`auth/admin/components/AdminSidebar.jsx`](../frontendbonlai/src/auth/admin/components/AdminSidebar.jsx:1))

Navigation sidebar:
```javascript
<AdminSidebar collapsed={collapsed}>
  - Dashboard
  - Khách hàng
  - Dịch vụ
  - Đặt lịch
  - Mã giảm giá
  - Báo cáo
  - Cài đặt
</AdminSidebar>
```

---

## 📄 PAGES

### User Pages

#### 1. Home ([`user/pages/Home.jsx`](../frontendbonlai/src/user/pages/Home.jsx:1))

Landing page:
```javascript
<Home>
  - Hero slideshow
  - Featured services
  - Benefits section
  - Testimonials
  - Call-to-action
</Home>
```

#### 2. Services ([`user/pages/Services.jsx`](../frontendbonlai/src/user/pages/Services.jsx:1))

Service listing with filters:
```javascript
<Services>
  - Category filter
  - Price range filter
  - Duration filter
  - Search bar
  - Service grid/list
  - Pagination
</Services>
```

#### 3. Booking ([`user/pages/Booking.jsx`](../frontendbonlai/src/user/pages/Booking.jsx:1))

Booking form (Protected):
```javascript
<Booking>
  Step 1: Chọn dịch vụ
  Step 2: Chọn ngày giờ
  Step 3: Thông tin khách hàng
  Step 4: Xác nhận & thanh toán
  - Apply coupon
  - Review order
  - Submit booking
</Booking>
```

**Form Fields:**
```javascript
{
  services: [],           // Selected services
  bookingDate: '',        // Date
  bookingTime: '',        // Time
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  notes: '',
  couponCode: ''
}
```

#### 4. MyBookings ([`user/pages/MyBookings.jsx`](../frontendbonlai/src/user/pages/MyBookings.jsx:1))

Booking history (Protected):
```javascript
<MyBookings>
  - Filter by status (Pending, Confirmed, Completed, Cancelled)
  - Search by order number
  - List of bookings with:
    * Order number
    * Date & time
    * Services
    * Status badge
    * Total amount
    * Action buttons (View detail, Cancel)
</MyBookings>
```

#### 5. Profile ([`user/pages/Profile.jsx`](../frontendbonlai/src/user/pages/Profile.jsx:1))

User profile management (Protected):
```javascript
<Profile>
  - Personal information
  - Change password
  - Address management
  - Booking history summary
  - Loyalty points (if any)
</Profile>
```

#### 6. CouponsView ([`user/pages/CouponsView.jsx`](../frontendbonlai/src/user/pages/CouponsView.jsx:1))

Available coupons:
```javascript
<CouponsView>
  - Active coupons list
  - Coupon card with:
    * Discount value
    * Minimum purchase
    * Expiry date
    * Terms & conditions
    * "Copy code" button
</CouponsView>
```

### Admin Pages

#### 1. Dashboard ([`admin/pages/Dashboard.jsx`](../frontendbonlai/src/admin/pages/Dashboard.jsx:1))

Overview statistics:
```javascript
<Dashboard>
  - Summary cards:
    * Total revenue (today, month, year)
    * Total bookings
    * Total customers
    * Pending orders
  - Revenue chart (line/bar)
  - Recent bookings table
  - Top services
  - Quick actions
</Dashboard>
```

#### 2. ServiceList ([`admin/pages/services/ServiceList.jsx`](../frontendbonlai/src/admin/pages/services/ServiceList.jsx:1))

Service management:
```javascript
<ServiceList>
  - Search & filters
  - "Tạo mới" button
  - Data table with columns:
    * Image
    * Name
    * Category
    * Price
    * Duration
    * Status (Active/Inactive)
    * Actions (Edit, Delete, View)
  - Pagination
  - Bulk actions
</ServiceList>
```

#### 3. ServiceForm ([`admin/pages/services/ServiceForm.jsx`](../frontendbonlai/src/admin/pages/services/ServiceForm.jsx:1))

Create/Edit service:
```javascript
<ServiceForm>
  - Basic information
    * Name
    * Description
    * Short description
    * Image upload
  - Pricing
    * Price
    * Compare price
    * Cost per item
  - Categories & Tags
  - Variants (options)
  - Gallery images
  - SEO (slug, meta)
  - Status toggle
</ServiceForm>
```

#### 4. OrderList ([`admin/pages/orders/OrderList.jsx`](../frontendbonlai/src/admin/pages/orders/OrderList.jsx:1))

Order management:
```javascript
<OrderList>
  - Filters:
    * Date range
    * Status
    * Customer
  - Data table:
    * Order number
    * Customer name
    * Booking date/time
    * Services
    * Total amount
    * Status
    * Actions (View, Edit status)
  - Export to CSV
</OrderList>
```

#### 5. OrderDetail ([`admin/pages/orders/OrderDetail.jsx`](../frontendbonlai/src/admin/pages/orders/OrderDetail.jsx:1))

Order detail view:
```javascript
<OrderDetail>
  - Order information
  - Customer information
  - Services list
  - Payment details
  - Status history
  - Update status action
  - Print/Download invoice
  - Send notification
</OrderDetail>
```

#### 6. CustomerList ([`admin/pages/customers/CustomerList.jsx`](../frontendbonlai/src/admin/pages/customers/CustomerList.jsx:1))

Customer management:
```javascript
<CustomerList>
  - Search by name, email, phone
  - Data table:
    * Name
    * Email
    * Phone
    * Total bookings
    * Total spent
    * Join date
    * Actions
  - Customer statistics
</CustomerList>
```

#### 7. CouponList ([`admin/pages/coupons/CouponList.jsx`](../frontendbonlai/src/admin/pages/coupons/CouponList.jsx:1))

Coupon management:
```javascript
<CouponList>
  - "Tạo mã mới" button
  - Data table:
    * Code
    * Discount type & value
    * Usage limit
    * Used count
    * Valid period
    * Status
    * Actions (Edit, Deactivate)
</CouponList>
```

#### 8. Reports ([`admin/pages/reports/`](../frontendbonlai/src/admin/pages/reports/RevenueReport.jsx:1))

Analytics & reports:
```javascript
// RevenueReport
<RevenueReport>
  - Date range selector
  - Revenue chart (daily, monthly, yearly)
  - Revenue by service category
  - Revenue comparison
  - Export report
</RevenueReport>

// ServicesReport
<ServicesReport>
  - Top performing services
  - Service booking frequency
  - Average rating per service
  - Service revenue contribution
</ServicesReport>
```

---

## 🔗 API INTEGRATION

### Axios Configuration ([`utils/axios.js`](../frontendbonlai/src/utils/axios.js:1))

**Base Configuration:**
```javascript
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

**Request Interceptor:**
```javascript
axiosInstance.interceptors.request.use(
  (config) => {
    // Add JWT token to all requests
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle file upload
    if (config.headers["Content-Type"] === "multipart/form-data") {
      delete config.headers["Content-Type"];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);
```

**Response Interceptor:**
```javascript
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      clearAuthData();
      window.location.href = "/dang-nhap";
    }
    
    return Promise.reject(error);
  }
);
```

### API Modules

Each feature has its own API file:

#### Service API ([`admin/pages/services/serviceAPI.js`](../frontendbonlai/src/admin/pages/services/serviceAPI.js:1))

```javascript
export const serviceAPI = {
  getAllServices: (params) => 
    axiosInstance.get('/api/products', { params }),
  
  getServiceById: (id) => 
    axiosInstance.get(`/api/products/${id}`),
  
  createService: (data) => 
    axiosInstance.post('/api/products', data),
  
  updateService: (id, data) => 
    axiosInstance.put(`/api/products/${id}`, data),
  
  deleteService: (id) => 
    axiosInstance.delete(`/api/products/${id}`),
};
```

#### Order API ([`admin/pages/orders/orderAPI.js`](../frontendbonlai/src/admin/pages/orders/orderAPI.js:1))

```javascript
export const orderAPI = {
  getAllOrders: (params) => 
    axiosInstance.get('/api/orders', { params }),
  
  getOrderById: (id) => 
    axiosInstance.get(`/api/orders/${id}`),
  
  createOrder: (data) => 
    axiosInstance.post('/api/orders', data),
  
  updateOrderStatus: (id, statusId) => 
    axiosInstance.put(`/api/orders/${id}/status`, { statusId }),
};
```

### Usage Example

```javascript
import { serviceAPI } from './serviceAPI';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceAPI.getAllServices({
        page: 0,
        size: 10,
        featured: true
      });
      setServices(data.content);
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    // Component JSX
  );
};
```

---

## 🎨 STYLING & UI

### UI Libraries Usage

#### 1. Material-UI (MUI)

Primarily used for admin dashboard:
```javascript
import { Button, TextField, Card, Grid } from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

<Button variant="contained" color="primary" startIcon={<Edit />}>
  Chỉnh sửa
</Button>
```

#### 2. Ant Design

Used for forms, tables, and modals:
```javascript
import { Form, Input, Table, Modal, message } from 'antd';

<Form form={form} onFinish={handleSubmit}>
  <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
    <Input />
  </Form.Item>
</Form>

<Table dataSource={data} columns={columns} />
```

#### 3. Bootstrap

Used for landing page and user interface:
```javascript
import { Container, Row, Col, Navbar } from 'react-bootstrap';

<Container>
  <Row>
    <Col md={6}>Content</Col>
  </Row>
</Container>
```

### Theme Configuration ([`theme/themeConfig.js`](../frontendbonlai/src/theme/themeConfig.js:1))

```javascript
export const theme = {
  token: {
    colorPrimary: '#FF69B4',      // Hot pink - spa theme
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#f5222d',
    colorInfo: '#1890ff',
    
    borderRadius: 8,
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 6,
      controlHeight: 40,
    },
  },
};
```

### Custom Styles

#### Home Page ([`user/pages/Home.css`](../frontendbonlai/src/user/pages/Home.css:1))

```css
.hero-section {
  height: 600px;
  background: linear-gradient(135deg, #FF69B4, #FFB6C1);
}

.service-card {
  transition: transform 0.3s ease;
}

.service-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}
```

#### Service Card ([`user/components/ServiceCard.css`](../frontendbonlai/src/user/components/ServiceCard.css:1))

```css
.service-card-image {
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
}

.service-price {
  font-size: 24px;
  font-weight: bold;
  color: #FF69B4;
}
```

---

## 🛠️ UTILS & HELPERS

### Storage Utils ([`utils/storage.js`](../frontendbonlai/src/utils/storage.js:1))

LocalStorage helpers:
```javascript
// Save auth data
export const setAuthData = (data) => {
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
};

// Get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Get user data
export const getUserData = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if authenticated
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token && !isTokenExpired(token);
};
```

### Firebase Utils ([`utils/firebase.js`](../frontendbonlai/src/utils/firebase.js:1))

Firebase configuration:
```javascript
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "spa-fa1d5.firebaseapp.com",
  projectId: "spa-fa1d5",
  // ...
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export const firebaseAuthService = {
  signInWithGoogle: () => signInWithPopup(auth, googleProvider),
  signOut: () => auth.signOut(),
  getCurrentUser: () => auth.currentUser,
};
```

### Formatters ([`utils/formatters.js`](../frontendbonlai/src/utils/formatters.js:1))

Data formatting utilities:
```javascript
import moment from 'moment';

// Format currency (VND)
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Format date
export const formatDate = (date, format = 'DD/MM/YYYY') => {
  return moment(date).format(format);
};

// Format date time
export const formatDateTime = (date) => {
  return moment(date).format('DD/MM/YYYY HH:mm');
};

// Format phone number
export const formatPhone = (phone) => {
  // Convert 0123456789 to 012-345-6789
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
};

// Calculate duration text
export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
};
```

---

## 🚀 RUNNING THE FRONTEND

### Prerequisites
- Node.js 16+
- npm or yarn

### Setup Steps

1. **Install Dependencies:**
```bash
cd frontendbonlai
npm install
```

2. **Configure Environment:**

Create `.env` file (if needed):
```env
REACT_APP_API_URL=http://localhost:8080
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=spa-fa1d5.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=spa-fa1d5
```

3. **Run Development Server:**
```bash
npm start
```

Application runs on `http://localhost:3000`

4. **Build for Production:**
```bash
npm run build
```

Production build in `/build` folder

### Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile */
@media (max-width: 576px) { }

/* Tablet */
@media (min-width: 577px) and (max-width: 768px) { }

/* Desktop */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1025px) { }
```

### Mobile Optimizations

- Mobile-first approach
- Touch-friendly buttons (min 44x44px)
- Hamburger menu for navigation
- Optimized image sizes
- Lazy loading for images

---

## 🔧 DEVELOPMENT BEST PRACTICES

### 1. Component Structure

```javascript
// Imports
import React, { useState, useEffect } from 'react';

// Component
const MyComponent = ({ prop1, prop2 }) => {
  // State
  const [state, setState] = useState(initialState);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Handlers
  const handleEvent = () => { };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// Export
export default MyComponent;
```

### 2. Error Handling

```javascript
try {
  const data = await api.fetchData();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  message.error(error.message || 'Có lỗi xảy ra');
} finally {
  setLoading(false);
}
```

### 3. Loading States

```javascript
{loading ? (
  <Spin size="large" />
) : (
  <DataDisplay data={data} />
)}
```

### 4. Conditional Rendering

```javascript
{isLoggedIn && <UserMenu />}
{!data ? <EmptyState /> : <DataList data={data} />}
```

### 5. Code Splitting

```javascript
const AdminDashboard = React.lazy(() => import('./admin/pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <AdminDashboard />
</Suspense>
```

---

## 📚 ADDITIONAL RESOURCES

- [React Documentation](https://react.dev/)
- [React Router Documentation](https://reactrouter.com/)
- [Material-UI Documentation](https://mui.com/)
- [Ant Design Documentation](https://ant.design/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Axios Documentation](https://axios-http.com/)

---

**© 2026 SPA Bon Lai - Frontend Documentation**
