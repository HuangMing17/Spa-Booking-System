import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  message,
  Input,
  Select,
  Spin,
  Empty,
  Badge,
  Tooltip,
  Modal,
  Descriptions,
  Alert,
  Divider,
} from "antd";
import {
  GiftOutlined,
  SearchOutlined,
  CalendarOutlined,
  InfoCircleOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  PercentageOutlined,
  DollarOutlined,
  TagsOutlined,
  ClockCircleOutlined,
  FilterOutlined,
  ReloadOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllCoupons } from "../../admin/pages/coupons/couponAPI";
import { formatCurrency } from "../../utils/formatters";
import { useCustomerAuth } from "../../auth/customer/context/CustomerAuthContext";

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const CouponsView = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useCustomerAuth();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [typeFilter, setTypeFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState("");
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);
  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await getAllCoupons();
      
      // Đảm bảo response là array
      let couponsData = Array.isArray(response) ? response : [];
      
      // Nếu không có data từ API, sử dụng dữ liệu mẫu
      if (couponsData.length === 0) {
        couponsData = [
          {
            id: 1,
            code: 'WELCOME10',
            name: 'Chào mừng khách hàng mới',
            discountType: 'PERCENTAGE',
            discountValue: 10,
            minimumOrderAmount: 100000,
            minOrderAmount: 100000,
            maxUsage: 100,
            usedCount: 15,
            startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            description: 'Giảm 10% cho khách hàng mới đăng ký',
            isActive: true,
            status: 'ACTIVE',
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            maxDiscountAmount: 50000
          },
          {
            id: 2,
            code: 'SUMMER50K',
            name: 'Ưu đãi mùa hè',
            discountType: 'FIXED',
            discountValue: 50000,
            minimumOrderAmount: 200000,
            minOrderAmount: 200000,
            maxUsage: 50,
            usedCount: 8,
            startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            description: 'Giảm 50K cho các dịch vụ spa mùa hè',
            isActive: true,
            status: 'ACTIVE',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            maxDiscountAmount: 0
          },
          {
            id: 3,
            code: 'BEAUTY20',
            name: 'Làm đẹp tiết kiệm',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            minimumOrderAmount: 300000,
            minOrderAmount: 300000,
            maxUsage: 30,
            usedCount: 12,
            startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            validTo: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            description: 'Giảm 20% cho các dịch vụ làm đẹp cao cấp',
            isActive: true,
            status: 'ACTIVE',
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            maxDiscountAmount: 100000
          }
        ];
      }

      // Lọc các coupon còn hiệu lực
      const activeCoupons = couponsData.filter((coupon) => {
        // Kiểm tra các trường có thể có
        const isActive = coupon.isActive !== false; // Default true nếu không có field
        const statusOk = !coupon.status || coupon.status === 'ACTIVE';
        
        // Kiểm tra ngày hết hạn - hỗ trợ cả validTo và endDate
        const expiryDate = coupon.validTo || coupon.endDate;
        const notExpired = expiryDate ? new Date(expiryDate) > new Date() : true;
        
        return isActive && statusOk && notExpired;
      });
      
      setCoupons(activeCoupons);
      
      if (activeCoupons.length === 0 && couponsData.length > 0) {
        message.info('Hiện tại không có mã giảm giá nào khả dụng');
      }
    } catch (error) {
      console.error("Error loading coupons:", error);
      message.warning("Đang sử dụng dữ liệu mẫu - Không thể kết nối đến server");
      
      // Fallback với dữ liệu mẫu
      const sampleCoupons = [
        {
          id: 1,
          code: 'WELCOME10',
          name: 'Chào mừng khách hàng mới',
          discountType: 'PERCENTAGE',
          discountValue: 10,
          minimumOrderAmount: 100000,
          minOrderAmount: 100000,
          description: 'Giảm 10% cho khách hàng mới đăng ký',
          validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isActive: true,
          status: 'ACTIVE',
          createdAt: new Date(),
          maxDiscountAmount: 50000
        },
        {
          id: 2,
          code: 'SUMMER50K',
          name: 'Ưu đãi mùa hè',
          discountType: 'FIXED',
          discountValue: 50000,
          minimumOrderAmount: 200000,
          minOrderAmount: 200000,
          description: 'Giảm 50K cho các dịch vụ spa mùa hè',
          validTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isActive: true,
          status: 'ACTIVE',
          createdAt: new Date(),
          maxDiscountAmount: 0
        }
      ];
      setCoupons(sampleCoupons);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort coupons
  const getFilteredCoupons = () => {
    let filtered = [...coupons];

    // Text search
    if (searchText) {
      filtered = filtered.filter(
        (coupon) =>
          coupon.code.toLowerCase().includes(searchText.toLowerCase()) ||
          coupon.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (coupon.description &&
            coupon.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((coupon) => coupon.discountType === typeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "value":
          if (a.discountType === "PERCENTAGE" && b.discountType === "PERCENTAGE") {
            return b.discountValue - a.discountValue;
          }
          if (a.discountType === "FIXED" && b.discountType === "FIXED") {
            return b.discountValue - a.discountValue;
          }
          return a.discountType === "PERCENTAGE" ? -1 : 1;        case "expiry":
          const aExpiry = a.validTo || a.endDate;
          const bExpiry = b.validTo || b.endDate;
          return new Date(aExpiry) - new Date(bExpiry);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    message.success(`Đã sao chép mã: ${code}`);
    setTimeout(() => setCopiedCode(""), 2000);
  };

  const handleUseCoupon = (coupon) => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để sử dụng mã giảm giá");
      navigate("/dang-nhap", { state: { from: "/khuyen-mai" } });
      return;
    }

    // Navigate to booking page with coupon info
    navigate("/dat-lich", {
      state: {
        couponCode: coupon.code,
        coupon: coupon,
      },
    });
  };

  const showCouponDetail = (coupon) => {
    setSelectedCoupon(coupon);
    setDetailModalVisible(true);
  };

  const getCouponTypeIcon = (type) => {
    return type === "PERCENTAGE" ? <PercentageOutlined /> : <DollarOutlined />;
  };

  const getCouponTypeColor = (type) => {
    return type === "PERCENTAGE" ? "#ff4d4f" : "#52c41a";
  };

  const formatDiscount = (coupon) => {
    if (coupon.discountType === "PERCENTAGE") {
      return `${coupon.discountValue}%`;
    }
    return formatCurrency(coupon.discountValue);
  };
  const getDaysUntilExpiry = (coupon) => {
    const now = new Date();
    const expiryDate = coupon.validTo || coupon.endDate;
    const expiry = new Date(expiryDate);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getExpiryStatus = (coupon) => {
    const days = getDaysUntilExpiry(coupon);
    if (days <= 3) {
      return { color: "red", text: `Còn ${days} ngày` };
    } else if (days <= 7) {
      return { color: "orange", text: `Còn ${days} ngày` };
    }
    return { color: "green", text: `Còn ${days} ngày` };
  };

  const filteredCoupons = getFilteredCoupons();

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Space direction="vertical" size="small">
            <div
              style={{
                fontSize: "48px",
                background: "linear-gradient(135deg, #FF99AC, #FFB6C1)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <GiftOutlined />
            </div>
            <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
              Mã Giảm Giá
            </Title>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Khám phá các ưu đãi hấp dẫn dành cho bạn
            </Text>
          </Space>
        </div>

        {/* Filters */}
        <Row gutter={[16, 16]} justify="center">
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="Tìm kiếm mã giảm giá..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Select
              value={typeFilter}
              onChange={setTypeFilter}
              style={{ width: "100%" }}
              placeholder="Loại giảm giá"
              suffixIcon={<FilterOutlined />}
            >
              <Option value="all">Tất cả</Option>
              <Option value="PERCENTAGE">Giảm theo %</Option>
              <Option value="FIXED">Giảm cố định</Option>
            </Select>
          </Col>
          <Col xs={24} sm={6} md={4}>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: "100%" }}
              placeholder="Sắp xếp"
            >
              <Option value="newest">Mới nhất</Option>
              <Option value="value">Giá trị giảm</Option>
              <Option value="expiry">Sắp hết hạn</Option>
            </Select>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadCoupons}
              loading={loading}
              style={{ width: "100%" }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Coupons Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
          <div style={{ marginTop: 16 }}>
            <Text>Đang tải mã giảm giá...</Text>
          </div>
        </div>
      ) : filteredCoupons.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Không có mã giảm giá nào"
        >
          <Button type="primary" onClick={() => navigate("/dich-vu")}>
            Khám phá dịch vụ
          </Button>
        </Empty>
      ) : (
        <Row gutter={[24, 24]}>
          {filteredCoupons.map((coupon) => {            const expiryStatus = getExpiryStatus(coupon);
            const isExpiringSoon = getDaysUntilExpiry(coupon) <= 7;

            return (
              <Col xs={24} sm={12} lg={8} xl={6} key={coupon.id}>
                <Badge.Ribbon
                  text={isExpiringSoon ? "Sắp hết hạn!" : "Khuyến mãi"}
                  color={isExpiringSoon ? "red" : "purple"}
                >
                  <Card
                    hoverable
                    style={{
                      height: "100%",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: `2px solid ${
                        isExpiringSoon ? "#ff7875" : "#d9d9d9"
                      }`,
                      boxShadow: isExpiringSoon
                        ? "0 4px 12px rgba(255, 77, 79, 0.2)"
                        : "0 2px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    bodyStyle={{ padding: "20px", height: "100%" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                      }}
                    >
                      {/* Header */}
                      <div style={{ marginBottom: 16 }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 8,
                          }}
                        >
                          <div
                            style={{
                              fontSize: "32px",
                              color: getCouponTypeColor(coupon.discountType),
                            }}
                          >
                            {getCouponTypeIcon(coupon.discountType)}
                          </div>
                          {isExpiringSoon && (
                            <FireOutlined
                              style={{ color: "#ff4d4f", fontSize: "20px" }}
                            />
                          )}
                        </div>
                        <Title
                          level={4}
                          style={{
                            margin: 0,
                            color: "#1890ff",
                            fontSize: "18px",
                          }}
                        >
                          {coupon.name}
                        </Title>
                      </div>

                      {/* Discount Value */}
                      <div
                        style={{
                          textAlign: "center",
                          marginBottom: 16,
                          padding: "16px",
                          background: "linear-gradient(135deg, #fff0f5, #f0f8ff)",
                          borderRadius: "8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "36px",
                            fontWeight: "bold",
                            color: getCouponTypeColor(coupon.discountType),
                            marginBottom: 4,
                          }}
                        >
                          {formatDiscount(coupon)}
                        </div>
                        <Text type="secondary" style={{ fontSize: "14px" }}>
                          {coupon.discountType === "PERCENTAGE"
                            ? "Giảm theo phần trăm"
                            : "Giảm cố định"}
                        </Text>
                      </div>

                      {/* Description */}
                      {coupon.description && (
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{
                            marginBottom: 16,
                            fontSize: "14px",
                            color: "#666",
                          }}
                        >
                          {coupon.description}
                        </Paragraph>
                      )}

                      {/* Conditions */}
                      <div style={{ marginBottom: 16, flex: 1 }}>
                        <Space direction="vertical" size="small" style={{ width: "100%" }}>                          {(coupon.minOrderAmount || coupon.minimumOrderAmount) > 0 && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <DollarOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                              <Text style={{ fontSize: "13px" }}>
                                Đơn tối thiểu: {formatCurrency(coupon.minOrderAmount || coupon.minimumOrderAmount)}
                              </Text>
                            </div>
                          )}
                          {coupon.maxDiscountAmount > 0 && coupon.discountType === "PERCENTAGE" && (
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <TagsOutlined style={{ color: "#1890ff", marginRight: 8 }} />
                              <Text style={{ fontSize: "13px" }}>
                                Giảm tối đa: {formatCurrency(coupon.maxDiscountAmount)}
                              </Text>
                            </div>
                          )}
                          <div style={{ display: "flex", alignItems: "center" }}>
                            <ClockCircleOutlined
                              style={{ color: expiryStatus.color, marginRight: 8 }}
                            />
                            <Text style={{ fontSize: "13px", color: expiryStatus.color }}>
                              {expiryStatus.text}
                            </Text>
                          </div>
                        </Space>
                      </div>

                      {/* Code */}
                      <div
                        style={{
                          background: "#f5f5f5",
                          padding: "12px",
                          borderRadius: "8px",
                          marginBottom: 16,
                          border: "1px dashed #d9d9d9",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              Mã giảm giá:
                            </Text>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                fontFamily: "monospace",
                                color: "#1890ff",
                              }}
                            >
                              {coupon.code}
                            </div>
                          </div>
                          <Tooltip title="Sao chép mã">
                            <Button
                              type="text"
                              size="small"
                              icon={
                                copiedCode === coupon.code ? (
                                  <CheckCircleOutlined style={{ color: "#52c41a" }} />
                                ) : (
                                  <CopyOutlined />
                                )
                              }
                              onClick={() => copyToClipboard(coupon.code)}
                            />
                          </Tooltip>
                        </div>
                      </div>

                      {/* Actions */}
                      <Space style={{ width: "100%" }}>
                        <Button
                          type="primary"
                          block
                          onClick={() => handleUseCoupon(coupon)}
                          style={{
                            background: "linear-gradient(135deg, #FF99AC, #FFB6C1)",
                            borderColor: "transparent",
                            fontWeight: "500",
                          }}
                        >
                          Sử dụng ngay
                        </Button>
                        <Button
                          type="default"
                          icon={<InfoCircleOutlined />}
                          onClick={() => showCouponDetail(coupon)}
                          style={{ flexShrink: 0 }}
                        />
                      </Space>
                    </div>
                  </Card>
                </Badge.Ribbon>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Coupon Detail Modal */}
      <Modal
        title={
          <Space>
            <GiftOutlined style={{ color: "#1890ff" }} />
            Chi tiết mã giảm giá
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="use"
            type="primary"
            onClick={() => {
              setDetailModalVisible(false);
              handleUseCoupon(selectedCoupon);
            }}
          >
            Sử dụng ngay
          </Button>,
        ]}
        width={600}
      >
        {selectedCoupon && (
          <div>
            <Alert
              message={`Giảm ${formatDiscount(selectedCoupon)}`}
              description={selectedCoupon.description}
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã giảm giá">
                <Space>
                  <Text code style={{ fontSize: "16px" }}>
                    {selectedCoupon.code}
                  </Text>
                  <Button
                    type="link"
                    size="small"
                    icon={<CopyOutlined />}
                    onClick={() => copyToClipboard(selectedCoupon.code)}
                  >
                    Sao chép
                  </Button>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Loại giảm giá">
                <Tag color={getCouponTypeColor(selectedCoupon.discountType)}>
                  {selectedCoupon.discountType === "PERCENTAGE"
                    ? "Giảm theo phần trăm"
                    : "Giảm cố định"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Giá trị giảm">
                {formatDiscount(selectedCoupon)}
              </Descriptions.Item>
              {selectedCoupon.minOrderAmount > 0 && (
                <Descriptions.Item label="Đơn hàng tối thiểu">
                  {formatCurrency(selectedCoupon.minOrderAmount)}
                </Descriptions.Item>
              )}
              {selectedCoupon.maxDiscountAmount > 0 &&
                selectedCoupon.discountType === "PERCENTAGE" && (
                  <Descriptions.Item label="Giảm tối đa">
                    {formatCurrency(selectedCoupon.maxDiscountAmount)}
                  </Descriptions.Item>
                )}              <Descriptions.Item label="Ngày hết hạn">
                <Space>
                  <Text>
                    {new Date(selectedCoupon.validTo || selectedCoupon.endDate).toLocaleDateString("vi-VN")}
                  </Text>
                  <Tag color={getExpiryStatus(selectedCoupon).color}>
                    {getExpiryStatus(selectedCoupon).text}
                  </Tag>
                </Space>
              </Descriptions.Item>
              {selectedCoupon.usageLimit > 0 && (
                <Descriptions.Item label="Giới hạn sử dụng">
                  {selectedCoupon.usageLimit} lượt
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            <Alert
              message="Hướng dẫn sử dụng"
              description={
                <div>
                  <p>1. Sao chép mã giảm giá phía trên</p>
                  <p>2. Chọn dịch vụ và đặt lịch hẹn</p>
                  <p>3. Nhập mã giảm giá trong bước thanh toán</p>
                  <p>4. Hoàn tất đặt lịch để áp dụng ưu đãi</p>
                </div>
              }
              type="success"
              style={{ marginTop: 16 }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CouponsView;
