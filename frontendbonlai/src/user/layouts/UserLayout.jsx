import React, { useState } from "react";
import { Layout, Row, Col } from "antd";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import ChatButton from "../../components/chat/ChatButton";
import ChatWindow from "../../components/chat/ChatWindow";

const { Content } = Layout;

const UserLayout = ({ children }) => {
  const [chatOpen, setChatOpen] = useState(false);

  const handleChatOpen = () => {
    setChatOpen(true);
  };

  const handleChatClose = () => {
    setChatOpen(false);
  };

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#FFF0F5",
        display: "flex",
        flexDirection: "column",
        paddingTop: "120px", // Thêm padding để tránh bị che bởi fixed header
      }}
    >
      <Header />
      <Content
        style={{
          flex: 1,
          padding: { xs: "16px", sm: "24px 50px" },
          backgroundImage:
            "radial-gradient(circle at 50% 50%, #FFF5F7 0%, #FFF0F5 100%)",
        }}
      >
        <Row gutter={[24, 24]}>
          {/* Sidebar */}
          <Col xs={24} lg={6}>
            <div
              style={{
                position: "sticky",
                top: "84px",
                maxHeight: "calc(100vh - 100px)",
                overflowY: "auto",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(255, 182, 193, 0.15)",
                background: "#FFFFFF",
                transition: "all 0.3s ease",
              }}
            >
              <Sidebar />
            </div>
          </Col>
          {/* Main content */}
          <Col xs={24} lg={18}>
            <div
              style={{
                background: "#FFFFFF",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(255, 182, 193, 0.15)",
                padding: "24px",
                minHeight: "500px",
                transition: "all 0.3s ease",
              }}
            >
              {children}
            </div>
          </Col>
        </Row>
      </Content>
      <Footer />
      
      {/* Chat Feature */}
      <ChatButton onClick={handleChatOpen} />
      <ChatWindow open={chatOpen} onClose={handleChatClose} />
    </Layout>
  );
};

export default UserLayout;
