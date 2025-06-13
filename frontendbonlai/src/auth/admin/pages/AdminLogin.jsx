import React, { useState } from "react";
import { Card, Form, Input, Button, Typography, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useLocation } from "react-router-dom";

const { Title, Text } = Typography;

const AdminLogin = () => {
  const [form] = Form.useForm();
  const { login, loading } = useAdminAuth();
  const [error, setError] = useState("");
  const location = useLocation();
  const onFinish = async (values) => {
    try {
      setError("");
      // Truyền thông tin chuyển hướng vào hàm login
      const redirectPath = location.state?.from || "/admin/dashboard";
      await login(values.username, values.password, redirectPath);
    } catch (err) {
      setError("Tên đăng nhập hoặc mật khẩu không chính xác");
    }
  };

  return (
    <div
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
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div style={{ textAlign: "center" }}>
            <Title level={2} style={{ color: "#4A4A4A", marginBottom: 8 }}>
              Đăng nhập Admin
            </Title>
            <Text type="secondary">Đăng nhập để quản lý hệ thống</Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Vui lòng nhập tên đăng nhập" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#FFB6C1" }} />}
                placeholder="Tên đăng nhập"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
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
            )}

            <Form.Item>
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
                }}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default AdminLogin;
