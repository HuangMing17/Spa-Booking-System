import React from "react";
import {
  Card,
  Typography,
  Space,
  Avatar,
  Row,
  Col,
  Divider,
  Tag,
  Spin,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useCustomerAuth } from "../../auth/customer/context/CustomerAuthContext";

const { Title, Text } = Typography;

const Profile = () => {
  const { user } = useCustomerAuth();

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải thông tin người dùng...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "24px 0" }}>
      <Card
        style={{
          borderColor: "#FFD1DC",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(255, 182, 193, 0.15)",
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Title level={2} style={{ marginBottom: 8, color: "#ff69b4" }}>
            Thông tin tài khoản
          </Title>
          <Text type="secondary">
            Thông tin cá nhân của bạn
          </Text>
        </div>

        {/* Avatar Section */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Space direction="vertical" align="center" size="large">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={user?.avatar}
              style={{
                backgroundColor: "#FFB6C1",
                color: "#fff",
                fontSize: "48px",
                border: "4px solid #fff",
                boxShadow: "0 4px 12px rgba(255, 182, 193, 0.3)",
              }}
            />
            <div>
              <Title level={3} style={{ marginBottom: 4, color: "#333" }}>
                {user?.fullName || user?.name || "Chưa có tên"}
              </Title>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                Khách hàng thân thiết
              </Text>
            </div>
          </Space>
        </div>

        <Divider />

        {/* Information Cards */}
        <Row gutter={[16, 16]}>
          {/* Personal Information */}
          <Col xs={24} md={12}>
            <Card
              size="small"
              title={
                <Space>
                  <UserOutlined style={{ color: "#ff69b4" }} />
                  <Text strong>Thông tin cá nhân</Text>
                </Space>
              }
              style={{
                backgroundColor: "#fef7f7",
                border: "1px solid #ffcccb",
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    Họ và tên
                  </Text>
                  <Text strong style={{ fontSize: "16px" }}>
                    {user?.fullName || user?.name || "Chưa cập nhật"}
                  </Text>
                </div>
                
                <Divider style={{ margin: "8px 0" }} />
                
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <PhoneOutlined /> Số điện thoại
                  </Text>
                  <Text strong style={{ fontSize: "16px" }}>
                    {user?.phone || "Chưa cập nhật"}
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} md={12}>
            <Card
              size="small"
              title={
                <Space>
                  <MailOutlined style={{ color: "#ff69b4" }} />
                  <Text strong>Thông tin liên hệ</Text>
                </Space>
              }
              style={{
                backgroundColor: "#f0f9ff",
                border: "1px solid #bae6fd",
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    Email đăng nhập
                  </Text>
                  <Text strong style={{ fontSize: "16px", wordBreak: "break-all" }}>
                    {user?.email || "Chưa cập nhật"}
                  </Text>
                </div>
                
                <Divider style={{ margin: "8px 0" }} />
                
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    Trạng thái tài khoản
                  </Text>
                  <Tag color="green" style={{ fontSize: "14px" }}>
                    Đang hoạt động
                  </Tag>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* Additional Information */}
        <div style={{ marginTop: 24 }}>
          <Card
            size="small"
            title={
              <Space>
                <InfoCircleOutlined style={{ color: "#ff69b4" }} />
                <Text strong>Thông tin bổ sung</Text>
              </Space>
            }
            style={{
              backgroundColor: "#f6ffed",
              border: "1px solid #b7eb8f",
            }}
          >
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={12}>
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    <CalendarOutlined /> Ngày tham gia
                  </Text>
                  <Text strong>
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('vi-VN')
                      : "Không xác định"
                    }
                  </Text>
                </div>
              </Col>
              
              <Col xs={24} sm={12}>
                <div>
                  <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                    ID tài khoản
                  </Text>
                  <Text strong style={{ fontFamily: "monospace", fontSize: "12px" }}>
                    {user?.id?.slice(-8) || "N/A"}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Footer Note */}
        <Divider />
        <div style={{ textAlign: "center" }}>
          <Space direction="vertical" size="small">
            <Text type="secondary" style={{ fontSize: "14px" }}>
              💼 Để cập nhật thông tin cá nhân, vui lòng liên hệ bộ phận chăm sóc khách hàng
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              📞 Hotline: 1900-xxxx | 📧 Email: support@bonlai.com
            </Text>
            <Text type="secondary" style={{ fontSize: "11px", color: "#999" }}>
              Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích dịch vụ
            </Text>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
