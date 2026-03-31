import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axiosInstance from "../../../utils/axios";
import {
  setAuthData,
  clearAuthData,
  isAuthenticated,
  getUserData,
  getUserType,
} from "../../../utils/storage";

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth phải được sử dụng trong AdminAuthProvider");
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      if (isAuthenticated()) {
        const userType = getUserType();
        // Chỉ xử lý nếu userType là staff/admin (so sánh không phân biệt hoa/thường)
        const ut = userType ? userType.toLowerCase() : "";
        if (ut === "staff" || ut === "admin") {
          const userData = getUserData();
          setAdmin(userData);
          setIsLoggedIn(true);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);
  const login = async (
    username,
    password,
    redirectPath = "/admin/dashboard"
  ) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/staff/login", {
        username,
        password,
      });

      if (response.userType !== "STAFF" && response.userType !== "ADMIN") {
        throw new Error("Không có quyền truy cập (không phải Staff/Admin)");
      }

      setAuthData(response);
      setAdmin(response.user);
      setIsLoggedIn(true);

      message.success("Đăng nhập thành công");
      navigate(redirectPath);
    } catch (error) {
      message.error(error?.message || "Đăng nhập thất bại");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setAdmin(null);
    setIsLoggedIn(false);
    message.success("Đăng xuất thành công");
    navigate("/admin/login");
  };

  const updateAdminInfo = (newData) => {
    setAdmin((prevAdmin) => ({
      ...prevAdmin,
      ...newData,
    }));
  };

  const value = {
    admin,
    isLoggedIn,
    loading,
    login,
    logout,
    updateAdminInfo,
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthContext;
