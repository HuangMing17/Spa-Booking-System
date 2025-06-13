import { useState } from "react";
import { Layout, ConfigProvider } from "antd";
import AdminHeader from "../../auth/admin/components/AdminHeader";
import AdminSidebar from "../../auth/admin/components/AdminSidebar";

const { Content } = Layout;

const AdminLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Tùy chỉnh theme cho toàn bộ ứng dụng
  const theme = {
    token: {
      colorPrimary: "#6366F1",
      colorSuccess: "#10B981",
      colorWarning: "#F59E0B",
      colorError: "#EF4444",
      colorInfo: "#3B82F6",
      borderRadius: 6,
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <Layout style={{ minHeight: "100vh" }}>
        <AdminSidebar collapsed={collapsed} />
        <Layout
          style={{
            marginLeft: collapsed ? 80 : 250,
            transition: "all 0.2s",
            background: "#F9FAFB",
          }}
        >
          <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content
            style={{
              margin: "24px",
              minHeight: "calc(100vh - 112px)",
              overflow: "initial",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default AdminLayout;
