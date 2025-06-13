import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Form,
  Input,
  Button,
  message,
  Space,
  Divider,
  Timeline,
  Avatar,
  Rate,
  Breadcrumb,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined,
  FacebookOutlined,
  InstagramOutlined,
  TwitterOutlined,
  WhatsAppOutlined,
  HomeOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  MessageOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const Contact = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      message.success(
        "Tin nhắn của bạn đã được gửi thành công! Chúng tôi sẽ liên hệ lại trong thời gian sớm nhất."
      );
      form.resetFields();
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <PhoneOutlined style={{ color: "#FF99AC", fontSize: "24px" }} />,
      title: "Điện thoại",
      content: "(028) 1234 5678",
      subtitle: "Hotline 24/7",
      action: () => window.open("tel:+84281234567"),
    },
    {
      icon: <MailOutlined style={{ color: "#FF99AC", fontSize: "24px" }} />,
      title: "Email",
      content: "contact@spa.com",
      subtitle: "Gửi email cho chúng tôi",
      action: () => window.open("mailto:contact@spa.com"),
    },
    {
      icon: (
        <EnvironmentOutlined style={{ color: "#FF99AC", fontSize: "24px" }} />
      ),
      title: "Địa chỉ",
      content: "123 Đường ABC, Quận 1, TP.HCM",
      subtitle: "Đến thăm spa của chúng tôi",
      action: () => window.open("https://maps.google.com"),
    },
    {
      icon: (
        <ClockCircleOutlined style={{ color: "#FF99AC", fontSize: "24px" }} />
      ),
      title: "Giờ làm việc",
      content: "8:00 - 22:00",
      subtitle: "Thứ 2 - Chủ nhật",
    },
  ];

  const socialMedia = [
    {
      icon: <FacebookOutlined />,
      name: "Facebook",
      url: "https://facebook.com/spa",
      color: "#1877f2",
    },
    {
      icon: <InstagramOutlined />,
      name: "Instagram",
      url: "https://instagram.com/spa",
      color: "#E4405F",
    },
    {
      icon: <WhatsAppOutlined />,
      name: "WhatsApp",
      url: "https://wa.me/84281234567",
      color: "#25D366",
    },
    {
      icon: <TwitterOutlined />,
      name: "Twitter",
      url: "https://twitter.com/spa",
      color: "#1DA1F2",
    },
  ];

  const faqData = [
    {
      question: "Làm thế nào để đặt lịch hẹn?",
      answer:
        "Bạn có thể đặt lịch trực tuyến qua website, gọi hotline hoặc đến trực tiếp spa.",
    },
    {
      question: "Có thể hủy lịch hẹn không?",
      answer: "Có, bạn có thể hủy lịch hẹn trước 24 giờ mà không mất phí.",
    },
    {
      question: "Spa có chính sách đối với khách hàng lần đầu?",
      answer: "Khách hàng lần đầu sẽ được giảm 20% cho dịch vụ đầu tiên.",
    },
    {
      question: "Thời gian một buổi trị liệu là bao lâu?",
      answer: "Tùy vào loại dịch vụ, thời gian từ 30 phút đến 2 giờ.",
    },
  ];

  return (
    <div
      style={{ background: "#fafafa", minHeight: "100vh", padding: "24px 0" }}
    >
      {/* Breadcrumb */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <Breadcrumb
          items={[{ title: <HomeOutlined />, href: "/" }, { title: "Liên hệ" }]}
          style={{ marginBottom: 32 }}
        />

        {/* Hero Section */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <Title level={1} style={{ color: "#FF99AC", marginBottom: 16 }}>
            Liên Hệ Với Chúng Tôi
          </Title>
          <Paragraph
            style={{
              fontSize: 18,
              color: "#666",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy liên hệ với
            chúng tôi bằng bất kỳ cách nào thuận tiện nhất cho bạn.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {/* Contact Form */}
          <Col xs={24} lg={14}>
            <Card
              title={
                <Space>
                  <MessageOutlined style={{ color: "#FF99AC" }} />
                  <span>Gửi tin nhắn cho chúng tôi</span>
                </Space>
              }
              style={{ height: "100%" }}
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                size="large"
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="name"
                      label="Họ và tên"
                      rules={[
                        { required: true, message: "Vui lòng nhập họ tên!" },
                        { min: 2, message: "Họ tên phải có ít nhất 2 ký tự!" },
                      ]}
                    >
                      <Input placeholder="Nhập họ và tên của bạn" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phone"
                      label="Số điện thoại"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại!",
                        },
                        {
                          pattern: /^[0-9]{10,11}$/,
                          message: "Số điện thoại không hợp lệ!",
                        },
                      ]}
                    >
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    { required: true, message: "Vui lòng nhập email!" },
                    { type: "email", message: "Email không hợp lệ!" },
                  ]}
                >
                  <Input placeholder="Nhập địa chỉ email" />
                </Form.Item>

                <Form.Item
                  name="subject"
                  label="Chủ đề"
                  rules={[{ required: true, message: "Vui lòng nhập chủ đề!" }]}
                >
                  <Input placeholder="Chủ đề tin nhắn" />
                </Form.Item>

                <Form.Item
                  name="message"
                  label="Tin nhắn"
                  rules={[
                    { required: true, message: "Vui lòng nhập tin nhắn!" },
                    { min: 10, message: "Tin nhắn phải có ít nhất 10 ký tự!" },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    icon={<SendOutlined />}
                    size="large"
                    style={{
                      background: "#FF99AC",
                      borderColor: "#FF99AC",
                      height: 50,
                      borderRadius: 8,
                    }}
                    block
                  >
                    Gửi tin nhắn
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Contact Information */}
          <Col xs={24} lg={10}>
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              {/* Contact Info Cards */}
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  hoverable={!!info.action}
                  onClick={info.action}
                  style={{
                    cursor: info.action ? "pointer" : "default",
                    border: "1px solid #FFD1DC",
                  }}
                >
                  <Space align="start">
                    <div style={{ marginTop: 4 }}>{info.icon}</div>
                    <div>
                      <Title level={5} style={{ margin: 0, color: "#333" }}>
                        {info.title}
                      </Title>
                      <Text strong style={{ fontSize: 16 }}>
                        {info.content}
                      </Text>
                      <br />
                      <Text type="secondary">{info.subtitle}</Text>
                    </div>
                  </Space>
                </Card>
              ))}

              {/* Social Media */}
              <Card title="Kết nối với chúng tôi">
                <Space wrap size="large">
                  {socialMedia.map((social, index) => (
                    <Button
                      key={index}
                      type="text"
                      icon={social.icon}
                      onClick={() => window.open(social.url)}
                      style={{
                        color: social.color,
                        fontSize: 24,
                        height: 48,
                        width: 48,
                        borderRadius: "50%",
                        border: `2px solid ${social.color}`,
                      }}
                    />
                  ))}
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>

        {/* FAQ Section */}
        <Card
          title={
            <Space>
              <CustomerServiceOutlined style={{ color: "#FF99AC" }} />
              <span>Câu hỏi thường gặp</span>
            </Space>
          }
          style={{ marginTop: 32 }}
        >
          <Row gutter={[24, 24]}>
            {faqData.map((faq, index) => (
              <Col xs={24} md={12} key={index}>
                <Card size="small" style={{ height: "100%" }}>
                  <Title
                    level={5}
                    style={{ color: "#FF99AC", marginBottom: 8 }}
                  >
                    {faq.question}
                  </Title>
                  <Text>{faq.answer}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Map Section */}
        <Card title="Vị trí của chúng tôi" style={{ marginTop: 32 }}>
          <div
            style={{
              height: 400,
              background: "#f0f0f0",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <EnvironmentOutlined
                style={{ fontSize: 48, color: "#FF99AC", marginBottom: 16 }}
              />
              <Title level={4}>Bản đồ sẽ được tích hợp tại đây</Title>
              <Text type="secondary">123 Đường ABC, Quận 1, TP.HCM</Text>
              <br />
              <Button
                type="primary"
                style={{
                  background: "#FF99AC",
                  borderColor: "#FF99AC",
                  marginTop: 16,
                }}
                onClick={() => window.open("https://maps.google.com")}
              >
                Xem trên Google Maps
              </Button>
            </div>
          </div>
        </Card>

        {/* Business Hours */}
        <Card title="Giờ làm việc chi tiết" style={{ marginTop: 32 }}>
          <Timeline
            items={[
              {
                dot: <ClockCircleOutlined style={{ color: "#FF99AC" }} />,
                children: (
                  <div>
                    <Text strong>Thứ 2 - Thứ 6:</Text>
                    <br />
                    <Text>8:00 - 21:00 (Giờ cao điểm)</Text>
                  </div>
                ),
              },
              {
                dot: <ClockCircleOutlined style={{ color: "#FF99AC" }} />,
                children: (
                  <div>
                    <Text strong>Thứ 7 - Chủ nhật:</Text>
                    <br />
                    <Text>9:00 - 22:00 (Cuối tuần)</Text>
                  </div>
                ),
              },
              {
                dot: <ClockCircleOutlined style={{ color: "#FF99AC" }} />,
                children: (
                  <div>
                    <Text strong>Ngày lễ:</Text>
                    <br />
                    <Text>10:00 - 20:00 (Giờ đặc biệt)</Text>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

export default Contact;
