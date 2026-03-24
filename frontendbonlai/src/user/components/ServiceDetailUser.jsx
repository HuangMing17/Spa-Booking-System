import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Tag,
  Button,
  Space,
  Radio,
  message,
  Spin,
  Result,
  Divider,
  Rate,
  Tooltip,
  Badge,
  Drawer,
  Avatar,
  Timeline,
  Alert,
  Statistic,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  StarOutlined,
  PhoneOutlined,
  WhatsAppOutlined,
  ShareAltOutlined,
  HeartOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  GiftOutlined,
  SafetyOutlined,
  CustomerServiceOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  PictureOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "../../utils/axios";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageUtils";
import { useCustomerAuth } from "../../auth/customer/context/CustomerAuthContext";
import { getServicesByCategory } from "../../admin/pages/services/serviceAPI";
import "./ServiceDetailUser.css";

const { Title, Text, Paragraph } = Typography;

const ServiceDetailUser = () => {
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImage, setMainImage] = useState(null);
  const [imageGalleryVisible, setImageGalleryVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reviewsVisible, setReviewsVisible] = useState(false);
  const [suggestedServices, setSuggestedServices] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoggedIn } = useCustomerAuth();

  // Check if user is adding to existing booking
  const { returnToBooking, selectedServices: existingServices } =
    location.state || {};
  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const response = await axios.get(`/api/products/${id}`);
        console.log("Service detail response:", response);
        setService(response);
        setMainImage(response.thumbnail);
        setError(null);

        // Fetch suggested services from the same category
        await fetchSuggestedServices(response);
      } catch (err) {
        console.error("Error fetching service:", err);
        setError(err.message || "Không thể tải thông tin dịch vụ");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [id]);

  // Fetch suggested services from the same category
  const fetchSuggestedServices = async (currentService) => {
    if (!currentService) return;

    setSuggestionsLoading(true);
    try {
      // Get category ID from the service
      const categoryId =
        currentService.categoryIds?.[0] ||
        currentService.categories?.[0]?.id ||
        currentService.category?.id;

      if (categoryId) {
        console.log("Fetching suggested services for category:", categoryId);
        const suggestionsResponse = await getServicesByCategory(categoryId);
        const suggestions = Array.isArray(suggestionsResponse)
          ? suggestionsResponse
          : [];

        // Filter out the current service and limit to 4 suggestions
        const filteredSuggestions = suggestions
          .filter((s) => s.id !== currentService.id)
          .slice(0, 4);

        setSuggestedServices(filteredSuggestions);
        console.log("Suggested services:", filteredSuggestions);
      }
    } catch (error) {
      console.error("Error fetching suggested services:", error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large">
          <div style={{ marginTop: 16 }}>Đang tải thông tin dịch vụ...</div>
        </Spin>
      </div>
    );
  }

  if (error || !service) {
    return (
      <Result
        status="error"
        title="Không thể tải thông tin dịch vụ"
        subTitle={error || "Vui lòng thử lại sau"}
        extra={[
          <Button type="primary" key="back" onClick={() => navigate(-1)}>
            Quay lại
          </Button>,
        ]}
      />
    );
  }

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };
  // Prepare variants data
  const variants =
    service.variantNames?.map((name, index) => ({
      id: service.variantIds?.[index] || index,
      name: name,
      price: service.variantPrices?.[index] || 0,
      duration: service.variantDurations?.[index] || 0,
    })) || [];

  // Handle favorite toggle
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích");
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: service.name,
        text: service.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      message.success("Đã sao chép link dịch vụ!");
    }
  };
  // Handle contact methods
  const handlePhoneCall = () => {
    window.open("tel:+84123456789");
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Xin chào! Tôi muốn tìm hiểu về dịch vụ: ${service.name}`
    );
    window.open(`https://wa.me/84123456789?text=${message}`);
  };

  // Handle image gallery
  const handleImageGallery = () => {
    setImageGalleryVisible(true);
  };

  // Mock reviews data
  const mockReviews = [
    {
      id: 1,
      user: "Nguyễn Thị Lan",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
      rating: 5,
      comment: "Dịch vụ rất tốt, nhân viên chuyên nghiệp và tận tình!",
      date: "2024-01-15",
      variant: "Gói Premium",
    },
    {
      id: 2,
      user: "Trần Văn Nam",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=male",
      rating: 4,
      comment: "Chất lượng tốt, giá cả hợp lý. Sẽ quay lại lần sau.",
      date: "2024-01-10",
      variant: "Gói Cơ bản",
    },
    {
      id: 3,
      user: "Lê Thị Mai",
      avatar: "https://xsgames.co/randomusers/avatar.php?g=female",
      rating: 5,
      comment: "Rất hài lòng với dịch vụ. Không gian thoải mái, sạch sẽ.",
      date: "2024-01-05",
      variant: "Gói VIP",
    },
  ];

  // Service benefits
  const serviceBenefits = [
    { icon: <SafetyOutlined />, text: "Đảm bảo an toàn 100%" },
    { icon: <CustomerServiceOutlined />, text: "Hỗ trợ 24/7" },
    { icon: <TeamOutlined />, text: "Đội ngũ chuyên nghiệp" },
    { icon: <GiftOutlined />, text: "Ưu đãi thành viên" },
  ];
  const handleProceedToBooking = () => {
    // Check if user is logged in first
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để đặt lịch dịch vụ");
      navigate("/dang-nhap", {
        state: {
          redirectPath: `/dich-vu/${id}`,
          redirectState: location.state,
        },
      });
      return;
    }

    if (!selectedVariant) {
      message.error({
        content: "Vui lòng chọn gói dịch vụ trước khi đặt lịch!",
        duration: 3,
        style: {
          marginTop: "20vh",
        },
      });
      // Scroll to variant selection section
      const variantSection = document.querySelector(".ant-radio-group");
      if (variantSection) {
        variantSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    console.log("Proceeding to booking with:", { service, selectedVariant });

    // Create new service item
    const newServiceItem = {
      id: Date.now(),
      service: service,
      variant: selectedVariant,
      quantity: 1,
    };

    // If adding to existing booking, merge with existing services
    const allServices =
      returnToBooking && existingServices
        ? [...existingServices, newServiceItem]
        : [newServiceItem];

    // Navigate to booking page with service and variant info
    navigate("/dat-lich", {
      state: {
        service: service,
        selectedVariant: selectedVariant,
        selectedServices: allServices,
      },
    });
  };
  return (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          {/* Main Image and Gallery */}
          <Card variant="borderless" className="service-detail-card">
            <div style={{ position: "relative" }}>
              <Image
                src={getImageUrl(mainImage)}
                alt={service.name}
                width="100%"
                height={400}
                style={{ objectFit: "cover", borderRadius: "8px" }}
                fallback={getPlaceholderImage(600, 400)}
              />

              {/* Action buttons overlay */}
              <div
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  display: "flex",
                  gap: 8,
                }}
              >
                <Tooltip title="Xem thư viện ảnh">
                  <Button
                    type="text"
                    icon={<PictureOutlined />}
                    style={{ background: "rgba(255,255,255,0.9)" }}
                    onClick={handleImageGallery}
                  />
                </Tooltip>
                <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Thêm yêu thích"}>
                  <Button
                    type="text"
                    icon={<HeartOutlined />}
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      color: isFavorite ? "#ff4d4f" : "#666",
                    }}
                    onClick={handleFavoriteToggle}
                  />
                </Tooltip>
                <Tooltip title="Chia sẻ">
                  <Button
                    type="text"
                    icon={<ShareAltOutlined />}
                    style={{ background: "rgba(255,255,255,0.9)" }}
                    onClick={handleShare}
                  />
                </Tooltip>
              </div>

              {/* Sale badge */}
              {service.salePrice && (
                <div
                  style={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                  }}
                >
                  <Badge.Ribbon
                    text={`-${Math.round(
                      (1 - service.salePrice / service.regularPrice) * 100
                    )}%`}
                    color="red"
                  />
                </div>
              )}

              {/* View count badge */}
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  background: "rgba(0,0,0,0.6)",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                <EyeOutlined /> {Math.floor(Math.random() * 1000) + 100} lượt
                xem
              </div>
            </div>

            {/* Thumbnail gallery */}
            {service.images && service.images.length > 0 && (
              <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
                <Col span={4}>
                  <Image
                    src={getImageUrl(service.thumbnail)}
                    alt="Main"
                    width="100%"
                    height={80}
                    style={{
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border:
                        mainImage === service.thumbnail
                          ? "2px solid #1890ff"
                          : "1px solid #f0f0f0",
                    }}
                    preview={false}
                    onClick={() => setMainImage(service.thumbnail)}
                  />
                </Col>
                {service.images.slice(0, 5).map((image, index) => (
                  <Col span={4} key={index}>
                    <Image
                      src={getImageUrl(image)}
                      alt={`${service.name} - ${index + 1}`}
                      width="100%"
                      height={80}
                      style={{
                        objectFit: "cover",
                        borderRadius: "4px",
                        cursor: "pointer",
                        border:
                          mainImage === image
                            ? "2px solid #1890ff"
                            : "1px solid #f0f0f0",
                      }}
                      preview={false}
                      onClick={() => setMainImage(image)}
                    />
                  </Col>
                ))}
              </Row>
            )}
          </Card>

          {/* Service Statistics */}
          <Card
            variant="borderless"
            className="service-detail-card"
            style={{ marginTop: 24 }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Đánh giá"
                  value={4.8}
                  precision={1}
                  valueStyle={{ color: "#faad14" }}
                  prefix={<StarOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Lượt đặt"
                  value={234}
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<CalendarOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Hoàn thành"
                  value={98}
                  suffix="%"
                  valueStyle={{ color: "#3f8600" }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Còn lại"
                  value={service.stock || 0}
                  valueStyle={{
                    color: service.stock > 10 ? "#3f8600" : "#cf1322",
                  }}
                  suffix="slot"
                />
              </Col>
            </Row>
          </Card>

          {/* Service Benefits */}
          <Card
            variant="borderless"
            className="service-detail-card"
            style={{ marginTop: 24 }}
            title="Ưu điểm nổi bật"
          >
            <Row gutter={[16, 16]}>
              {serviceBenefits.map((benefit, index) => (
                <Col span={12} key={index}>
                  <Space>
                    <span style={{ color: "#1890ff", fontSize: "18px" }}>
                      {benefit.icon}
                    </span>
                    <Text>{benefit.text}</Text>
                  </Space>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Service Description */}
          <Card
            variant="borderless"
            className="service-detail-card"
            style={{ marginTop: 24 }}
            title="Mô tả dịch vụ"
          >
            <Paragraph>
              {service.description || "Không có mô tả chi tiết"}
            </Paragraph>

            {service.attributeNames && service.attributeNames.length > 0 && (
              <>
                <Title level={5} style={{ marginTop: 24 }}>
                  Thông tin chi tiết
                </Title>
                <Row gutter={[16, 16]}>
                  {service.attributeNames.map((name, index) => (
                    <Col span={12} key={index}>
                      <Card
                        size="small"
                        bordered={false}
                        style={{ background: "#f5f5f5" }}
                      >
                        <Text type="secondary">{name}</Text>
                        <br />
                        <Text strong>{service.attributeValues[index]}</Text>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}
          </Card>

          {/* Reviews Section */}
          <Card
            variant="borderless"
            className="service-detail-card"
            style={{ marginTop: 24 }}
            title={
              <Space>
                <span>Đánh giá khách hàng</span>
                <Tag color="blue">{mockReviews.length} đánh giá</Tag>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => setReviewsVisible(true)}>
                Xem tất cả
              </Button>
            }
          >
            <div style={{ marginBottom: 16 }}>
              <Row align="middle">
                <Col span={8}>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: "48px",
                        fontWeight: "bold",
                        color: "#faad14",
                      }}
                    >
                      4.8
                    </div>
                    <Rate disabled defaultValue={4.8} allowHalf />
                    <div style={{ color: "#666", marginTop: 8 }}>
                      {mockReviews.length} đánh giá
                    </div>
                  </div>
                </Col>
                <Col span={16}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <Row key={star} align="middle" style={{ marginBottom: 4 }}>
                      <Col span={2}>
                        <Text>{star}</Text>
                      </Col>
                      <Col span={2}>
                        <StarOutlined style={{ color: "#faad14" }} />
                      </Col>
                      <Col span={16}>
                        <div
                          style={{
                            background: "#f0f0f0",
                            height: 8,
                            borderRadius: 4,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              background: "#faad14",
                              height: "100%",
                              width: `${
                                star === 5 ? 80 : star === 4 ? 15 : 5
                              }%`,
                              borderRadius: 4,
                            }}
                          />
                        </div>
                      </Col>
                      <Col span={4} style={{ textAlign: "right" }}>
                        <Text type="secondary">
                          {star === 5 ? 80 : star === 4 ? 15 : 5}%
                        </Text>
                      </Col>
                    </Row>
                  ))}
                </Col>
              </Row>
            </div>

            {/* Recent reviews */}
            <Divider />
            {mockReviews.slice(0, 2).map((review) => (
              <div
                key={review.id}
                style={{
                  marginBottom: 16,
                  padding: 16,
                  background: "#fafafa",
                  borderRadius: 8,
                }}
              >
                <Row>
                  <Col span={2}>
                    <Avatar src={review.avatar} />
                  </Col>
                  <Col span={22}>
                    <div style={{ marginLeft: 12 }}>
                      <Space>
                        <Text strong>{review.user}</Text>
                        <Rate
                          disabled
                          defaultValue={review.rating}
                          size="small"
                        />
                        <Tag size="small">{review.variant}</Tag>
                      </Space>
                      <div style={{ margin: "8px 0" }}>
                        <Text>{review.comment}</Text>
                      </div>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {review.date}
                      </Text>
                    </div>
                  </Col>
                </Row>
              </div>
            ))}
          </Card>
        </Col>{" "}
        <Col xs={24} lg={10}>
          {/* Booking Card */}
          <Card variant="borderless" className="service-detail-card">
            <Title level={3}>{service.name}</Title>
            <Space size={[0, 8]} wrap style={{ marginBottom: 16 }}>
              {service.categories?.map((cat) => (
                <Tag color="blue" key={cat.id}>
                  {cat.name}
                </Tag>
              ))}
            </Space>
            {/* Price Display */}
            <div style={{ marginBottom: 24 }}>
              {service.salePrice ? (
                <Space direction="horizontal" align="center">
                  <Text delete type="secondary" style={{ fontSize: 16 }}>
                    {formatPrice(service.regularPrice)}
                  </Text>
                  <Text
                    type="danger"
                    style={{ fontSize: 24, fontWeight: "bold" }}
                  >
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
              ) : (
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                  {formatPrice(service.regularPrice)}
                </Text>
              )}
            </div>
            {/* Stock Alert */}
            {service.stock && service.stock < 5 && (
              <Alert
                message={`Chỉ còn ${service.stock} slot khả dụng!`}
                type="warning"
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}
            {/* Variant Selection */}
            {variants.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Title level={5}>Chọn gói dịch vụ</Title>
                <Radio.Group
                  onChange={(e) =>
                    setSelectedVariant(
                      variants.find((v) => v.id === e.target.value)
                    )
                  }
                  style={{ width: "100%" }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {variants.map((variant) => (
                      <Card
                        key={variant.id}
                        size="small"
                        style={{
                          cursor: "pointer",
                          border:
                            selectedVariant?.id === variant.id
                              ? "2px solid #1890ff"
                              : "1px solid #f0f0f0",
                        }}
                        onClick={() => setSelectedVariant(variant)}
                      >
                        <Radio value={variant.id}>
                          <Space direction="vertical">
                            <Text strong>{variant.name}</Text>
                            <Space>
                              <Text type="secondary">
                                <ClockCircleOutlined /> {variant.duration} phút
                              </Text>
                              <Text type="danger">
                                <DollarOutlined /> {formatPrice(variant.price)}
                              </Text>
                            </Space>
                          </Space>
                        </Radio>
                      </Card>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            )}
            {/* Booking Process Timeline */}
            <Card
              size="small"
              title="Quy trình đặt lịch"
              style={{ marginBottom: 24 }}
            >
              <Timeline 
                size="small" 
                items={[
                  {
                    dot: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
                    children: "Chọn gói dịch vụ"
                  },
                  {
                    dot: <CalendarOutlined />,
                    children: "Chọn ngày giờ phù hợp"
                  },
                  {
                    dot: <CustomerServiceOutlined />,
                    children: "Xác nhận thông tin"
                  },
                  {
                    dot: <CheckCircleOutlined />,
                    children: "Hoàn thành đặt lịch"
                  }
                ]}
              />
            </Card>{" "}
            <Space direction="vertical" style={{ width: "100%" }} size="middle">
              {!isLoggedIn && (
                <Alert
                  message="Cần đăng nhập để đặt lịch"
                  description="Vui lòng đăng nhập để có thể đặt lịch dịch vụ với thông tin tài khoản của bạn."
                  type="info"
                  showIcon
                  action={
                    <Button
                      size="small"
                      type="primary"
                      icon={<LoginOutlined />}
                      onClick={() =>
                        navigate("/dang-nhap", {
                          state: {
                            redirectPath: `/dich-vu/${id}`,
                            redirectState: location.state,
                          },
                        })
                      }
                    >
                      Đăng nhập
                    </Button>
                  }
                  style={{ marginBottom: 8 }}
                />
              )}
              {isLoggedIn && !selectedVariant && (
                <Alert
                  message="Vui lòng chọn gói dịch vụ"
                  description="Bạn cần chọn một gói dịch vụ ở trên trước khi có thể đặt lịch."
                  type="warning"
                  showIcon
                  style={{ marginBottom: 8 }}
                />
              )}
              <Button
                type="primary"
                icon={<CalendarOutlined />}
                size="large"
                block
                onClick={handleProceedToBooking}
                disabled={!isLoggedIn || !selectedVariant}
                style={{
                  opacity: isLoggedIn && selectedVariant ? 1 : 0.6,
                }}
              >
                {!isLoggedIn
                  ? "Đăng nhập để đặt lịch"
                  : selectedVariant
                  ? "Đặt lịch ngay"
                  : "Chọn gói dịch vụ để đặt lịch"}
              </Button>

              {/* Contact buttons */}
              <Row gutter={8}>
                <Col span={12}>
                  <Button
                    icon={<PhoneOutlined />}
                    block
                    onClick={handlePhoneCall}
                  >
                    Gọi ngay
                  </Button>
                </Col>
                <Col span={12}>
                  <Button
                    icon={<WhatsAppOutlined />}
                    block
                    style={{
                      background: "#25d366",
                      borderColor: "#25d366",
                      color: "white",
                    }}
                    onClick={handleWhatsApp}
                  >
                    WhatsApp
                  </Button>
                </Col>
              </Row>
            </Space>
            {/* Additional Info */}
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">
                <InfoCircleOutlined /> Sau khi đặt lịch, chúng tôi sẽ liên hệ
                với bạn để xác nhận
              </Text>
            </div>
            {/* Location info */}
            <Divider />
            <div>
              <Title level={5}>
                <EnvironmentOutlined /> Địa điểm
              </Title>
              <Text>123 Đường ABC, Quận 1, TP.HCM</Text>
              <br />
              <Button type="link" size="small">
                Xem bản đồ
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      {/* Image Gallery Drawer */}
      <Drawer
        title="Thư viện ảnh"
        placement="right"
        size="large"
        onClose={() => setImageGalleryVisible(false)}
        open={imageGalleryVisible}
      >
        <div style={{ textAlign: "center" }}>
          <Image
            src={getImageUrl(
              service.images?.[currentImageIndex] || service.thumbnail
            )}
            alt={`${service.name} - ${currentImageIndex + 1}`}
            width="100%"
            style={{ maxHeight: "60vh", objectFit: "contain" }}
          />

          <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
            {[service.thumbnail, ...(service.images || [])].map(
              (image, index) => (
                <Col span={6} key={index}>
                  <Image
                    src={getImageUrl(image)}
                    alt={`Thumbnail ${index + 1}`}
                    width="100%"
                    height={80}
                    style={{
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                      border:
                        currentImageIndex === index
                          ? "2px solid #1890ff"
                          : "1px solid #f0f0f0",
                    }}
                    preview={false}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                </Col>
              )
            )}
          </Row>
        </div>
      </Drawer>
      {/* Reviews Drawer */}
      <Drawer
        title="Tất cả đánh giá"
        placement="right"
        size="large"
        onClose={() => setReviewsVisible(false)}
        open={reviewsVisible}
      >
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div
            style={{ fontSize: "48px", fontWeight: "bold", color: "#faad14" }}
          >
            4.8
          </div>
          <Rate disabled defaultValue={4.8} allowHalf />
          <div style={{ color: "#666", marginTop: 8 }}>
            Dựa trên {mockReviews.length} đánh giá
          </div>
        </div>

        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {mockReviews.map((review) => (
            <Card key={review.id} size="small">
              <Row>
                <Col span={3}>
                  <Avatar src={review.avatar} size="large" />
                </Col>
                <Col span={21}>
                  <div style={{ marginLeft: 12 }}>
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div>
                        <Space>
                          <Text strong>{review.user}</Text>
                          <Tag size="small">{review.variant}</Tag>
                        </Space>
                        <div style={{ marginTop: 4 }}>
                          <Rate
                            disabled
                            defaultValue={review.rating}
                            size="small"
                          />
                          <Text
                            type="secondary"
                            style={{ marginLeft: 8, fontSize: "12px" }}
                          >
                            {review.date}
                          </Text>
                        </div>
                      </div>
                      <Text>{review.comment}</Text>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Card>
          ))}
        </Space>
      </Drawer>
      {/* Service Suggestions Section */}
      {suggestedServices.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <Card>
            <Title level={3} style={{ marginBottom: 24, textAlign: "center" }}>
              <GiftOutlined style={{ marginRight: 8, color: "#1890ff" }} />
              Đề xuất dịch vụ cùng danh mục
            </Title>

            {suggestionsLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <Spin size="large" tip="Đang tải đề xuất dịch vụ..." />
              </div>
            ) : (
              <Row gutter={[16, 16]}>
                {suggestedServices.map((suggestedService, index) => (
                  <Col xs={24} sm={12} md={8} key={suggestedService.id}>
                    <Card
                      hoverable
                      className="suggestion-card"
                      cover={
                        <div
                          style={{
                            height: 200,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <Image
                            src={getImageUrl(suggestedService.thumbnail)}
                            alt={suggestedService.name}
                            width="100%"
                            height={200}
                            style={{ objectFit: "cover" }}
                            fallback={getPlaceholderImage()}
                            preview={false}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              background: "rgba(0,0,0,0.7)",
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: "12px",
                            }}
                          >
                            #{index + 1}
                          </div>
                        </div>
                      }
                      onClick={() =>
                        navigate(`/dich-vu/${suggestedService.id}`)
                      }
                      style={{
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        border: "1px solid #f0f0f0",
                      }}
                    >
                      <div style={{ padding: "16px 0" }}>
                        <Title
                          level={5}
                          style={{
                            marginBottom: 8,
                            fontSize: "14px",
                            lineHeight: "1.4",
                            height: "40px",
                            overflow: "hidden",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {suggestedService.name}
                        </Title>

                        <Space
                          direction="vertical"
                          size="small"
                          style={{ width: "100%" }}
                        >
                          <div>
                            {suggestedService.salePrice ? (
                              <Space>
                                <Text
                                  delete
                                  type="secondary"
                                  style={{ fontSize: "12px" }}
                                >
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(suggestedService.regularPrice || 0)}
                                </Text>
                                <Text
                                  strong
                                  style={{ color: "#ff4d4f", fontSize: "14px" }}
                                >
                                  {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                  }).format(suggestedService.salePrice || 0)}
                                </Text>
                              </Space>
                            ) : (
                              <Text
                                strong
                                style={{ color: "#1890ff", fontSize: "14px" }}
                              >
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(suggestedService.regularPrice || 0)}
                              </Text>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Rate
                              disabled
                              defaultValue={4.5}
                              size="small"
                              style={{ fontSize: "12px" }}
                            />
                            <Text type="secondary" style={{ fontSize: "11px" }}>
                              {Math.floor(Math.random() * 100) + 50} đánh giá
                            </Text>
                          </div>

                          {suggestedService.salePrice && (
                            <Tag color="red" size="small" style={{ margin: 0 }}>
                              Giảm{" "}
                              {Math.round(
                                ((suggestedService.regularPrice -
                                  suggestedService.salePrice) /
                                  suggestedService.regularPrice) *
                                  100
                              )}
                              %
                            </Tag>
                          )}
                        </Space>

                        <Button
                          type="primary"
                          size="small"
                          block
                          style={{
                            marginTop: 12,
                            height: 32,
                            fontSize: "12px",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/dich-vu/${suggestedService.id}`);
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}

            <div style={{ textAlign: "center", marginTop: 24 }}>
              <Button
                type="default"
                size="large"
                onClick={() => {
                  const categoryId =
                    service?.categoryIds?.[0] ||
                    service?.categories?.[0]?.id ||
                    service?.category?.id;
                  if (categoryId) {
                    navigate("/dich-vu", {
                      state: { categoryFilter: categoryId },
                    });
                  } else {
                    navigate("/dich-vu");
                  }
                }}
              >
                Xem tất cả dịch vụ cùng danh mục
              </Button>
            </div>
          </Card>
        </div>
      )}
      {/* ...existing drawers and styles... */}{" "}
      <style jsx>{`
        .service-detail-card {
          border-radius: 8px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }

        .suggestion-card {
          transition: all 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
        }

        .suggestion-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: #1890ff;
        }

        .suggestion-card .ant-card-cover {
          border-radius: 12px 12px 0 0;
        }

        .suggestion-card .ant-card-body {
          padding: 0;
        }
      `}</style>
    </>
  );
};

export default ServiceDetailUser;
