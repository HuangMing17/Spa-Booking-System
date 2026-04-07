import axios from "axios";
import { getAuthToken, clearAuthData, isTokenExpired } from "./storage";

// Base URL cho backend
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

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

    // Thêm log chẩn đoán token cho F5
    const token = getAuthToken();
    if (token) {
      console.log("Token sent in request header:", token.substring(0, 15) + "...");
      config.headers.Authorization = token;
    } else {
      console.log("No token found for request:", config.url);
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
      const currentPath = window.location.pathname;

      switch (error.response.status) {
        case 401:
          // Unauthorized - Chỉ logout nếu là lỗi 401 (Hết hạn hoặc chưa đăng nhập)
          // Kiểm tra xem đã có tiến trình redirect nào đang chạy chưa để tránh lặp
          if (!window._isRedirectingToLogin) {
            window._isRedirectingToLogin = true;
            console.warn("Unauthorized (401) - Clearing session and redirecting...");
            
            clearAuthData();
            
            if (currentPath.startsWith("/admin")) {
              window.location.href = "/admin/login";
            } else {
              window.location.href = "/dang-nhap";
            }
          }
          return Promise.reject(new Error("Phiên đăng nhập đã hết hạn"));

        case 403:
          // Forbidden - Không có quyền. QUAN TRỌNG: Không được gọi logout ở đây!
          console.error("Forbidden (403) - Access denied for path:", error.config?.url);
          return Promise.reject(new Error("Bạn không có quyền thực hiện hành động này"));

        case 404:
          return Promise.reject(new Error("Không tìm thấy tài nguyên (404)"));

        case 500:
          console.error("Server Error (500):", error.response.data);
          return Promise.reject(new Error("Lỗi hệ thống từ server, vui lòng thử lại sau"));

        default:
          return Promise.reject(
            new Error(error.response.data?.message || `Lỗi ${error.response.status}`)
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
