"use client";
import { Layout, Typography, Row, Col, Space, Button, Divider } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  HeartOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Title, Text, Link, Paragraph } = Typography;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <AntFooter
      style={{
        background: "#FF99AC",
        color: "#4A4A4A",
        padding: "60px 50px 40px",
        borderTop: "1px solid #FFD1DC",
      }}
    >
      <Row gutter={[48, 32]} justify="space-between">
        <Col xs={24} sm={24} md={8}>
          <Title
            level={4}
            style={{ color: "#4A4A4A", marginBottom: 20, fontSize: "22px" }}
          >
            Về Chúng Tôi
          </Title>
          <Paragraph
            style={{ color: "#FFFFFF", fontSize: "15px", lineHeight: "1.8" }}
          >
            Chúng tôi cung cấp các dịch vụ spa cao cấp đáp ứng nhu cầu thư giãn
            và chăm sóc sức khỏe của bạn. Hãy trải nghiệm sự yên bình và trẻ hóa
            tại trung tâm spa sang trọng của chúng tôi.
          </Paragraph>
          <Button
            type="default"
            style={{
              marginTop: 16,
              background: "white",
              borderColor: "white",
              color: "#FF99AC",
              fontWeight: "bold",
              height: "40px",
              borderRadius: "8px",
            }}
          >
            Tìm Hiểu Thêm <ArrowRightOutlined />
          </Button>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Title
            level={4}
            style={{ color: "#4A4A4A", marginBottom: 20, fontSize: "22px" }}
          >
            Thông Tin Liên Hệ
          </Title>
          <Space
            direction="vertical"
            size="large"
            style={{ color: "#FFFFFF", width: "100%" }}
          >
            <Space align="start">
              <EnvironmentOutlined
                style={{ color: "#FFFFFF", fontSize: "18px" }}
              />
              <Text style={{ color: "#FFFFFF", fontSize: "15px" }}>
                123 Đường Spa, Thành Phố, Quốc Gia
              </Text>
            </Space>
            <Space align="start">
              <PhoneOutlined style={{ color: "#FFFFFF", fontSize: "18px" }} />
              <Text style={{ color: "#FFFFFF", fontSize: "15px" }}>
                (123) 456-7890
              </Text>
            </Space>
            <Space align="start">
              <MailOutlined style={{ color: "#FFFFFF", fontSize: "18px" }} />
              <Text style={{ color: "#FFFFFF", fontSize: "15px" }}>
                info@spa.com
              </Text>
            </Space>
          </Space>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Title
            level={4}
            style={{ color: "#4A4A4A", marginBottom: 20, fontSize: "22px" }}
          >
            Theo Dõi Chúng Tôi
          </Title>
          <Paragraph
            style={{ color: "#FFFFFF", fontSize: "15px", marginBottom: 20 }}
          >
            Kết nối với chúng tôi trên mạng xã hội để nhận thông tin mới nhất về
            ưu đãi và dịch vụ.
          </Paragraph>
          <Space size="middle">
            <Button
              type="text"
              shape="circle"
              icon={
                <FacebookOutlined
                  style={{ fontSize: "24px", color: "#FFFFFF" }}
                />
              }
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                width: "50px",
                height: "50px",
                transition: "all 0.3s ease",
              }}
              className="social-button"
            />
            <Button
              type="text"
              shape="circle"
              icon={
                <InstagramOutlined
                  style={{ fontSize: "24px", color: "#FFFFFF" }}
                />
              }
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                width: "50px",
                height: "50px",
                transition: "all 0.3s ease",
              }}
              className="social-button"
            />
            <Button
              type="text"
              shape="circle"
              icon={
                <TwitterOutlined
                  style={{ fontSize: "24px", color: "#FFFFFF" }}
                />
              }
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                width: "50px",
                height: "50px",
                transition: "all 0.3s ease",
              }}
              className="social-button"
            />
          </Space>
        </Col>
      </Row>

      <Divider
        style={{
          borderColor: "rgba(255, 255, 255, 0.2)",
          margin: "40px 0 20px",
        }}
      />

      <div
        style={{
          textAlign: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF", fontSize: "14px" }}>
          © {currentYear} Spa & Làm Đẹp. Được tạo với{" "}
          <HeartOutlined style={{ color: "#FFFFFF" }} /> Bản quyền đã được đăng
          ký.
        </Text>
      </div>

      <style jsx>{`
        .social-button:hover {
          background: rgba(255, 255, 255, 0.4) !important;
          transform: translateY(-3px);
        }
      `}</style>
    </AntFooter>
  );
};

export default Footer;
