import { Layout } from "antd";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatButton from "../../components/chat/ChatButton";

const { Content } = Layout;

const BookingLayout = ({ children, isHomePage = false }) => {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: isHomePage ? "#FFF" : "#FFF0F5",
        display: "flex",
        flexDirection: "column",
        paddingTop: "120px", // Đảm bảo không bị che bởi fixed header
      }}
    >
      <Header />
      <Content
        style={{
          flex: 1,
          padding: isHomePage ? "0" : "24px 50px",
          backgroundImage: isHomePage
            ? "none"
            : "radial-gradient(circle at 50% 50%, #FFF5F7 0%, #FFF0F5 100%)",
        }}
      >
        {isHomePage ? (
          // Full-width layout for Home page
          children
        ) : (
          // Regular layout for other pages
          <div
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              background: "#FFFFFF",
              borderRadius: "16px",
              boxShadow: "0 4px 20px rgba(255, 182, 193, 0.15)",
              padding: "32px",
              minHeight: "500px",
              transition: "all 0.3s ease",
            }}
          >
            {children}
          </div>
        )}
      </Content>
      <Footer />
      {/* Chat Feature */}
      <ChatButton />
    </Layout>
  );
};

export default BookingLayout;
