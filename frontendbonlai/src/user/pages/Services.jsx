import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Row,
  Col,
  Breadcrumb,
  Select,
  Input,
  Space,
  Card,
  Tag,
  Rate,
  Empty,
  Button,
  Skeleton,
  message,
  Badge,
  Tooltip,
  Affix,
  Image,
  Statistic,
  Progress,
} from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  CalendarOutlined,
  HeartOutlined,
  EyeOutlined,
  StarOutlined,
  ShoppingOutlined,
  FireOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../../auth/customer/context/CustomerAuthContext";
import axios from "../../utils/axios";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageUtils";
import ServiceCard from "../components/ServiceCard";

const { Title, Text } = Typography;
const { Option } = Select;

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useCustomerAuth();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState("all");

  // Check if user is returning from booking page
  const { returnToBooking, selectedServices: existingServices } =
    location.state || {};

  // Fetch all services
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/products");
      console.log("Services response:", response);
      const servicesData = response.data || response;
      setServices(Array.isArray(servicesData) ? servicesData : []);
    } catch (error) {
      message.error("Không thể tải danh sách dịch vụ!");
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get("/api/categories");
      console.log("Categories response:", response);
      const categoriesData = response.data || response;
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Không thể tải danh mục dịch vụ!");
    }
  }, []);

  // Search services with debounce
  const searchServices = useCallback(
    async (keyword) => {
      if (!keyword.trim()) {
        await fetchServices();
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `/api/products/search?keyword=${keyword}`
        );
        console.log("Search response:", response);
        const servicesData = response.data || response;
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (error) {
        message.error("Lỗi khi tìm kiếm dịch vụ!");
        console.error("Error searching services:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchServices]
  );

  // Filter services by category
  const filterByCategory = useCallback(
    async (categoryId) => {
      if (!categoryId || categoryId === "all") {
        await fetchServices();
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(
          `/api/products/category/${categoryId}`
        );
        console.log("Category filter response:", response);
        const servicesData = response.data || response;
        setServices(Array.isArray(servicesData) ? servicesData : []);
      } catch (error) {
        message.error("Lỗi khi lọc dịch vụ theo danh mục!");
        console.error("Error filtering services:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchServices]
  ); // Handle service booking
  const handleBooking = useCallback(
    (service) => {
      if (!isLoggedIn) {
        navigate("/dang-nhap", { state: { from: "/dich-vu" } });
        return;
      }
      navigate(`/dich-vu/${service.id}`);
    },
    [isLoggedIn, navigate]
  );

  // Handle service detail view
  const handleViewDetail = useCallback(
    (service) => {
      navigate(`/dich-vu/${service.id}`);
    },
    [navigate]
  );

  // Handle search input with debounce
  const handleSearch = useCallback(
    (value) => {
      setSearchText(value);
      const timeoutId = setTimeout(() => {
        searchServices(value);
      }, 300); // Add 300ms debounce
      return () => clearTimeout(timeoutId);
    },
    [searchServices]
  );

  // Handle category change
  const handleCategoryChange = useCallback(
    (value) => {
      setSelectedCategory(value);
      filterByCategory(value);
    },
    [filterByCategory]
  );
  // useEffect for initial data load
  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []); // Remove dependencies to prevent infinite loops

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  // Filter and sort services locally
  const getFilteredAndSortedServices = () => {
    return services
      .filter((service) => {
        const matchesPriceRange =
          priceRange === "all" ||
          (priceRange === "0-500" && service.regularPrice < 500000) ||
          (priceRange === "500-1000" &&
            service.regularPrice >= 500000 &&
            service.regularPrice <= 1000000) ||
          (priceRange === "1000+" && service.regularPrice > 1000000);

        return matchesPriceRange;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.regularPrice - b.regularPrice;
          case "price-desc":
            return b.regularPrice - a.regularPrice;
          case "rating":
            return (b.rating || 0) - (a.rating || 0);
          default:
            return b.reviewCount - a.reviewCount;
        }
      });
  };

  // Sort options for services
  const sortOptions = [
    { value: "popular", label: "Phổ biến nhất" },
    { value: "price-asc", label: "Giá: Thấp đến cao" },
    { value: "price-desc", label: "Giá: Cao đến thấp" },
    { value: "rating", label: "Đánh giá cao nhất" },
  ];

  // Price range options
  const priceRanges = [
    { value: "all", label: "Tất cả mức giá" },
    { value: "0-500", label: "Dưới 500.000₫" },
    { value: "500-1000", label: "500.000₫ - 1.000.000₫" },
    { value: "1000+", label: "Trên 1.000.000₫" },
  ];

  const filteredServices = getFilteredAndSortedServices();

  return (
    <div style={{ animation: "fadeIn 0.5s ease" }}>      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            title: <HomeOutlined style={{ fontSize: "16px" }} />,
            href: "/",
          },
          {
            title: <span style={{ fontSize: "16px" }}>Dịch vụ</span>,
          },
        ]}
        style={{ marginBottom: 24, fontSize: "16px" }}
      />{" "}      {/* Page Title */}
      <Title level={2} style={{ marginBottom: 32, color: "#4A4A4A", fontSize: "28px" }}>
        Dịch Vụ Của Chúng Tôi
      </Title>
      {/* Return to Booking Banner */}
      {returnToBooking && (
        <Card
          style={{
            marginBottom: 24,
            backgroundColor: "#e6f7ff",
            border: "1px solid #91d5ff",
          }}
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong style={{ color: "#1890ff" }}>
              <CalendarOutlined /> Bạn đang thêm dịch vụ vào lịch đặt hiện tại
            </Text>
            <Text type="secondary">
              Đã chọn {existingServices?.length || 0} dịch vụ. Chọn thêm dịch vụ
              khác hoặc quay lại để hoàn tất đặt lịch.
            </Text>
            <Button
              type="primary"
              size="small"
              onClick={() =>
                navigate("/dat-lich", {
                  state: {
                    service: null,
                    selectedServices: existingServices,
                  },
                })
              }
            >
              Quay lại đặt lịch
            </Button>
          </Space>
        </Card>
      )}
      {/* Filters Section */}
      <Card
        style={{
          marginBottom: 24,
          borderColor: "#FFD1DC",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <Input.Search
                placeholder="Tìm kiếm dịch vụ..."
                prefix={<SearchOutlined style={{ color: "#FFB6C1", fontSize: "16px" }} />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onSearch={handleSearch}
                allowClear
                style={{ fontSize: "16px" }}
                size="large"
              />
            </Col>
            <Col xs={24} md={16}>
              <Space wrap>
                <Select
                  placeholder={
                    <>
                      <FilterOutlined /> Danh mục
                    </>
                  }
                  style={{ width: 200, fontSize: "16px" }}
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  size="large"
                >
                  <Option value="all">Tất cả danh mục</Option>
                  {categories.map((cat) => (
                    <Option key={cat.id} value={cat.id} style={{ fontSize: "16px" }}>
                      {cat.name}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder={
                    <>
                      <SortAscendingOutlined /> Sắp xếp theo
                    </>
                  }
                  style={{ width: 180, fontSize: "16px" }}
                  value={sortBy}
                  onChange={setSortBy}
                  size="large"
                >
                  {sortOptions.map((opt) => (
                    <Option key={opt.value} value={opt.value} style={{ fontSize: "16px" }}>
                      {opt.label}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder={
                    <>
                      <DollarOutlined /> Mức giá
                    </>
                  }
                  style={{ width: 200, fontSize: "16px" }}
                  value={priceRange}
                  onChange={setPriceRange}
                  size="large"
                >
                  {priceRanges.map((range) => (
                    <Option key={range.value} value={range.value} style={{ fontSize: "16px" }}>
                      {range.label}
                    </Option>
                  ))}
                </Select>
              </Space>
            </Col>
          </Row>          {/* Active Filters */}
          {(selectedCategory !== "all" ||
            priceRange !== "all" ||
            searchText) && (
            <Space wrap>
              {selectedCategory !== "all" && (
                <Tag
                  color="#FFB6C1"
                  closable
                  onClose={() => handleCategoryChange("all")}
                  style={{ color: "#4A4A4A", fontSize: "16px", padding: "6px 10px" }}
                >
                  Danh mục:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name ||
                    "Tất cả"}
                </Tag>
              )}
              {priceRange !== "all" && (
                <Tag
                  color="#FFB6C1"
                  closable
                  onClose={() => setPriceRange("all")}
                  style={{ color: "#4A4A4A", fontSize: "16px", padding: "6px 10px" }}
                >
                  Giá: {priceRanges.find((p) => p.value === priceRange)?.label}
                </Tag>
              )}
              {searchText && (
                <Tag
                  color="#FFB6C1"
                  closable
                  onClose={() => handleSearch("")}
                  style={{ color: "#4A4A4A", fontSize: "16px", padding: "6px 10px" }}
                >
                  Tìm kiếm: {searchText}
                </Tag>
              )}
            </Space>
          )}
        </Space>
      </Card>
      {/* Services Grid */}
      <Row gutter={[24, 24]}>
        {loading ? (
          // Loading skeletons
          [...Array(6)].map((_, index) => (
            <Col xs={24} sm={12} lg={8} key={`skeleton-${index}`}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
          ))
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service, index) => (
            <Col
              xs={24}
              sm={12}
              lg={8}
              key={service.id}
              style={{
                opacity: 0,
                animation: "fadeInUp 0.5s ease forwards",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <Card
                hoverable
                cover={
                  <img
                    alt={service.name}
                    src={
                      service.thumbnail || "https://via.placeholder.com/400x300"
                    }
                    style={{ height: 200, objectFit: "cover" }}
                    onClick={() => handleViewDetail(service)}
                  />
                }
                className="service-card"
              >
                <Space
                  direction="vertical"
                  size="small"
                  style={{ width: "100%" }}
                >                  <Title
                    level={4}
                    style={{
                      color: "#4A4A4A",
                      marginBottom: 4,
                      cursor: "pointer",
                      fontSize: "20px"
                    }}
                    onClick={() => handleViewDetail(service)}
                  >
                    {service.name}
                  </Title>
                  <Text type="secondary" ellipsis={{ rows: 2 }} style={{ fontSize: "18px" }}>
                    {service.description}
                  </Text>                  <Space
                    split={
                      <div
                        style={{ width: 1, background: "#FFD1DC", height: 14 }}
                      />
                    }
                  >
                    <Text strong style={{ color: "#FF99AC", fontSize: "20px" }}>
                      {formatPrice(service.regularPrice)}
                    </Text>
                    <Space>
                      <ClockCircleOutlined style={{ color: "#FFB6C1", fontSize: "16px" }} />
                      <Text style={{ fontSize: "16px" }}>{service.duration} phút</Text>
                    </Space>
                  </Space>                  <div>
                    <Rate
                      disabled
                      allowHalf
                      defaultValue={service.rating || 0}
                      style={{ fontSize: 16, color: "#FFB6C1" }}
                    />
                    <Text type="secondary" style={{ fontSize: "16px" }}>
                      {" "}
                      ({service.reviewCount || 0} đánh giá)
                    </Text>
                  </div>
                  {service.tags && service.tags.length > 0 && (
                    <Space wrap size={[0, 8]}>
                      {service.tags.map((tag) => (
                        <Tag
                          key={tag.id}
                          color="#FFE4E1"
                          style={{ color: "#4A4A4A", fontSize: "14px" }}
                        >
                          {tag.name}
                        </Tag>
                      ))}
                    </Space>
                  )}                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Button
                      type="text"
                      block
                      onClick={() => handleViewDetail(service)}
                      style={{ fontSize: "16px", height: "auto", padding: "6px 0" }}
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      type="primary"
                      icon={<CalendarOutlined />}
                      block
                      onClick={() => handleBooking(service)}
                      style={{ fontSize: "16px", height: "auto", padding: "8px 0" }}
                    >
                      Đặt Lịch Ngay
                    </Button>
                  </Space>
                </Space>
              </Card>
            </Col>
          ))
        ) : (
          <Col span={24}>
            <Empty
              description={
                <Text type="secondary">
                  {searchText
                    ? "Không tìm thấy dịch vụ phù hợp"
                    : "Chưa có dịch vụ nào"}
                </Text>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Col>
        )}
      </Row>
      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .service-card {
            border-color: #FFD1DC;
            transition: all 0.3s ease;
          }

          .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
        `}
      </style>
    </div>
  );
};

export default Services;
