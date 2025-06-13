import React, { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  message,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axios";
import { SuccessNotification } from "../../../components";

const { Title, Text } = Typography;

const CustomerRegister = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const onFinish = async (values) => {
    try {
      setError("");
      setLoading(true);

      // Debug: Log dữ liệu form nhận được
      console.log("Form values received:", values); // Chuẩn bị dữ liệu gửi lên server
      const requestData = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword, // Thêm confirmPassword nếu backend yêu cầu
        phone: values.phone,
      };

      // Debug: Log dữ liệu sẽ gửi lên server
      console.log("Data to send to server:", requestData); // Gọi API đăng ký
      await axiosInstance.post("/auth/customer/register", requestData);

      // Hiển thị thông báo thành công đẹp
      setShowSuccess(true);

      // Thông báo Ant Design backup
      message.success({
        content: "🎉 Đăng ký tài khoản thành công!",
        duration: 2,
        style: {
          marginTop: "20vh",
        },
      });

      // Đợi 3 giây để người dùng thấy animation
      setTimeout(() => {
        setShowSuccess(false);
        // Chuyển đến trang đăng nhập với thông báo
        navigate("/dang-nhap", {
          state: {
            message:
              "Đăng ký thành công! Vui lòng đăng nhập để trải nghiệm dịch vụ.",
            type: "success",
          },
        });
      }, 3000);
    } catch (err) {
      setError(err?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
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
              Đăng ký tài khoản
            </Title>
            <Text type="secondary">
              Tạo tài khoản để trải nghiệm dịch vụ của chúng tôi
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: "Vui lòng nhập họ tên" },
                { min: 2, message: "Họ tên phải có ít nhất 2 ký tự" },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "#FFB6C1" }} />}
                placeholder="Họ và tên"
                size="large"
              />
            </Form.Item>

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
            </Form.Item>

            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Số điện thoại không hợp lệ",
                },
              ]}
            >
              <Input
                prefix={<PhoneOutlined style={{ color: "#FFB6C1" }} />}
                placeholder="Số điện thoại"
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

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject("Mật khẩu xác nhận không khớp");
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "#FFB6C1" }} />}
                placeholder="Xác nhận mật khẩu"
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
                Đăng ký
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ borderColor: "#FFD1DC" }}>
            <Text type="secondary">Hoặc</Text>
          </Divider>

          <div style={{ textAlign: "center" }}>
            <Text type="secondary">Đã có tài khoản? </Text>
            <Link to="/dang-nhap" style={{ color: "#FF99AC" }}>
              Đăng nhập ngay
            </Link>{" "}
          </div>
        </Space>
      </Card>

      {/* Success Notification */}
      {showSuccess && (
        <SuccessNotification
          message="🎉 Đăng ký tài khoản thành công!"
          description="Chuẩn bị chuyển đến trang đăng nhập..."
        />
      )}
    </div>
  );
};

export default CustomerRegister;
