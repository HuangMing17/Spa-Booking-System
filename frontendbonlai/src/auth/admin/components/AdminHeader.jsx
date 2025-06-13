"use client";
import {
  Layout,
  Button,
  Space,
  Avatar,
  Dropdown,
  Typography,
  Badge,
} from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useAdminAuth } from "../context/AdminAuthContext";

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader = ({ collapsed, setCollapsed }) => {
  const { admin, logout } = useAdminAuth();

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Thông tin cá nhân",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
      onClick: logout,
    },
  ];

  const notificationItems = [
    {
      key: "1",
      label: (
        <div>
          <Text strong>Đơn đặt lịch mới</Text>
          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Khách hàng: Nguyễn Văn A
            </Text>
          </div>
        </div>
      ),
      onClick: () => console.log("View notification"),
    },
    {
      key: "2",
      label: (
        <div>
          <Text strong>Nhắc nhở lịch hẹn</Text>
          <div>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              15:00 - Massage toàn thân
            </Text>
          </div>
        </div>
      ),
      onClick: () => console.log("View reminder"),
    },
  ];

  return (
    <Header
      style={{
        padding: "0 24px",
        background: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow:
          "0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        height: 64,
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left side - Toggle button and search */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            fontSize: "16px",
            width: 48,
            height: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6366F1",
          }}
        />

        <div
          className="search-container"
          style={{ marginLeft: 16, display: "flex", alignItems: "center" }}
        >
          <SearchOutlined style={{ color: "#9CA3AF", marginRight: 8 }} />
          <input
            placeholder="Tìm kiếm..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              width: 180,
            }}
          />
        </div>
      </div>

      {/* Right side - User info & actions */}
      <Space size="large">
        {/* Notifications */}
        <Dropdown
          menu={{ items: notificationItems }}
          placement="bottomRight"
          arrow
          trigger={["click"]}
        >
          <Badge count={2} size="small" offset={[-2, 2]}>
            <Button
              type="text"
              icon={
                <BellOutlined style={{ fontSize: "18px", color: "#6B7280" }} />
              }
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "#F3F4F6",
              }}
            />
          </Badge>
        </Dropdown>

        {/* User menu */}
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
          trigger={["click"]}
        >
          <Space style={{ cursor: "pointer" }}>
            <Avatar
              style={{
                backgroundColor: "#6366F1",
                color: "#fff",
              }}
              icon={<UserOutlined />}
            />
            <div style={{ maxWidth: 120 }}>
              <Text
                strong
                style={{
                  display: "block",
                  lineHeight: "1.2",
                  color: "#111827",
                }}
              >
                {admin?.fullName || "Admin User"}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Quản trị viên
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;
