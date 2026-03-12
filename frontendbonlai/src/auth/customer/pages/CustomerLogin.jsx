import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  Alert,
} from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookFilled } from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../context/CustomerAuthContext";

const { Title, Text } = Typography;

const CustomerLogin = () => {
  const [form] = Form.useForm();
  const { login, firebaseLogin, facebookLogin, loading } = useCustomerAuth();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const location = useLocation();

  // Kiểm tra thông báo từ trang đăng ký
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Xóa thông báo sau 5 giây
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    }
  }, [location]);

  const onFinish = async (values) => {
    try {
      setError("");
      console.log("Login attempt with:", { email: values.email }); // Debug log

      // Truyền thông tin chuyển hướng vào hàm login
      const redirectPath = location.state?.from || "/";
      await login(values.email, values.password, redirectPath);
    } catch (err) {
      console.error("Login error:", err); // Debug log
      setError(err.message || "Email hoặc mật khẩu không chính xác");
    }
  };

  // Xử lý đăng nhập với Google
  const handleGoogleLogin = async () => {
    try {
      setError("");
      const redirectPath = location.state?.from || "/";
      await firebaseLogin(redirectPath);
    } catch (err) {
      console.error("Google login error:", err);
      // Error đã được xử lý trong firebaseLogin function
    }
  };

  // Xử lý đăng nhập với Facebook
  const handleFacebookLogin = async () => {
    try {
      setError("");
      const redirectPath = location.state?.from || "/";
      await facebookLogin(redirectPath);
    } catch (err) {
      console.error("Facebook login error:", err);
    }
  };

  return (<div
    style={{
      minHeight: "100vh",
      background: "#FFF0F5",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    }}
  >
    <Card
      style={{
        maxWidth: 400,
        width: "100%",
        borderRadius: 12,
        borderColor: "#FFD1DC",
        boxShadow: "0 4px 12px rgba(255, 182, 193, 0.15)",
        padding: "8px",
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}><div style={{ textAlign: "center", marginBottom: "16px" }}>
        <Title level={2} style={{ color: "#4A4A4A", margin: "0 0 8px" }}>
          Đăng nhập
        </Title>
        <Text type="secondary">
          Chào mừng bạn đến với SPA của chúng tôi
        </Text>
      </div>

        {/* Hiển thị thông báo thành công từ đăng ký */}
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            closable
            onClose={() => setSuccessMessage("")}
            style={{
              borderRadius: 8,
              border: "1px solid #b7eb8f",
              backgroundColor: "#f6ffed",
            }}
          />
        )}          <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
          style={{ marginTop: "8px" }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#FFB6C1" }} />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>            <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
            style={{ marginBottom: "16px" }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#FFB6C1" }} />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          {error && (
            <Text
              type="danger"
              style={{ display: "block", marginBottom: 16 }}
            >
              {error}
            </Text>
          )}            <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{
                height: 45,
                fontSize: 16,
                fontWeight: 500,
                marginBottom: 12,
              }}
            >
              Đăng nhập
            </Button>
            {/* Google Sign-in Button */}
            <Button
              icon={<GoogleOutlined />}
              size="large"
              block
              loading={loading}
              onClick={handleGoogleLogin}
              style={{
                height: 45,
                fontSize: 16,
                fontWeight: 500,
                backgroundColor: "#fff",
                borderColor: "#FFD1DC",
                color: "#4285f4",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Đăng nhập với Google
            </Button>
            {/* Facebook Sign-in Button */}
            <Button
              icon={<FacebookFilled />}
              size="large"
              block
              loading={loading}
              onClick={handleFacebookLogin}
              style={{
                height: 45,
                fontSize: 16,
                fontWeight: 500,
                backgroundColor: "#1877F2",
                borderColor: "#1877F2",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: 8,
              }}
            >
              Đăng nhập với Facebook
            </Button>
          </Form.Item>
        </Form>          <div style={{ textAlign: "center", marginTop: "4px" }}>
          <Link to="/quen-mat-khau" style={{ color: "#FF99AC" }}>
            Quên mật khẩu?
          </Link>
        </div>

        <Divider style={{ borderColor: "#FFD1DC", margin: "20px 0" }}>
          <Text type="secondary">Hoặc</Text>
        </Divider>

        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <Text type="secondary">Chưa có tài khoản? </Text>
          <Link to="/dang-ky" style={{ color: "#FF99AC" }}>
            Đăng ký ngay
          </Link>
        </div>
      </Space>
    </Card>
  </div>
  );
};

export default CustomerLogin;
