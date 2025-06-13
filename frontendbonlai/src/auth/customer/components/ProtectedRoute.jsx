import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";
import { useCustomerAuth } from "../context/CustomerAuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useCustomerAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#FFF0F5",
        }}
      >
        <Spin size="large" style={{ color: "#FFB6C1" }} />
      </div>
    );
  }

  if (!isLoggedIn) {
    // Lưu lại URL hiện tại để sau khi đăng nhập có thể redirect lại
    return <Navigate to="/dang-nhap" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
