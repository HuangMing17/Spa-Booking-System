import { Layout, Menu, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  CalendarOutlined,
  UserOutlined,
  ShoppingOutlined,
  SettingOutlined,
  TeamOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const { Text } = Typography;

const AdminSidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
      onClick: () => navigate("/admin/dashboard"),
    },
    {
      key: "appointments",
      icon: <CalendarOutlined />,
      label: "Quản lý lịch hẹn",
      children: [
        {
          key: "appointments-list",
          label: "Tất cả lịch hẹn",
          onClick: () => navigate("/admin/orders"),
        },
        {
          key: "appointments-new",
          label: "Tạo lịch hẹn mới",
          onClick: () => navigate("/admin/orders/create"),
        },
      ],
    },
    {
      key: "services",
      icon: <ShoppingOutlined />,
      label: "Dịch vụ",
      children: [
        {
          key: "services-list",
          label: "Danh sách dịch vụ",
          onClick: () => navigate("/admin/services"),
        },
        {
          key: "services-categories",
          label: "Danh mục",
          onClick: () => navigate("/admin/services/categories"),
        },
      ],
    },
    {
      key: "customers",
      icon: <UserOutlined />,
      label: "Khách hàng",
      onClick: () => navigate("/admin/customers"),
    },
    {
      key: "reports",
      icon: <FileTextOutlined />,
      label: "Báo cáo",
      children: [
        {
          key: "reports-revenue",
          label: "Doanh thu",
          onClick: () => navigate("/admin/reports/revenue"),
        },
        {
          key: "reports-services",
          label: "Dịch vụ",
          onClick: () => navigate("/admin/reports/services"),
        },
      ],
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      onClick: () => navigate("/admin/settings"),
    },
  ];
  // Get the current selected key based on path
  const getSelectedKey = () => {
    const path = location.pathname;
    const pathParts = path.split("/");
    const mainPath = pathParts[2] || "dashboard";

    // For services routes
    if (mainPath === "services") {
      // For categories page
      if (pathParts[3] === "categories") {
        return "services-categories";
      }
      // For list, create, edit, view service pages
      return "services-list";
    }    // For customers routes
    if (mainPath === "customers") {
      return "customers";
    }

    // For orders/appointments routes
    if (mainPath === "orders") {
      // For create page
      if (pathParts[3] === "create") {
        return "appointments-new";
      }
      // For list, edit, view appointment pages
      return "appointments-list";
    }

    // For dat-lich (legacy booking route)
    if (mainPath === "dat-lich") {
      return "appointments-list";
    }

    return mainPath;
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      style={{
        background: "#FFFFFF",
        height: "100vh",
        position: "fixed",
        left: 0,
        boxShadow:
          "0 1px 2px rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)",
        zIndex: 999,
        overflow: "auto",
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: 64,
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          borderBottom: "1px solid #F3F4F6",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "8px",
            background: "#6366F1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: collapsed ? 0 : 12,
          }}
        >
          <AppstoreOutlined style={{ color: "#FFFFFF", fontSize: 18 }} />
        </div>
        {!collapsed && (
          <Text strong style={{ fontSize: 18, color: "#111827" }}>
            SPA Admin
          </Text>
        )}
      </div>

      {/* Menu */}
      <Menu
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        style={{
          border: "none",
          padding: "8px",
        }}
        items={menuItems}
        theme="light"
      />
    </Sider>
  );
};

export default AdminSidebar;
