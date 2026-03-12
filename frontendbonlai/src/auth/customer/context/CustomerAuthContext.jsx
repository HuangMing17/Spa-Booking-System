import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axiosInstance from "../../../utils/axios";
import { firebaseAuthService } from "../../../utils/firebase";
import {
  setAuthData,
  clearAuthData,
  isAuthenticated,
  getUserData,
} from "../../../utils/storage";

const CustomerAuthContext = createContext(null);

export const useCustomerAuth = () => {
  const context = useContext(CustomerAuthContext);
  if (!context) {
    throw new Error(
      "useCustomerAuth phải được sử dụng trong CustomerAuthProvider"
    );
  }
  return context;
};

export const CustomerAuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Kiểm tra trạng thái đăng nhập khi component mount
  useEffect(() => {
    const initializeAuth = () => {
      if (isAuthenticated()) {
        const userData = getUserData();
        setUser(userData);
        setIsLoggedIn(true);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);
  // Xử lý đăng nhập traditional
  const login = async (email, password, redirectPath = "/") => {
    try {
      setLoading(true);
      const response = await axiosInstance.post("/auth/customer/login", {
        email,
        password,
      });

      // Lưu thông tin authentication
      setAuthData(response);
      setUser(response.user);
      setIsLoggedIn(true);

      message.success("Đăng nhập thành công");
      navigate(redirectPath); // Chuyển đến trang được yêu cầu
    } catch (error) {
      message.error(error?.message || "Đăng nhập thất bại");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập với Firebase Google
  const firebaseLogin = async (redirectPath = "/") => {
    try {
      setLoading(true);
      message.loading("Đang đăng nhập với Google...", 0);

      // Đăng nhập với Firebase
      const firebaseResult = await firebaseAuthService.signInWithGoogle();
      const idToken = await firebaseResult.user.getIdToken();

      // Gửi Firebase token tới backend để lấy JWT
      const response = await axiosInstance.post(
        "/auth/customer/firebase-login",
        {
          firebaseToken: idToken,
        }
      );

      // Lưu thông tin authentication (cùng format với traditional login)
      setAuthData(response);
      setUser(response.user);
      setIsLoggedIn(true);

      message.destroy(); // Xóa loading message
      message.success("Đăng nhập với Google thành công!");
      navigate(redirectPath);
    } catch (error) {
      message.destroy(); // Xóa loading message
      console.error("Firebase login error:", error);

      // Xử lý các loại lỗi cụ thể
      if (error.code === "auth/popup-closed-by-user") {
        message.warning("Đăng nhập bị hủy");
      } else if (error.code === "auth/network-request-failed") {
        message.error("Lỗi kết nối mạng, vui lòng thử lại");
      } else {
        message.error(error?.message || "Đăng nhập với Google thất bại");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng nhập với Facebook qua Firebase
  const facebookLogin = async (redirectPath = "/") => {
    try {
      setLoading(true);
      message.loading("Đang đăng nhập với Facebook...", 0);

      // Đăng nhập với Facebook qua Firebase
      const firebaseResult = await firebaseAuthService.signInWithFacebook();
      const idToken = await firebaseResult.user.getIdToken();

      // Gửi Firebase token tới backend (dùng lại endpoint firebase-login)
      const response = await axiosInstance.post(
        "/auth/customer/firebase-login",
        {
          firebaseToken: idToken,
        }
      );

      // Lưu thông tin authentication
      setAuthData(response);
      setUser(response.user);
      setIsLoggedIn(true);

      message.destroy();
      message.success("Đăng nhập với Facebook thành công!");
      navigate(redirectPath);
    } catch (error) {
      message.destroy();
      console.error("Facebook login error:", error);

      if (error.code === "auth/popup-closed-by-user") {
        message.warning("Đăng nhập bị hủy");
      } else if (error.code === "auth/network-request-failed") {
        message.error("Lỗi kết nối mạng, vui lòng thử lại");
      } else if (error.code === "auth/popup-blocked") {
        message.error("Popup bị chặn. Vui lòng cho phép popup để đăng nhập");
      } else {
        message.error(error?.message || "Đăng nhập với Facebook thất bại");
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng xuất
  const logout = () => {
    clearAuthData();
    setUser(null);
    setIsLoggedIn(false);
    message.success("Đăng xuất thành công");
    navigate("/dang-nhap");
  };

  // Cập nhật thông tin user
  const updateUserInfo = (newUserData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...newUserData,
    }));
  };

  const authContextValue = {
    user,
    isLoggedIn,
    loading,
    login,
    firebaseLogin,
    facebookLogin,
    logout,
    updateUserInfo,
  };

  if (loading) {
    return <div>Đang tải...</div>; // Hoặc loading component
  }

  return (
    <CustomerAuthContext.Provider value={authContextValue}>
      {children}
    </CustomerAuthContext.Provider>
  );
};

export default CustomerAuthContext;
