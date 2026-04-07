"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  Button,
  Space,
  Input,
  Drawer,
  Dropdown,
  Avatar,
  Badge,
  Row,
  Col,
  Typography,
  AutoComplete,
  Divider,
} from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  MenuOutlined,
  SearchOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  LogoutOutlined,
  CalendarOutlined,
  HistoryOutlined,
  BellOutlined,
  CloseOutlined,
  HeartOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  StarOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useCustomerAuth } from "../../auth/customer/context/CustomerAuthContext";

const { Text, Title } = Typography;
const TOP_BAR_HEIGHT = 42; // Chiều cao cố định của TopBar

const Header = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const { isLoggedIn, user, logout } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Mock search suggestions - có thể thay thế bằng API thực
  const searchSuggestions = [
    "Massage thư giãn",
    "Chăm sóc da mặt",
    "Làm móng tay",
    "Tắm trắng",
    "Triệt lông",
    "Massage body",
    "Facial",
    "Spa therapy",
  ];
  const handleSearch = useCallback((value) => {
    if (value) {
      const filteredOptions = searchSuggestions
        .filter((item) => item.toLowerCase().includes(value.toLowerCase()))
        .map((item) => ({ value: item, label: item }));
      setSearchOptions(filteredOptions);
    } else {
      setSearchOptions([]);
    }
  }, []);

  const onSearchSelect = (value) => {
    setSearchValue(value);
    navigate(`/dich-vu?search=${encodeURIComponent(value)}`);
    setSearchVisible(false);
  }; // Menu items configuration
  const menuItems = [
    {
      key: "home",
      label: "Trang chủ",
      link: "/",
      icon: <GlobalOutlined />,
    },
    {
      key: "services",
      label: "Dịch vụ",
      link: "/dich-vu",
      icon: <StarOutlined />,
    },
    {
      key: "about",
      label: "Giới thiệu",
      link: "/gioi-thieu",
      icon: <EnvironmentOutlined />,
    },
    {
      key: "contact",
      label: "Liên hệ",
      link: "/lien-he",
      icon: <PhoneOutlined />,
    },
  ];
  const userMenuItems = [
    {
      key: "profile",
      label: (
        <Space>
          <UserOutlined />
          <span>Thông tin cá nhân</span>
        </Space>
      ),
      onClick: () => navigate("/thong-tin-ca-nhan"),
    },
    {
      key: "bookings",
      label: (
        <Space>
          <CalendarOutlined />
          <span>Lịch hẹn của tôi</span>
        </Space>
      ),
      onClick: () => navigate("/lich-hen"),
    },

    { type: "divider" },
    {
      key: "logout",
      label: (
        <Space style={{ color: "#ff4d4f" }}>
          <LogoutOutlined />
          <span>Đăng xuất</span>
        </Space>
      ),
      onClick: logout,
      danger: true,
    },
  ];

  // Top bar component
  const TopBar = () => (
    <div
      style={{
        background: "linear-gradient(135deg, #FF99AC 0%, #FFB6C1 100%)",
        color: "white",
        padding: "8px 0",
        fontSize: "13px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        height: `${TOP_BAR_HEIGHT}px`,
        zIndex: 1001,
        borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: scrolled ? `translateY(-${TOP_BAR_HEIGHT}px)` : "translateY(0)",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 50px" }}>
        <Row justify="space-between" align="middle">
          <Col xs={0} md={14}>
            <Space size={32}>
              <Space size={8} align="center">
                <PhoneOutlined style={{ fontSize: "14px" }} />
                <span style={{ fontWeight: "500" }}>
                  Hotline: (028) 123-4567
                </span>
              </Space>
              <Space size={8} align="center">
                <MailOutlined style={{ fontSize: "14px" }} />
                <span style={{ fontWeight: "500" }}>spa@beautycare.vn</span>
              </Space>
              <Space size={8} align="center">
                <EnvironmentOutlined style={{ fontSize: "14px" }} />
                <span style={{ fontWeight: "500" }}>
                  123 Đường ABC, Q.1, TP.HCM
                </span>
              </Space>
            </Space>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: "right" }}>
            <Space size={12} align="center">
              <span style={{ fontSize: "12px", opacity: 0.9 }}>
                Theo dõi chúng tôi:
              </span>
              <Button
                type="text"
                icon={<FacebookOutlined />}
                style={{
                  color: "#FFFFFF",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                }}
                className="social-btn"
              />
              <Button
                type="text"
                icon={<InstagramOutlined />}
                style={{
                  color: "#FFFFFF",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                }}
                className="social-btn"
              />
              <Button
                type="text"
                icon={<TwitterOutlined />}
                style={{
                  color: "#FFFFFF",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                }}
                className="social-btn"
              />
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
  // Mobile menu component
  const MobileMenu = () => (
    <Drawer
      title={
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Space align="center">
            <div
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                fontFamily: '"Great Vibes", cursive',
                background: "linear-gradient(135deg, #FF99AC, #FFB6C1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              God Spa Central
            </div>
          </Space>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setMobileMenuVisible(false)}
            style={{ color: "#FF99AC" }}
          />
        </div>
      }
      placement="right"
      onClose={() => setMobileMenuVisible(false)}
      open={mobileMenuVisible}
      width={320}
      style={{
        background: "linear-gradient(180deg, #FFF0F5 0%, #FFFFFF 100%)",
      }}
      headerStyle={{
        borderBottom: "2px solid #FFD1DC",
        background: "#FFFFFF",
        padding: "16px 24px",
      }}
      bodyStyle={{ padding: "20px" }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {/* Search Section */}
        <div style={{ marginBottom: "24px" }}>
          <AutoComplete
            placeholder="Tìm kiếm dịch vụ..."
            options={searchOptions}
            onSearch={handleSearch}
            onSelect={onSearchSelect}
            style={{ width: "100%" }}
          >
            <Input
              prefix={<SearchOutlined style={{ color: "#FFB6C1" }} />}
              style={{
                borderRadius: "8px",
                height: "42px",
                border: "1px solid #FFD1DC",
              }}
            />
          </AutoComplete>
        </div>

        {/* Navigation Menu */}
        <div style={{ flex: 1 }}>
          <Menu
            items={menuItems.map((item) => ({
              key: item.key,
              label: (
                <Space>
                  {item.icon}
                  <span>{item.label}</span>
                </Space>
              ),
              onClick: () => {
                navigate(item.link);
                setMobileMenuVisible(false);
              },
              style: {
                margin: "4px 0",
                borderRadius: "8px",
                color: location.pathname === item.link ? "#FF99AC" : "#4A4A4A",
                fontWeight: location.pathname === item.link ? "600" : "normal",
                background:
                  location.pathname === item.link
                    ? "rgba(255, 153, 172, 0.1)"
                    : "transparent",
              },
            }))}
            mode="vertical"
            style={{
              background: "transparent",
              border: "none",
            }}
          />
        </div>

        <Divider style={{ borderColor: "#FFD1DC", margin: "20px 0" }} />

        {/* User Section */}
        <div>
          {isLoggedIn ? (
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #FFE6EE 0%, #FFF0F5 100%)",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #FFD1DC",
                }}
              >
                <Space align="center" style={{ width: "100%" }}>
                  <Avatar
                    size={48}
                    style={{
                      background: "linear-gradient(135deg, #FF99AC, #FFB6C1)",
                      color: "#fff",
                      fontSize: "18px",
                    }}
                    icon={<UserOutlined />}
                  />
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ display: "block", color: "#4A4A4A" }}>
                      {user?.fullName || "Khách hàng"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {user?.email}
                    </Text>
                  </div>
                </Space>
              </div>

              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Button
                  block
                  icon={<CalendarOutlined />}
                  onClick={() => {
                    navigate("/lich-hen");
                    setMobileMenuVisible(false);
                  }}
                  style={{
                    height: "44px",
                    borderColor: "#FFB6C1",
                    color: "#FF99AC",
                    borderRadius: "8px",
                    fontWeight: "500",
                  }}
                >
                  Lịch hẹn của tôi
                </Button>

                <Button
                  block
                  type="primary"
                  danger
                  icon={<LogoutOutlined />}
                  onClick={() => {
                    logout();
                    setMobileMenuVisible(false);
                  }}
                  style={{
                    height: "44px",
                    borderRadius: "8px",
                    fontWeight: "500",
                  }}
                >
                  Đăng xuất
                </Button>
              </Space>
            </Space>
          ) : (
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <Button
                block
                type="primary"
                size="large"
                onClick={() => {
                  navigate("/dang-nhap");
                  setMobileMenuVisible(false);
                }}
                style={{
                  background: "linear-gradient(135deg, #FF99AC, #FFB6C1)",
                  borderColor: "transparent",
                  borderRadius: "8px",
                  height: "44px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(255, 153, 172, 0.3)",
                }}
              >
                <UserOutlined /> Đăng nhập
              </Button>

              <Button
                block
                size="large"
                onClick={() => {
                  navigate("/dang-ky");
                  setMobileMenuVisible(false);
                }}
                style={{
                  borderColor: "#FFB6C1",
                  color: "#FF99AC",
                  borderRadius: "8px",
                  height: "44px",
                  fontWeight: "500",
                }}
              >
                Đăng ký tài khoản
              </Button>
            </Space>
          )}
        </div>
      </div>
    </Drawer>
  );
  // Search overlay component
  const SearchOverlay = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(10px)",
        zIndex: 1001,
        display: searchVisible ? "flex" : "none",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 20px",
      }}
    >
      <Button
        type="text"
        icon={<CloseOutlined />}
        onClick={() => setSearchVisible(false)}
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          fontSize: "20px",
          color: "#FF99AC",
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "rgba(255, 153, 172, 0.1)",
        }}
      />
      <div style={{ width: "100%", maxWidth: "700px", textAlign: "center" }}>
        <div style={{ marginBottom: "40px" }}>
          <Title
            level={2}
            style={{
              color: "#4A4A4A",
              marginBottom: "12px",
              fontSize: "32px",
              fontWeight: "600",
            }}
          >
            Tìm Kiếm Dịch Vụ
          </Title>
          <Text
            type="secondary"
            style={{
              fontSize: "16px",
              color: "#666666",
            }}
          >
            Khám phá các dịch vụ spa và làm đẹp tuyệt vời
          </Text>
        </div>

        <AutoComplete
          value={searchValue}
          options={searchOptions}
          onSearch={handleSearch}
          onSelect={onSearchSelect}
          onChange={setSearchValue}
          style={{ width: "100%", marginBottom: "24px" }}
        >
          <Input
            size="large"
            placeholder="Nhập tên dịch vụ bạn muốn tìm..."
            prefix={
              <SearchOutlined style={{ color: "#FFB6C1", fontSize: "18px" }} />
            }
            style={{
              height: "60px",
              borderRadius: "12px",
              border: "2px solid #FFD1DC",
              fontSize: "16px",
              boxShadow: "0 4px 20px rgba(255, 182, 193, 0.2)",
            }}
            autoFocus
            onPressEnter={(e) => onSearchSelect(e.target.value)}
          />
        </AutoComplete>

        <div style={{ marginTop: "24px" }}>
          <Text
            type="secondary"
            style={{ fontSize: "14px", marginBottom: "16px", display: "block" }}
          >
            Gợi ý tìm kiếm phổ biến:
          </Text>
          <Space wrap>
            {[
              "Massage thư giãn",
              "Chăm sóc da mặt",
              "Làm móng tay",
              "Tắm trắng",
            ].map((tag) => (
              <Button
                key={tag}
                size="small"
                style={{
                  borderColor: "#FFB6C1",
                  color: "#FF99AC",
                  borderRadius: "20px",
                  height: "32px",
                  padding: "0 16px",
                }}
                onClick={() => onSearchSelect(tag)}
              >
                {tag}
              </Button>
            ))}
          </Space>
        </div>
      </div>{" "}
    </div>
  );

  // Main render
  return (
    <>
      <TopBar />{" "}
      <div
        style={{
          background: "#fff",
          position: "fixed",
          top: scrolled ? 0 : `${TOP_BAR_HEIGHT}px`, // Use the constant here
          left: 0,
          right: 0,
          width: "100%",
          zIndex: 1000,
          boxShadow: scrolled
            ? "0 4px 20px rgba(255, 182, 193, 0.15)"
            : "0 1px 0 rgba(255, 209, 220, 0.3)",
          borderBottom: scrolled ? "none" : "1px solid #FFE6EE",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 50px" }}
        >
          <Row
            justify="space-between"
            align="middle"
            style={{
              padding: scrolled ? "12px 0" : "16px 0",
              transition: "padding 0.3s ease",
            }}
          >
            {/* Logo Section */}
            <Col flex="none">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                   <div style={{
                      fontSize: "36px",
                      fontWeight: "700",
                      fontFamily: '"Great Vibes", cursive',
                      background: "linear-gradient(135deg, #FF99AC, #FFB6C1)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      lineHeight: "1.2",
                      letterSpacing: "1px",
                      textShadow: "0 2px 4px rgba(255, 153, 172, 0.1)"
                    }}>
                      God Spa
                    </div>
                </div>
              </Link>
            </Col>

            {/* Navigation and Actions */}
            <Col flex="auto">
              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                {/* Desktop and Mobile Navigation together for simplicity */}
                <Menu
                  mode="horizontal"
                  selectedKeys={[
                    menuItems.find((item) => location.pathname === item.link)
                      ?.key || "",
                  ]}
                  items={menuItems.map((item) => ({
                    key: item.key,
                    label: (
                      <Link to={item.link} style={{ fontSize: "15px", fontWeight: "600" }}>
                        {item.label}
                      </Link>
                    ),
                  }))}
                  style={{
                    border: "none",
                    background: "transparent",
                    marginRight: "40px",
                    minWidth: "400px",
                    display: { xs: "none", lg: "flex" }
                  }}
                  overflowedIndicator={null}
                />

                <Space size="large" align="center">
                  {/* Search Button */}
                  <Button
                    type="text"
                    icon={<SearchOutlined style={{ color: "#FF99AC", fontSize: "20px" }} />}
                    onClick={() => setSearchVisible(true)}
                    className="header-action-btn"
                    style={{ borderRadius: "50%", width: "44px", height: "44px" }}
                  />

                  {/* Notifications */}
                  {isLoggedIn && (
                    <Badge count={2} size="small" offset={[-2, 6]} style={{ backgroundColor: "#FF99AC" }}>
                      <Button
                        type="text"
                        icon={<BellOutlined style={{ color: "#FF99AC", fontSize: "20px" }} />}
                        className="header-action-btn"
                        style={{ borderRadius: "50%", width: "44px", height: "44px" }}
                        onClick={() => navigate("/thong-bao")}
                      />
                    </Badge>
                  )}

                  {/* Booking Button */}
                  <Button
                    type="primary"
                    icon={<CalendarOutlined />}
                    onClick={() => navigate("/dat-lich")}
                    className="book-btn"
                    style={{
                      background: "linear-gradient(135deg, #FF99AC, #FFB6C1)",
                      borderColor: "transparent",
                      borderRadius: "12px",
                      height: "44px",
                      padding: "0 24px",
                      fontWeight: "700",
                      boxShadow: "0 6px 15px rgba(255, 153, 172, 0.3)"
                    }}
                  >
                    <span style={{ display: { xs: "none", sm: "inline" } }}>Đặt lịch ngay</span>
                  </Button>

                  {isLoggedIn && (
                    <Button
                      type="default"
                      icon={<HistoryOutlined />}
                      onClick={() => navigate("/lich-hen")}
                      className="booking-history-btn"
                      style={{
                        borderColor: "#FFB6C1",
                        color: "#FF99AC",
                        borderRadius: "12px",
                        height: "44px",
                        padding: "0 20px",
                        fontWeight: "600",
                        background: "#FFF5F7",
                      }}
                    >
                      <span style={{ display: { xs: "none", md: "inline" } }}>
                        Lịch hẹn của tôi
                      </span>
                    </Button>
                  )}

                  {/* User Profile / Login */}
                  {isLoggedIn ? (
                    <Button
                      type="text"
                      className="user-profile-btn"
                      onClick={() => navigate("/thong-tin-ca-nhan")}
                      style={{
                        height: "44px",
                        padding: "0 8px",
                        borderRadius: "12px",
                        background: "rgba(255, 240, 245, 0.6)",
                        border: "1px solid #FFD1DC"
                      }}
                    >
                      <Space size={8}>
                        <Avatar
                          size={32}
                          style={{ background: "linear-gradient(135deg, #FFB6C1, #FF99AC)" }}
                          icon={<UserOutlined />}
                        />
                        <span style={{ fontWeight: "600", color: "#4A4A4A" }}>
                          {user?.fullName?.split(' ')[0] || "User"}
                        </span>
                      </Space>
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      ghost
                      className="login-btn"
                      onClick={() => navigate("/dang-nhap")}
                      style={{
                        borderColor: "#FFB6C1",
                        color: "#FF99AC",
                        borderRadius: "12px",
                        height: "44px",
                        fontWeight: "600",
                        padding: "0 20px"
                      }}
                    >
                      Đăng nhập
                    </Button>
                  )}

                  {/* Logout Button if Logged In (instead of dropdown) */}
                  {isLoggedIn && (
                    <Button
                      type="text"
                      icon={<LogoutOutlined style={{ color: "#ff4d4f" }} />}
                      onClick={logout}
                      title="Đăng xuất"
                      style={{ borderRadius: "50%", width: "44px", height: "44px" }}
                    />
                  )}

                  {/* Mobile Menu removed per user request */}
                </Space>
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <MobileMenu />
      <SearchOverlay />
      {/* Custom Styles */}
      <style jsx>{`
        .header-action-btn:hover {
          background: rgba(255, 153, 172, 0.1) !important;
          transform: scale(1.05);
        }

        .book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 153, 172, 0.4) !important;
        }

        .booking-history-btn:hover {
          background: rgba(255, 240, 245, 1) !important;
          border-color: #ff99ac !important;
          color: #ff7f9f !important;
          transform: translateY(-1px);
        }

        .user-menu-btn:hover,
        .login-btn:hover {
          background: rgba(255, 240, 245, 0.8) !important;
          border-color: #ffb6c1 !important;
          transform: translateY(-1px);
        }

        .mobile-menu-btn:hover {
          background: rgba(255, 153, 172, 0.1) !important;
        }

        .social-btn:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.1);
        }

        .ant-menu-item:hover {
          color: #ff99ac !important;
        }

        .ant-menu-item-selected {
          color: #ff99ac !important;
          border-bottom-color: #ff99ac !important;
        }

        @media (max-width: 1024px) {
          .book-btn span,
          .login-btn span {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
