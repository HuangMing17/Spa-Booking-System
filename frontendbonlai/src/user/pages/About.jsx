import React from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Space,
  Timeline,
  Statistic,
  Avatar,
  Rate,
  Breadcrumb,
  Image,
  Progress,
  Tag,
  Button,
} from "antd";
import {
  HomeOutlined,
  TrophyOutlined,
  TeamOutlined,
  StarOutlined,
  CheckCircleOutlined,
  HeartOutlined,
  SafetyOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  GiftOutlined,
  CustomerServiceOutlined,
  CrownOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const About = () => {
  const achievements = [
    {
      title: "5+",
      subtitle: "Năm kinh nghiệm",
      icon: <TrophyOutlined style={{ color: "#FF99AC" }} />,
    },
    {
      title: "10,000+",
      subtitle: "Khách hàng hài lòng",
      icon: <HeartOutlined style={{ color: "#FF99AC" }} />,
    },
    {
      title: "50+",
      subtitle: "Dịch vụ chuyên nghiệp",
      icon: <StarOutlined style={{ color: "#FF99AC" }} />,
    },
    {
      title: "98%",
      subtitle: "Tỷ lệ hài lòng",
      icon: <CheckCircleOutlined style={{ color: "#FF99AC" }} />,
    },
  ];

  const values = [
    {
      icon: <SafetyOutlined />,
      title: "An toàn tuyệt đối",
      description:
        "Cam kết sử dụng sản phẩm chính hãng, thiết bị hiện đại và quy trình vệ sinh nghiêm ngặt.",
    },
    {
      icon: <CustomerServiceOutlined />,
      title: "Dịch vụ tận tâm",
      description:
        "Đội ngũ nhân viên được đào tạo chuyên nghiệp, luôn tận tâm phục vụ khách hàng.",
    },
    {
      icon: <EnvironmentOutlined />,
      title: "Không gian thư giãn",
      description:
        "Thiết kế không gian sang trọng, yên tĩnh, mang lại cảm giác thư giãn tối đa.",
    },
    {
      icon: <GiftOutlined />,
      title: "Giá trị xứng đáng",
      description:
        "Mức giá hợp lý với chất lượng dịch vụ cao cấp, nhiều chương trình ưu đãi hấp dẫn.",
    },
  ];

  const team = [
    {
      name: "Nguyễn Thị Lan",
      position: "Giám đốc & Founder",
      experience: "10+ năm kinh nghiệm",
      specialty: "Chuyên gia chăm sóc da",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female&index=1",
      rating: 4.9,
    },
    {
      name: "Trần Văn Minh",
      position: "Trưởng phòng kỹ thuật",
      experience: "8+ năm kinh nghiệm",
      specialty: "Massage trị liệu",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male&index=1",
      rating: 4.8,
    },
    {
      name: "Lê Thị Hương",
      position: "Chuyên viên cấp cao",
      experience: "6+ năm kinh nghiệm",
      specialty: "Làm đẹp & Nail",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female&index=2",
      rating: 4.9,
    },
    {
      name: "Phạm Minh Tuấn",
      position: "Chuyên viên massage",
      experience: "5+ năm kinh nghiệm",
      specialty: "Massage thể thao",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male&index=2",
      rating: 4.7,
    },
  ];

  const timeline = [
    {
      year: "2019",
      title: "Thành lập",
      description:
        "Ra đời với sứ mệnh mang đến dịch vụ spa chất lượng cao tại TP.HCM",
    },
    {
      year: "2020",
      title: "Mở rộng dịch vụ",
      description:
        "Bổ sung thêm các dịch vụ chăm sóc da và massage trị liệu chuyên nghiệp",
    },
    {
      year: "2021",
      title: "Đạt chuẩn quốc tế",
      description:
        "Được cấp chứng nhận chất lượng dịch vụ spa theo tiêu chuẩn quốc tế",
    },
    {
      year: "2022",
      title: "Nâng cấp cơ sở",
      description:
        "Đầu tư nâng cấp không gian, thiết bị hiện đại và mở rộng quy mô",
    },
    {
      year: "2023",
      title: "Phát triển số hóa",
      description:
        "Ra mắt hệ thống đặt lịch online và ứng dụng chăm sóc khách hàng",
    },
    {
      year: "2024",
      title: "Hướng tới tương lai",
      description:
        "Tiếp tục mở rộng và phát triển với mục tiêu trở thành thương hiệu spa hàng đầu",
    },
  ];

  const certifications = [
    "Chứng nhận ISO 9001:2015",
    "Giấy phép hoạt động dịch vụ spa",
    "Chứng nhận an toàn vệ sinh thực phẩm",
    "Chứng nhận đào tạo nhân viên chuyên nghiệp",
  ];

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #FF99AC 0%, #FFB6C1 100%)",
          padding: "80px 0",
          color: "white",
          textAlign: "center",
        }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}
        >
          <Breadcrumb
            items={[
              { title: <HomeOutlined style={{ color: "white" }} />, href: "/" },
              { title: <span style={{ color: "white" }}>Giới thiệu</span> },
            ]}
            style={{ marginBottom: 32, justifyContent: "center" }}
          />

          <Title
            level={1}
            style={{ color: "white", marginBottom: 24, fontSize: 48 }}
          >
            Về Chúng Tôi
          </Title>
          <Paragraph
            style={{
              fontSize: 20,
              color: "white",
              maxWidth: 800,
              margin: "0 auto",
            }}
          >
            Chúng tôi là spa hàng đầu tại TP.HCM, chuyên cung cấp các dịch vụ
            chăm sóc sắc đẹp và thư giãn với chất lượng quốc tế, mang đến trải
            nghiệm tuyệt vời nhất cho khách hàng.
          </Paragraph>
        </div>
      </div>

      <div
        style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}
      >
        {/* Achievement Stats */}
        <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
          {achievements.map((achievement, index) => (
            <Col xs={12} md={6} key={index}>
              <Card
                style={{
                  textAlign: "center",
                  height: "100%",
                  border: "1px solid #FFD1DC",
                  borderRadius: 12,
                }}
                hoverable
              >
                <Space direction="vertical" size="middle">
                  <div style={{ fontSize: 32 }}>{achievement.icon}</div>
                  <Statistic
                    title={achievement.subtitle}
                    value={achievement.title}
                    valueStyle={{
                      color: "#FF99AC",
                      fontSize: 32,
                      fontWeight: "bold",
                    }}
                  />
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Mission & Vision */}
        <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <HeartOutlined style={{ color: "#FF99AC" }} />
                  <span>Sứ mệnh</span>
                </Space>
              }
              style={{ height: "100%" }}
            >
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                Mang đến cho khách hàng những giây phút thư giãn tuyệt vời nhất,
                giúp khôi phục năng lượng và nâng cao chất lượng cuộc sống thông
                qua các dịch vụ chăm sóc sắc đẹp chuyên nghiệp và tận tâm.
              </Paragraph>
              <div style={{ marginTop: 24 }}>
                <Text strong style={{ color: "#FF99AC" }}>
                  Cam kết của chúng tôi:
                </Text>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>Chất lượng dịch vụ hàng đầu</li>
                  <li>Đội ngũ chuyên gia giàu kinh nghiệm</li>
                  <li>Sản phẩm chính hãng, an toàn</li>
                  <li>Không gian thư giãn sang trọng</li>
                </ul>
              </div>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <CrownOutlined style={{ color: "#FF99AC" }} />
                  <span>Tầm nhìn</span>
                </Space>
              }
              style={{ height: "100%" }}
            >
              <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
                Trở thành thương hiệu spa hàng đầu Việt Nam, được khách hàng tin
                tưởng và lựa chọn bởi chất lượng dịch vụ vượt trội, không ngừng
                đổi mới và phát triển để đáp ứng nhu cầu ngày càng cao của khách
                hàng.
              </Paragraph>
              <div style={{ marginTop: 24 }}>
                <Text strong style={{ color: "#FF99AC" }}>
                  Mục tiêu phát triển:
                </Text>
                <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                  <li>Mở rộng hệ thống spa toàn quốc</li>
                  <li>Áp dụng công nghệ hiện đại nhất</li>
                  <li>Phát triển dịch vụ đa dạng</li>
                  <li>Xây dựng cộng đồng khách hàng thân thiết</li>
                </ul>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Core Values */}
        <Card
          title={
            <Space>
              <StarOutlined style={{ color: "#FF99AC" }} />
              <span>Giá trị cốt lõi</span>
            </Space>
          }
          style={{ marginBottom: 64 }}
        >
          <Row gutter={[24, 24]}>
            {values.map((value, index) => (
              <Col xs={24} md={12} key={index}>
                <Card
                  size="small"
                  style={{ height: "100%", border: "1px solid #FFE4E1" }}
                >
                  <Space align="start">
                    <div
                      style={{
                        fontSize: 24,
                        color: "#FF99AC",
                        background: "#FFF0F5",
                        padding: 16,
                        borderRadius: 8,
                        marginTop: 4,
                      }}
                    >
                      {value.icon}
                    </div>
                    <div>
                      <Title level={5} style={{ margin: 0, color: "#333" }}>
                        {value.title}
                      </Title>
                      <Text style={{ color: "#666" }}>{value.description}</Text>
                    </div>
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Team Section */}
        <Card
          title={
            <Space>
              <TeamOutlined style={{ color: "#FF99AC" }} />
              <span>Đội ngũ chuyên gia</span>
            </Space>
          }
          style={{ marginBottom: 64 }}
        >
          <Row gutter={[24, 24]}>
            {team.map((member, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card
                  hoverable
                  style={{ textAlign: "center", height: "100%" }}
                  cover={
                    <div style={{ padding: 24, background: "#FFF0F5" }}>
                      <Avatar
                        size={100}
                        src={member.avatar}
                        style={{ border: "4px solid #FFB6C1" }}
                      />
                    </div>
                  }
                >
                  <Card.Meta
                    title={
                      <Text strong style={{ color: "#333" }}>
                        {member.name}
                      </Text>
                    }
                    description={
                      <Space
                        direction="vertical"
                        size="small"
                        style={{ width: "100%" }}
                      >
                        <Tag color="#FFE4E1" style={{ color: "#FF99AC" }}>
                          {member.position}
                        </Tag>
                        <Text type="secondary">{member.experience}</Text>
                        <Text style={{ fontSize: 12 }}>{member.specialty}</Text>
                        <Rate
                          disabled
                          defaultValue={member.rating}
                          size="small"
                        />
                      </Space>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Timeline */}
        <Card
          title={
            <Space>
              <ClockCircleOutlined style={{ color: "#FF99AC" }} />
              <span>Hành trình phát triển</span>
            </Space>
          }
          style={{ marginBottom: 64 }}
        >
          <Timeline
            mode="left"
            items={timeline.map((item, index) => ({
              label: (
                <Text strong style={{ color: "#FF99AC", fontSize: 16 }}>
                  {item.year}
                </Text>
              ),
              dot: (
                <div
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "#FF99AC",
                    border: "3px solid #FFF0F5",
                  }}
                />
              ),
              children: (
                <div>
                  <Title level={5} style={{ margin: 0, color: "#333" }}>
                    {item.title}
                  </Title>
                  <Text style={{ color: "#666" }}>{item.description}</Text>
                </div>
              ),
            }))}
          />
        </Card>

        {/* Certifications & Gallery */}
        <Row gutter={[32, 32]} style={{ marginBottom: 64 }}>
          <Col xs={24} md={12}>
            <Card
              title={
                <Space>
                  <TrophyOutlined style={{ color: "#FF99AC" }} />
                  <span>Chứng nhận & Giải thưởng</span>
                </Space>
              }
              style={{ height: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    style={{
                      padding: 12,
                      background: "#FFF0F5",
                      borderRadius: 8,
                      border: "1px solid #FFE4E1",
                    }}
                  >
                    <Space>
                      <CheckCircleOutlined style={{ color: "#FF99AC" }} />
                      <Text>{cert}</Text>
                    </Space>
                  </div>
                ))}
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Hình ảnh spa" style={{ height: "100%" }}>
              <Row gutter={[8, 8]}>
                {[1, 2, 3, 4].map((num) => (
                  <Col span={12} key={num}>
                    <Image
                      src={`https://picsum.photos/200/150?random=${num}`}
                      alt={`Spa image ${num}`}
                      width="100%"
                      height={120}
                      style={{ objectFit: "cover", borderRadius: 8 }}
                    />
                  </Col>
                ))}
              </Row>
              <Button
                type="link"
                block
                style={{ marginTop: 16, color: "#FF99AC" }}
              >
                Xem thêm hình ảnh
              </Button>
            </Card>
          </Col>
        </Row>

        {/* Call to Action */}
        <Card
          style={{
            background: "linear-gradient(135deg, #FF99AC 0%, #FFB6C1 100%)",
            border: "none",
            textAlign: "center",
            color: "white",
          }}
        >
          <Title level={2} style={{ color: "white", marginBottom: 16 }}>
            Trải nghiệm dịch vụ spa đẳng cấp ngay hôm nay!
          </Title>
          <Paragraph style={{ fontSize: 18, color: "white", marginBottom: 32 }}>
            Đặt lịch ngay để nhận ưu đãi đặc biệt dành cho khách hàng mới
          </Paragraph>
          <Space size="large">
            <Button
              type="default"
              size="large"
              style={{
                background: "white",
                borderColor: "white",
                color: "#FF99AC",
                fontWeight: "bold",
                height: 48,
                paddingLeft: 32,
                paddingRight: 32,
              }}
              onClick={() => (window.location.href = "/dich-vu")}
            >
              Xem dịch vụ
            </Button>
            <Button
              type="default"
              size="large"
              style={{
                background: "transparent",
                borderColor: "white",
                color: "white",
                fontWeight: "bold",
                height: 48,
                paddingLeft: 32,
                paddingRight: 32,
              }}
              onClick={() => (window.location.href = "/lien-he")}
            >
              Liên hệ ngay
            </Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default About;
