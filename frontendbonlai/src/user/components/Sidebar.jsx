import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  Card,
  Tag,
  Space,
  Typography,
  Spin,
  Button,
  Divider,
  Tooltip,
  Badge,
} from "antd";
import {
  TagsOutlined,
  StarOutlined,
  GiftOutlined,
  FireOutlined,
  LoadingOutlined,
  RightOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  PercentageOutlined,
  CalendarOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import {
  fetchServices,
  getServicesByCategory,
} from "../../admin/pages/services/serviceAPI";

const { Text, Title } = Typography;

const Sidebar = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [popularServices, setPopularServices] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [featuredDeal, setFeaturedDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);

  // Hàm để lấy danh sách các danh mục con từ API
  const fetchChildCategories = async (parentId) => {
    try {
      const response = await axios.get(`/api/categories/${parentId}/children`);
      console.log(`Child categories for parent ${parentId}:`, response);

      // Chuyển đổi dữ liệu từ API sang định dạng Menu của Ant Design
      return Array.isArray(response)
        ? response
            .filter((child) => child.isActive) // Chỉ lấy danh mục đang hoạt động
            .map((child) => ({
              key: child.id,
              label: <span style={{ fontSize: "18px" }}>{child.name}</span>,
              icon: <TagsOutlined style={{ color: "#FFB6C1", fontSize: "18px" }} />,
            }))
        : [];
    } catch (error) {
      console.error(
        `Error fetching child categories for parent ${parentId}:`,
        error
      );
      return [];
    }
  };
  // Hàm để lấy tất cả danh mục gốc và con
  const fetchCategoriesWithChildren = async () => {
    try {
      // Lấy tất cả các danh mục
      const response = await axios.get("/api/categories");
      console.log("API Response for all categories:", response);

      if (!response) {
        console.error("Received null or undefined response");
        throw new Error("Không nhận được dữ liệu từ API");
      }

      // Lọc ra các danh mục gốc (parentId là null) và đang hoạt động
      const rootCategories = Array.isArray(response)
        ? response.filter((category) => !category.parentId && category.isActive)
        : [];

      console.log("Root categories:", rootCategories);

      const categoriesData = [];
      // Lấy danh mục con cho từng danh mục gốc
      for (const rootCategory of rootCategories) {
        const children = await fetchChildCategories(rootCategory.id);
        categoriesData.push({
          key: rootCategory.id,
          label: <span style={{ fontSize: "18px" }}>{rootCategory.name}</span>,
          icon: <TagsOutlined style={{ color: "#FFB6C1", fontSize: "18px" }} />,
          children: children.length > 0 ? children : null,
        });
      }

      console.log("Processed categories data:", categoriesData);
      setCategories(categoriesData);

      // Mở rộng danh mục đầu tiên nếu có
      if (categoriesData.length > 0) {
        setExpandedKeys([categoriesData[0].key]);
      }

      return categoriesData;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };

  // Fetch tất cả dữ liệu cho sidebar
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch data song song
      const [categoriesData, servicesData] = await Promise.all([
        fetchCategoriesWithChildren(),
        fetchServices(),
      ]);

      // Xử lý dữ liệu popular services
      if (Array.isArray(servicesData)) {
        const popularServicesData = calculatePopularServices(
          servicesData,
          []
        );
        setPopularServices(popularServicesData);
      }

      // Tạo special offers từ services có sale
      if (Array.isArray(servicesData)) {
        const offersData = generateSpecialOffers(servicesData);
        setSpecialOffers(offersData);
      }

      // Tạo featured deal
      if (Array.isArray(servicesData)) {
        const featuredData = generateFeaturedDeal(servicesData);
        setFeaturedDeal(featuredData);
      }
    } catch (error) {
      console.error("Error fetching sidebar data:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Gọi API khi component được mount
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Tính toán dịch vụ phổ biến từ orders
  const calculatePopularServices = (services, orders) => {
    const serviceStats = {};

    // Đếm số lần đặt cho mỗi service
    if (Array.isArray(orders)) {
      orders.forEach((order) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item) => {
            const serviceId = item.productId;
            if (serviceStats[serviceId]) {
              serviceStats[serviceId].count += item.quantity || 1;
            } else {
              serviceStats[serviceId] = { count: item.quantity || 1 };
            }
          });
        }
      });
    }

    // Lấy top 3 services phổ biến nhất
    return services
      .filter((service) => service.isActive !== false)
      .map((service) => ({
        ...service,
        orderCount: serviceStats[service.id]?.count || 0,
      }))
      .sort((a, b) => b.orderCount - a.orderCount)
      .slice(0, 3)
      .map((service) => ({
        id: service.id,
        name: service.name,
        price: formatPrice(service.salePrice || service.regularPrice),
        originalPrice: service.salePrice ? service.regularPrice : null,
        orderCount: service.orderCount,
        category: service.categories?.[0]?.name,
      }));
  };

  // Tạo special offers từ services có giảm giá
  const generateSpecialOffers = (services) => {
    return services
      .filter(
        (service) =>
          service.salePrice &&
          service.regularPrice &&
          service.salePrice < service.regularPrice
      )
      .sort((a, b) => {
        const discountA = (a.regularPrice - a.salePrice) / a.regularPrice;
        const discountB = (b.regularPrice - b.salePrice) / b.regularPrice;
        return discountB - discountA;
      })
      .slice(0, 3)
      .map((service) => {
        const discount = Math.round(
          ((service.regularPrice - service.salePrice) / service.regularPrice) *
            100
        );
        return {
          id: service.id,
          name: service.name,
          discount: `${discount}% GIẢM`,
          description: `Từ ${formatPrice(
            service.regularPrice
          )} còn ${formatPrice(service.salePrice)}`,
        };
      });
  };

  // Tạo featured deal từ service có giảm giá cao nhất
  const generateFeaturedDeal = (services) => {
    const bestDeal = services
      .filter(
        (service) =>
          service.salePrice &&
          service.regularPrice &&
          service.salePrice < service.regularPrice
      )
      .sort((a, b) => {
        const discountA = a.regularPrice - a.salePrice;
        const discountB = b.regularPrice - b.salePrice;
        return discountB - discountA;
      })[0];

    if (bestDeal) {
      const savings = bestDeal.regularPrice - bestDeal.salePrice;
      return {
        id: bestDeal.id,
        name: bestDeal.name,
        description: bestDeal.description || "Ưu đãi đặc biệt có thời hạn!",
        savings: formatPrice(savings),
        originalPrice: formatPrice(bestDeal.regularPrice),
        salePrice: formatPrice(bestDeal.salePrice),
      };
    }
    return null;
  };

  // Format giá tiền
  const formatPrice = (price) => {
    if (!price) return "0₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };  const CardTitle = ({ icon, children }) => (
    <Space align="center">
      {icon}{" "}
      <Text strong style={{ color: "#4A4A4A", fontSize: "24px" }}>
        {children}
      </Text>
    </Space>
  );
  const onExpand = (keys) => {
    setExpandedKeys(keys);
  };

  // Handle navigation
  const handleCategoryClick = (categoryId) => {
    navigate(`/dich-vu?category=${categoryId}`);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/dich-vu/${serviceId}`);
  };

  const handleBookingClick = () => {
    navigate("/dat-lich");
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {/* Categories Menu */}
      <Card
        title={
          <CardTitle icon={<TagsOutlined style={{ color: "#FFB6C1" }} />}>
            Danh Mục
          </CardTitle>
        }
        size="small"
        style={{
          background: "#FFFFFF",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #FFD1DC",
        }}
        bodyStyle={{ padding: "16px 0" }}
        headStyle={{ background: "#FFD1DC", borderBottom: "none" }}
      >
        {loading ? (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <Spin
              indicator={                      <LoadingOutlined style={{ color: "#FFB6C1", fontSize: "22px" }} spin />}
            />
          </div>
        ) : error ? (
          <div
            style={{ padding: "20px", textAlign: "center", color: "#FF6B6B", fontSize: "18px" }}
          >
            {error}
          </div>
        ) : (          <Menu
            mode="inline"
            items={categories}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "18px"
            }}
            expandedKeys={expandedKeys}
            onOpenChange={onExpand}
            onClick={({ key }) => {
              // Navigate to services page with category filter
              handleCategoryClick(key);
            }}
          />
        )}
      </Card>{" "}
      {/* Popular Services */}
      <Card
        title={          <CardTitle icon={<StarOutlined style={{ color: "#FFB6C1" }} />}>
            Dịch Vụ Phổ Biến
          </CardTitle>
        }
        size="small"
        style={{
          background: "#FFF",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #FFD1DC",
          boxShadow: "0 4px 12px rgba(255, 182, 193, 0.1)",
        }}
        bodyStyle={{ padding: "16px 0" }}
        headStyle={{ background: "#FFD1DC", borderBottom: "none" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {popularServices.length > 0 ? (
            popularServices.map((service, index) => (
              <div
                key={service.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderBottom:
                    index < popularServices.length - 1
                      ? "1px dashed #FFD1DC"
                      : "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                className="service-item"
                onClick={() => handleServiceClick(service.id)}
              >
                <div style={{ flex: 1 }}>                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Text style={{ fontSize: "18px", fontWeight: "500" }}>
                      {service.name}
                    </Text>
                    {service.orderCount > 0 && (                      <Badge
                        count={service.orderCount}
                        size="small"
                        style={{ backgroundColor: "#FFB6C1", fontSize: "16px" }}
                      />
                    )}
                  </div>
                  {service.category && (                  <Text type="secondary" style={{ fontSize: "18px" }}>
                      {service.category}
                    </Text>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                  }}
                >                  {service.originalPrice && (
                    <Text delete type="secondary" style={{ fontSize: "18px" }}>
                      {formatPrice(service.originalPrice)}
                    </Text>
                  )}
                  <Tag
                    color="#FF99AC"
                    style={{                      color: "#fff",
                      borderRadius: "12px",
                      padding: "4px 14px",
                      margin: 0,
                      fontSize: "18px"
                    }}
                  >
                    {service.price}
                  </Tag>
                </div>
              </div>
            ))          ) : (
            <div style={{ textAlign: "center", padding: "20px" }}>
              <Text type="secondary" style={{ fontSize: "18px" }}>Đang cập nhật dịch vụ...</Text>
            </div>
          )}
        </Space>
      </Card>{" "}
      {/* Special Offers */}
      <Card
        title={          <CardTitle icon={<GiftOutlined style={{ color: "#FFB6C1" }} />}>
            Ưu Đãi Đặc Biệt
          </CardTitle>
        }
        size="small"
        style={{
          background: "#FFF",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #FFD1DC",
          boxShadow: "0 4px 12px rgba(255, 182, 193, 0.1)",
        }}
        bodyStyle={{ padding: "16px 0" }}
        headStyle={{ background: "#FFD1DC", borderBottom: "none" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">
          {specialOffers.length > 0 ? (
            specialOffers.map((offer, index) => (
              <div
                key={offer.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 16px",
                  borderBottom:
                    index < specialOffers.length - 1
                      ? "1px dashed #FFD1DC"
                      : "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
                className="offer-item"
                onClick={() => handleServiceClick(offer.id)}
              >
                <div style={{ flex: 1 }}>                <Text style={{ fontSize: "18px", fontWeight: "500" }}>
                  {offer.name}
                </Text>
                {offer.description && (
                  <div>                    <Text type="secondary" style={{ fontSize: "18px" }}>
                      {offer.description}
                    </Text>
                  </div>
                )}
                </div>                <Tag
                  color="#FF99AC"
                  style={{                    color: "#FFF",
                    borderRadius: "12px",
                    padding: "4px 14px",
                    fontSize: "18px"
                  }}
                >
                  {offer.discount}
                </Tag>
              </div>
            ))
          ) : (            <div style={{ textAlign: "center", padding: "20px" }}>
              <Text type="secondary" style={{ fontSize: "18px" }}>Chưa có ưu đãi nào</Text>
            </div>
          )}
        </Space>
      </Card>{" "}
      {/* Featured Deal */}
      {featuredDeal && (
        <Card
          style={{
            background: "linear-gradient(135deg, #FFF0F5 0%, #FFE6EE 100%)",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #FFB6C1",
            boxShadow: "0 4px 12px rgba(255, 182, 193, 0.2)",
          }}
          bodyStyle={{ padding: "20px" }}
          hoverable
          onClick={() => handleServiceClick(featuredDeal.id)}
        >
          <Space direction="vertical" align="center" style={{ width: "100%" }}>
            <div
              style={{
                background: "#FF99AC",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px",
              }}
            >
              <FireOutlined style={{ fontSize: "24px", color: "#FFF" }} />
            </div>            <Title              level={5}
              style={{
                margin: "0 0 8px",
                color: "#4A4A4A",
                textAlign: "center",
                fontSize: "24px"
              }}
            >
              {featuredDeal.name}
            </Title>

            <Text
              style={{
                color: "#666666",
                textAlign: "center",
                marginBottom: "12px",
                fontSize: "18px"
              }}
            >
              {featuredDeal.description}
            </Text>            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <Text delete type="secondary" style={{ fontSize: "18px" }}>
                {featuredDeal.originalPrice}
              </Text>
              <br />              <Text strong style={{ fontSize: "24px", color: "#FF99AC" }}>
                {featuredDeal.salePrice}
              </Text>
            </div>

            <Tag
              color="#FF99AC"
              style={{                color: "#FFF",
                padding: "8px 16px",
                borderRadius: "12px",
                fontSize: "18px",
              }}
            >
              <HeartOutlined /> Tiết kiệm {featuredDeal.savings}
            </Tag>            <Button
              type="primary"
              style={{                marginTop: "16px",
                background: "#FF99AC",
                borderColor: "#FF99AC",
                borderRadius: "8px",
                height: "44px",
                fontSize: "18px",
                padding: "0 20px"
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleServiceClick(featuredDeal.id);
              }}
            >
              Xem Chi Tiết <RightOutlined />
            </Button>
          </Space>
        </Card>
      )}
      {/* Quick Actions */}
      <Card
        title={
          <CardTitle icon={<CalendarOutlined style={{ color: "#FFB6C1" }} />}>
            Thao Tác Nhanh
          </CardTitle>
        }
        size="small"
        style={{
          background: "#FFF",
          borderRadius: "12px",
          overflow: "hidden",
          border: "1px solid #FFD1DC",
          boxShadow: "0 4px 12px rgba(255, 182, 193, 0.1)",
        }}
        bodyStyle={{ padding: "16px" }}
        headStyle={{ background: "#FFD1DC", borderBottom: "none" }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="middle">          <Button
            type="primary"
            block
            size="large"
            style={{
              background: "linear-gradient(45deg, #FF99AC, #FFB6C1)",
              borderColor: "#FF99AC",              borderRadius: "8px",
              height: "48px",
              fontWeight: "600",
              fontSize: "18px"
            }}
            onClick={handleBookingClick}
          >
            <CalendarOutlined /> Đặt Lịch Ngay
          </Button>

          <Button
            block
            size="large"
            style={{
              borderColor: "#FFB6C1",
              borderRadius: "8px",              height: "44px",
              color: "#FF99AC",
              fontSize: "18px"
            }}
            onClick={() => navigate("/dich-vu")}
          >
            <StarOutlined /> Xem Tất Cả Dịch Vụ
          </Button>
        </Space>
      </Card>{" "}
      <style jsx>{`
        .service-item:hover,
        .offer-item:hover {
          transform: translateX(5px);
          background-color: rgba(255, 182, 193, 0.1);
        }

        .service-item:hover .ant-typography,
        .offer-item:hover .ant-typography {
          color: #ff99ac !important;
        }

        .ant-menu-item:hover {
          background-color: rgba(255, 182, 193, 0.1) !important;
        }

        .ant-menu-submenu-title:hover {
          background-color: rgba(255, 182, 193, 0.1) !important;
        }
      `}</style>
    </Space>
  );
};

export default Sidebar;
