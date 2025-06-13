import axios from "axios";
import { getAuthToken, clearAuthData, isTokenExpired } from "./storage";

// Base URL cho backend
export const API_BASE_URL = "http://localhost:8080";

// Tạo instance axios với config mặc định
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Tăng timeout cho upload file
  headers: {
    "Content-Type": "application/json",
    // Thêm CORS headers
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  },
});

// Interceptor cho request
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(
      "Making request to:",
      config.url,
      "with method:",
      config.method
    );

    // Xử lý đặc biệt cho file upload
    if (config.headers["Content-Type"] === "multipart/form-data") {
      // Xóa Content-Type để browser tự set boundary
      delete config.headers["Content-Type"];
    }

    // Luôn thêm token vào header mà không kiểm tra điều kiện
    const token = getAuthToken();
    if (token) {
      // Đã loại bỏ kiểm tra token hết hạn
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Interceptor cho response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.data);
    return response.data;
  },
  (error) => {
    console.error("Response error:", error.response || error);

    // Xử lý các lỗi response
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - Clear auth data và redirect
          clearAuthData();
          window.location.href = "/dang-nhap";
          return Promise.reject(new Error("Vui lòng đăng nhập lại"));

        case 403:
          // Forbidden
          return Promise.reject(new Error("Bạn không có quyền truy cập"));

        case 404:
          // Not found
          return Promise.reject(new Error("Không tìm thấy tài nguyên"));

        case 500:
          // Server error
          return Promise.reject(
            new Error("Lỗi hệ thống, vui lòng thử lại sau")
          );

        default:
          return Promise.reject(
            new Error(error.response.data?.message || "Có lỗi xảy ra")
          );
      }
    }

    // Lỗi network/timeout
    if (error.request) {
      return Promise.reject(new Error("Không thể kết nối đến server"));
    }

    // Lỗi khác
    return Promise.reject(new Error("Có lỗi xảy ra, vui lòng thử lại"));
  }
);

export default axiosInstance;

// API endpoints - đảm bảo URL đồng nhất với backend
export const API_ENDPOINTS = {
  CUSTOMER: {
    LOGIN: "/auth/customer/login",
    REGISTER: "/auth/customer/register",
    FIREBASE_LOGIN: "/auth/customer/firebase-login",
    AUTH_METHODS: "/auth/customer/auth-methods",
    FIREBASE_HEALTH: "/auth/customer/firebase-health",
    PROFILE: "/customers/profile",
  },
};
