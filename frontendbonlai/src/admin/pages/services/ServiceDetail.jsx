import React from "react";
import {
  Descriptions,
  Image,
  Tag,
  Row,
  Col,
  Typography,
  Table,
  Card,
  Space,
} from "antd";
import { getImageUrl, getPlaceholderImage } from "../../../utils/imageUtils";

const { Title, Text, Paragraph } = Typography;

const ServiceDetail = ({ service }) => {
  if (!service) return <p>Không có thông tin dịch vụ</p>;

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  // Format date function
  const formatDate = (date) => {
    return date
      ? new Date(date).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";
  };

  // Prepare variants data for table
  const variantColumns = [
    {
      title: "Tên gói",
      dataIndex: "name",
      key: "name",
      width: "30%",
    },
    {
      title: "Giá dịch vụ",
      dataIndex: "price",
      key: "price",
      render: (price) => formatPrice(price),
      width: "35%",
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => <Tag color="blue">{`${duration} phút`}</Tag>,
      width: "35%",
    },
  ];

  const variantData =
    service.variantNames?.map((name, index) => ({
      key: service.variantIds?.[index] || index,
      name: name,
      price: service.variantPrices?.[index],
      duration: service.variantDurations?.[index],
    })) || [];

  // Card style for consistent design
  const cardStyle = {
    marginBottom: 24,
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: '1px solid #f0f0f0'
  };

  return (
    <div style={{ 
      padding: '24px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <Row gutter={[24, 24]}>
        {/* Left Column - Main Information */}
        <Col xs={24} lg={16}>
          {/* Basic Information Card */}
          <Card
            title={<Title level={4} style={{ margin: 0 }}>Thông tin cơ bản</Title>}
            style={cardStyle}
          >
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item
                label={<strong>Tên dịch vụ</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Text strong>{service.name}</Text>
              </Descriptions.Item>

              <Descriptions.Item
                label={<strong>Danh mục</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Space size={[0, 8]} wrap>
                  {service.categories?.map((cat) => (
                    <Tag key={cat.id} color="blue">
                      {cat.name}
                    </Tag>
                  )) || "Chưa phân loại"}
                </Space>
              </Descriptions.Item>

              <Descriptions.Item
                label={<strong>Mô tả</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Paragraph style={{ margin: 0 }}>
                  {service.description || "Không có mô tả"}
                </Paragraph>
              </Descriptions.Item>

              <Descriptions.Item
                label={<strong>Giá niêm yết</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Text strong type="danger">
                  {formatPrice(service.regularPrice)}
                </Text>
              </Descriptions.Item>

              {service.salePrice && (
                <Descriptions.Item
                  label={<strong>Giá khuyến mãi</strong>}
                  labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
                >
                  <Space>
                    <Text type="success" strong>
                      {formatPrice(service.salePrice)}
                    </Text>
                    <Tag color="red">
                      Giảm{" "}
                      {Math.round(
                        (1 - service.salePrice / service.regularPrice) * 100
                      )}
                      %
                    </Tag>
                  </Space>
                </Descriptions.Item>
              )}

              <Descriptions.Item
                label={<strong>Trạng thái</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Tag color={service.isActive ? "success" : "error"}>
                  {service.isActive ? "Đang hoạt động" : "Không hoạt động"}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={<strong>Số lượng có thể đặt</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Tag color="blue">{service.stock || "Không giới hạn"}</Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={<strong>Thời gian tạo</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                {formatDate(service.createdAt)}
              </Descriptions.Item>

              <Descriptions.Item
                label={<strong>Cập nhật lần cuối</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                {formatDate(service.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* Variants Information */}
          {service.variantNames && service.variantNames.length > 0 && (
            <Card
              title={<Title level={4} style={{ margin: 0 }}>Các gói dịch vụ</Title>}
              style={cardStyle}
            >
              <Table
                columns={variantColumns}
                dataSource={variantData}
                pagination={false}
                bordered
                size="middle"
                style={{ marginBottom: 16 }}
              />
              <Text type="secondary">
                * Giá dịch vụ có thể thay đổi tùy theo yêu cầu cụ thể
              </Text>
            </Card>
          )}

          {/* Attributes Information */}
          {service.attributeNames && service.attributeNames.length > 0 && (
            <Card
              title={<Title level={4} style={{ margin: 0 }}>Thông tin bổ sung</Title>}
              style={cardStyle}
            >
              <Row gutter={[16, 16]}>
                {service.attributeNames.map((name, index) => (
                  <Col
                    key={service.attributeIds?.[index] || index}
                    xs={24}
                    sm={12}
                  >
                    <Card
                      size="small"
                      variant="borderless"
                      style={{ 
                        background: "#f8f9fa",
                        borderRadius: '6px',
                        border: '1px solid #e9ecef'
                      }}
                    >
                      <Text type="secondary">{name}</Text>
                      <br />
                      <Text strong>{service.attributeValues?.[index]}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        </Col>

        {/* Right Column - Images */}
        <Col xs={24} lg={8}>
          <Card
            title={<Title level={4} style={{ margin: 0 }}>Hình ảnh dịch vụ</Title>}
            style={cardStyle}
          >
            {/* Thumbnail */}
            <div style={{ marginBottom: 24 }}>
              <Title level={5} style={{ marginBottom: 12 }}>Ảnh đại diện</Title>
              <Image
                src={getImageUrl(service.thumbnail)}
                alt={service.name}
                width="100%"
                style={{
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "1px solid #f0f0f0",
                  maxHeight: "300px"
                }}
                fallback={getPlaceholderImage(300, 300)}
                preview={{
                  mask: "Xem ảnh"
                }}
              />
            </div>

            {/* Additional Images */}
            {service.images && service.images.length > 0 && (
              <div>
                <Title level={5} style={{ marginBottom: 12 }}>Hình ảnh bổ sung</Title>
                <Row gutter={[8, 8]}>
                  {service.images.map((imageUrl, index) => (
                    <Col key={index} xs={12}>
                      <Image
                        src={getImageUrl(imageUrl)}
                        alt={`${service.name} - ${index + 1}`}
                        width="100%"
                        style={{
                          objectFit: "cover",
                          borderRadius: "6px",
                          border: "1px solid #f0f0f0",
                          height: "120px"
                        }}
                        fallback={getPlaceholderImage(150, 150)}
                        preview={{
                          mask: "Xem ảnh"
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ServiceDetail;
