import React, { useState } from "react";
import {
  Card,
  Typography,
  Tag,
  Space,
  Button,
  Rate,
  Badge,
  Tooltip,
  Image,
  Progress,
} from "antd";
import {
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  FireOutlined,
  ThunderboltOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageUtils";
import "./ServiceCard.css";

const { Text, Paragraph } = Typography;
const { Meta } = Card;

const ServiceCard = ({ service, onFavoriteToggle }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(service.id, !isFavorite);
  };

  // Handle card click
  const handleCardClick = () => {
    navigate(`/services/${service.id}`);
  };

  // Calculate discount percentage
  const getDiscountPercentage = () => {
    if (service.salePrice && service.regularPrice) {
      return Math.round((1 - service.salePrice / service.regularPrice) * 100);
    }
    return 0;
  };

  // Generate mock data for demonstration
  const mockData = {
    rating: 4.5 + Math.random() * 0.5,
    reviews: Math.floor(Math.random() * 200) + 50,
    views: Math.floor(Math.random() * 1000) + 100,
    bookings: Math.floor(Math.random() * 100) + 20,
    availability: Math.floor(Math.random() * 20) + 5,
  };

  const discountPercentage = getDiscountPercentage();
  const isOnSale = discountPercentage > 0;
  const isPopular = mockData.bookings > 50;
  const isLowStock = mockData.availability < 10;

  return (
    <Badge.Ribbon
      text={
        isOnSale
          ? `-${discountPercentage}%`
          : isPopular
          ? "Phổ biến"
          : undefined
      }
      color={isOnSale ? "red" : "gold"}
      style={{ display: isOnSale || isPopular ? "block" : "none" }}
    >
      <Card
        hoverable
        className="service-card"
        cover={
          <div className="service-card-cover">
            <Image
              alt={service.name}
              src={getImageUrl(service.thumbnail)}
              height={200}
              style={{ objectFit: "cover" }}
              fallback={getPlaceholderImage(300, 200)}
              preview={false}
            />
            <div className="service-card-overlay">
              <Space>
                <Tooltip title="Lượt xem">
                  <Space size={4}>
                    <EyeOutlined style={{ color: "white" }} />
                    <Text style={{ color: "white", fontSize: 12 }}>
                      {mockData.views}
                    </Text>
                  </Space>
                </Tooltip>
                <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}>
                  <Button
                    type="text"
                    icon={
                      isFavorite ? (
                        <HeartFilled style={{ color: "#ff4d4f" }} />
                      ) : (
                        <HeartOutlined style={{ color: "white" }} />
                      )
                    }
                    onClick={handleFavoriteToggle}
                    style={{ border: "none", background: "rgba(0,0,0,0.3)" }}
                  />
                </Tooltip>
              </Space>
            </div>
            {isLowStock && (
              <div className="stock-warning">
                <ThunderboltOutlined /> Chỉ còn {mockData.availability} slot!
              </div>
            )}
          </div>
        }
        onClick={handleCardClick}
      >
        <Meta
          title={
            <div>
              <Text strong style={{ fontSize: 16 }}>
                {service.name}
              </Text>
              {isPopular && (
                <Tooltip title="Dịch vụ phổ biến">
                  <FireOutlined style={{ color: "#fa8c16", marginLeft: 8 }} />
                </Tooltip>
              )}
            </div>
          }
          description={
            <Space direction="vertical" style={{ width: "100%" }}>
              {/* Categories */}
              <Space size={[0, 4]} wrap>
                {service.categories?.slice(0, 2).map((cat) => (
                  <Tag color="blue" size="small" key={cat.id}>
                    {cat.name}
                  </Tag>
                ))}
                {service.categories?.length > 2 && (
                  <Tag size="small">+{service.categories.length - 2}</Tag>
                )}
              </Space>

              {/* Description */}
              <Paragraph
                ellipsis={{ rows: 2 }}
                style={{ marginBottom: 8, color: "#666" }}
              >
                {service.description || "Không có mô tả"}
              </Paragraph>

              {/* Rating and Reviews */}
              <Space>
                <Rate
                  disabled
                  defaultValue={mockData.rating}
                  allowHalf
                  style={{ fontSize: 12 }}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  ({mockData.reviews})
                </Text>
              </Space>

              {/* Price */}
              <div style={{ marginTop: 8 }}>
                {isOnSale ? (
                  <Space direction="horizontal" align="center">
                    <Text delete type="secondary" style={{ fontSize: 14 }}>
                      {formatPrice(service.regularPrice)}
                    </Text>
                    <Text
                      type="danger"
                      style={{ fontSize: 18, fontWeight: "bold" }}
                    >
                      {formatPrice(service.salePrice)}
                    </Text>
                  </Space>
                ) : (
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {formatPrice(service.regularPrice)}
                  </Text>
                )}
              </div>

              {/* Service Info */}
              <Space split={<Text type="secondary">•</Text>}>
                {service.variantDurations?.[0] && (
                  <Tooltip title="Thời gian">
                    <Space size={4}>
                      <ClockCircleOutlined style={{ color: "#666" }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {service.variantDurations[0]} phút
                      </Text>
                    </Space>
                  </Tooltip>
                )}
                <Tooltip title="Đã đặt">
                  <Space size={4}>
                    <CalendarOutlined style={{ color: "#666" }} />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {mockData.bookings}
                    </Text>
                  </Space>
                </Tooltip>
              </Space>

              {/* Availability Progress */}
              {isLowStock && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: 11 }}>
                    Còn lại:
                  </Text>
                  <Progress
                    percent={(mockData.availability / 20) * 100}
                    size="small"
                    status={mockData.availability < 5 ? "exception" : "normal"}
                    showInfo={false}
                  />
                </div>
              )}
            </Space>
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default ServiceCard;
