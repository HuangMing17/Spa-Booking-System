import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ConfigProvider } from "antd";

// Auth Providers
import { CustomerAuthProvider } from "./auth/customer/context/CustomerAuthContext";
import { AdminAuthProvider } from "./auth/admin/context/AdminAuthContext";
import { ChatProvider } from "./context/chat/ChatContext";

// Protected Routes
import ProtectedRoute from "./auth/customer/components/ProtectedRoute";
import AdminProtectedRoute from "./auth/admin/components/AdminProtectedRoute";

// Layouts
import AdminLayout from "./admin/layouts/AdminLayout";
import UserLayout from "./user/layouts/UserLayout";
import BookingLayout from "./user/layouts/BookingLayout";

// Customer Pages
import Home from "./user/pages/Home";
import Services from "./user/pages/Services";
import Contact from "./user/pages/Contact";
import About from "./user/pages/About";
import Booking from "./user/pages/Booking";
import Profile from "./user/pages/Profile";
import MyBookings from "./user/pages/MyBookings";
import CustomerLogin from "./auth/customer/pages/CustomerLogin";
import CustomerRegister from "./auth/customer/pages/CustomerRegister";
import ServiceDetailUser from "./user/components/ServiceDetailUser";
import CouponsView from "./user/pages/CouponsView";

// Admin Pages
import AdminLogin from "./auth/admin/pages/AdminLogin";
import Dashboard from "./admin/pages/Dashboard";
import CategoryList from "./admin/pages/categories/CategoryList";
import {
  ServiceList,
  ServiceForm,
  ServiceDetail,
} from "./admin/pages/services";
import {
  CustomerList,
  CustomerForm,
  CustomerDetail,
} from "./admin/pages/customers";
import {
  CouponList,
  CouponForm,
} from "./admin/pages/coupons";
import {
  OrderList,
  OrderForm,
  OrderDetail,
  AppointmentList,
  AppointmentForm,
  AppointmentDetail,
} from "./admin/pages/orders";
import {
  RevenueReport,
  ServicesReport,
} from "./admin/pages/reports";

// Theme
import { theme } from "./theme/themeConfig";

// Import Ant Design CSS
import "antd/dist/reset.css";

function App() {
  return (
    <ConfigProvider theme={theme}>
      <Router>
        <AdminAuthProvider>
          <CustomerAuthProvider>
            <ChatProvider>
              <Routes>
              {/* Public Routes */}
              <Route path="/dang-nhap" element={<CustomerLogin />} />
              <Route path="/dang-ky" element={<CustomerRegister />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              {/* Admin Routes - Protected */}
              <Route
                path="/admin/*"
                element={
                  <AdminProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route
                          path="/"
                          element={<Navigate to="/admin/dashboard" replace />}
                        />{" "}
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="customers" element={<CustomerList />} />
                        <Route
                          path="customers/create"
                          element={<CustomerForm />}
                        />
                        <Route
                          path="customers/:id/edit"
                          element={<CustomerForm />}
                        />
                        <Route
                          path="customers/:id"
                          element={<CustomerDetail />}
                        />
                        <Route path="services" element={<ServiceList />} />
                        <Route
                          path="services/create"
                          element={<ServiceForm />}
                        />
                        <Route
                          path="services/:id/edit"
                          element={<ServiceForm />}
                        />
                        <Route
                          path="services/:id"
                          element={<ServiceDetail />}
                        />{" "}
                        <Route
                          path="services/categories"
                          element={<CategoryList />}
                        />{" "}
                        <Route path="orders" element={<OrderList />} />
                        <Route path="orders/create" element={<OrderForm />} />
                        <Route path="orders/:id/edit" element={<OrderForm />} />
                        <Route path="orders/:id" element={<OrderDetail />} />
                        {/* Appointment Routes */}
                        <Route
                          path="appointments"
                          element={<AppointmentList />}
                        />
                        <Route
                          path="appointments/create"
                          element={<AppointmentForm />}
                        />
                        <Route
                          path="appointments/:id/edit"
                          element={<AppointmentForm />}
                        />
                        <Route
                          path="appointments/:id"
                          element={<AppointmentDetail />}
                        />                        <Route path="dat-lich" element={<AppointmentList />} />                        {/* Coupon Routes */}
                        <Route path="coupons" element={<CouponList />} />
                        <Route path="coupons/create" element={<CouponForm />} />
                        <Route path="coupons/:id/edit" element={<CouponForm />} />
                        {/* Report Routes */}
                        <Route path="reports/revenue" element={<RevenueReport />} />
                        <Route path="reports/services" element={<ServicesReport />} />
                        <Route
                          path="bao-cao"
                          element={<div>Báo cáo thống kê</div>}
                        />
                        <Route
                          path="cai-dat"
                          element={<div>Cài đặt hệ thống</div>}
                        />
                      </Routes>
                    </AdminLayout>
                  </AdminProtectedRoute>
                }
              />{" "}              {/* Home Route - BookingLayout but Public */}
              <Route
                path="/"
                element={
                  <BookingLayout isHomePage={true}>
                    <Home />
                  </BookingLayout>
                }
              />
                {/* Booking Layout Routes */}
              
              <Route
                path="/dat-lich"
                element={
                  <ProtectedRoute>
                    <BookingLayout>
                      <Booking />
                    </BookingLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="lich-hen"
                element={
                  <ProtectedRoute>
                    <BookingLayout>
                      <MyBookings />
                    </BookingLayout>
                  </ProtectedRoute>
                }
              />
              {/* Customer Routes - Mix of Public and Protected */}
              <Route
                path="/*"
                element={                  <UserLayout>
                    <Routes>
                      {" "}
                      {/* Public Routes */}
                      <Route path="dich-vu" element={<Services />} />
                      <Route
                        path="dich-vu/:id"
                        element={<ServiceDetailUser />}
                      />
                      <Route path="khuyen-mai" element={<CouponsView />} />
                      <Route path="lien-he" element={<Contact />} />
                      <Route path="gioi-thieu" element={<About />} />
                      {/* Protected Routes */}
                      <Route
                        path="thong-tin-ca-nhan"
                        element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        }
                      />{" "}
                    </Routes>
                  </UserLayout>
                }
              />
                {/* Default redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ChatProvider>
          </CustomerAuthProvider>
        </AdminAuthProvider>
      </Router>
    </ConfigProvider>
  );
}

export default App;
