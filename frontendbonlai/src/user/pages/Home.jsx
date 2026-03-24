"use client";

import { useEffect, useState, useCallback } from "react";
import './Home.css';
import {
  Typography,
  Row,
  Col,
  Carousel,
  Button,
  Input,
  Card,
  Rate,
  Avatar,
  Statistic,
  Badge,
  Spin,
  message,
  Image,
  Space,
  Tag,
  Divider,
  Alert,
  Progress,
} from "antd";
import {
  MailOutlined,
  CalendarOutlined,
  ArrowRightOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  CheckCircleOutlined,
  UserOutlined,
  StarOutlined,
  TrophyOutlined,
  SafetyOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  TeamOutlined,
  CrownOutlined,
  FireOutlined,
  GiftOutlined,
  ThunderboltOutlined,
  EnvironmentOutlined,
  CustomerServiceOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../auth/customer/context/CustomerAuthContext";
import {
  fetchServices,
  getServicesByCategory,
} from "../../admin/pages/services/serviceAPI";
import { categoryAPI } from "../../admin/pages/categories/categoryAPI";
import {
  getAllOrders,
  APPOINTMENT_STATUS,
} from "../../admin/pages/orders/orderAPI";
import { getCustomers } from "../../admin/pages/customers/customerAPI";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageUtils";

const { Title, Text, Paragraph } = Typography;

const Home = ({ onMount }) => {
  const navigate = useNavigate();
  const { isLoggedIn } = useCustomerAuth();
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  
  // Data states - Giữ nguyên structure gốc
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesWithServices, setCategoriesWithServices] = useState([]);
  const [statistics, setStatistics] = useState({
    totalCustomers: 0,
    totalAppointments: 0,
    completedAppointments: 0,
    totalServices: 0,
  });
  const [topServices, setTopServices] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🐛 DEBUG: Home component mounting, onMount:", onMount);
    if (onMount) onMount();
    loadHomeData();
  }, []);

  // Load all data for homepage - Giữ nguyên logic gốc
  const loadHomeData = useCallback(async () => {
    console.log("🐛 DEBUG: Starting loadHomeData function");
    try {
      setLoading(true);

      // Load basic data first
      console.log("Loading basic data...");
      const [servicesRes, categoriesRes, appointmentsRes, customersRes] =
        await Promise.all([
          fetchServices().catch((err) => {
            console.error("Error fetching services:", err);
            return [];
          }),
          categoryAPI.getAllCategories().catch((err) => {
            console.error("Error fetching categories:", err);
            return [];
          }),
          getAllOrders().catch((err) => {
            console.error("Error fetching appointments:", err);
            return [];
          }),
          getCustomers().catch((err) => {
            console.error("Error fetching customers:", err);
            return [];
          }),
        ]);

      console.log("API Responses:", {
        servicesRes,
        categoriesRes,
        appointmentsRes,
        customersRes,
      });

      // Process services data - Giữ lại để tính toán top services
      const servicesData = Array.isArray(servicesRes) ? servicesRes : [];
      setServices(servicesData);
      console.log("Services data:", servicesData);

      // Process categories data
      const categoriesData = Array.isArray(categoriesRes) ? categoriesRes : [];
      setCategories(categoriesData);
      console.log("Categories data:", categoriesData);

      // Load services for each category - Thêm logic này
      if (categoriesData.length > 0) {
        console.log("Loading services for each category...");
        const categoriesWithServicesData = await Promise.all(
          categoriesData.slice(0, 4).map(async (category) => {
            try {
              console.log(
                `Loading services for category ${category.id}: ${category.name}`
              );
              const categoryServices = await getServicesByCategory(category.id);
              console.log(
                `Services for category ${category.id}:`,
                categoryServices
              );

              const servicesArray = Array.isArray(categoryServices)
                ? categoryServices
                : [];
              return {
                ...category,
                services: servicesArray.slice(0, 4), // Show 4 services per category
                serviceCount: servicesArray.length,
              };
            } catch (error) {
              console.error(
                `Error loading services for category ${category.id}:`,
                error
              );
              return {
                ...category,
                services: [],
                serviceCount: 0,
              };
            }
          })
        );
        console.log("Categories with services:", categoriesWithServicesData);
        setCategoriesWithServices(categoriesWithServicesData);
      } else {
        console.log("No categories found, setting empty array");
        setCategoriesWithServices([]);
      }

      // Process appointments data
      const appointmentsData = Array.isArray(appointmentsRes)
        ? appointmentsRes
        : [];

      // Process customers data
      const customersData = Array.isArray(customersRes) ? customersRes : [];

      // Calculate statistics
      const stats = calculateStatistics(
        appointmentsData,
        customersData,
        servicesData
      );
      setStatistics(stats);

      // Calculate top services
      const topServicesData = calculateTopServices(
        appointmentsData,
        servicesData
      );
      setTopServices(topServicesData);

      // Generate mock testimonials data
      const testimonialsData = generateTestimonials();
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error("Error loading home data:", error);
      message.error("Không thể tải dữ liệu trang chủ!");
    } finally {
      console.log("🐛 DEBUG: Finished loading home data");
      setLoading(false);
    }
  }, []);

  // Calculate statistics from real data
  const calculateStatistics = (appointments, customers, services) => {
    const completedCount = appointments.filter(
      (apt) => (apt.statusCode || apt.status) === APPOINTMENT_STATUS.COMPLETED
    ).length;

    return {
      totalCustomers: customers.length,
      totalAppointments: appointments.length,
      completedAppointments: completedCount,
      totalServices: services.length,
      satisfactionRate:
        completedCount > 0
          ? Math.round((completedCount / appointments.length) * 100)
          : 98,
    };
  };

  // Calculate top services from appointments data
  const calculateTopServices = (appointments, services) => {
    const serviceCount = {};

    appointments.forEach((appointment) => {
      if (appointment.items && Array.isArray(appointment.items)) {
        appointment.items.forEach((item) => {
          const serviceId = item.productId;
          serviceCount[serviceId] =
            (serviceCount[serviceId] || 0) + item.quantity;
        });
      }
    });

    // Map service IDs to service details and sort by popularity
    return services
      .map((service) => ({
        ...service,
        bookingCount: serviceCount[service.id] || 0,
      }))
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 4);
  };

  // Generate mock testimonials data
  const generateTestimonials = () => {
    const mockTestimonials = [
      {
        id: 1,
        name: "Nguyễn Thị Lan",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        comment: "Dịch vụ massage toàn thân tại đây thật sự tuyệt vời! Tôi cảm thấy thư giãn hoàn toàn sau liệu trình. Nhân viên rất chuyên nghiệp và thân thiện. Chắc chắn sẽ quay lại!"
      },
      {
        id: 2,
        name: "Trần Minh Hoàng",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        comment: "Spa có không gian rất đẹp và yên tĩnh. Liệu trình chăm sóc da mặt giúp da tôi sáng mịn hơn rất nhiều. Giá cả hợp lý, sẽ giới thiệu cho bạn bè!"
      },
      {
        id: 3,
        name: "Phạm Thu Hương",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        comment: "Đây là lần đầu tiên tôi trải nghiệm dịch vụ spa và tôi thực sự ấn tượng. Từ không gian, dịch vụ đến thái độ phục vụ đều rất tuyệt vời. Cảm ơn team spa!"
      },
      {
        id: 4,
        name: "Lê Văn Đức",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        rating: 4,
        comment: "Massage thư giãn giúp tôi giảm stress sau những ngày làm việc căng thẳng. Kỹ thuật viên có tay nghề cao, biết cách xử lý các điểm căng cơ."
      },
      {
        id: 5,
        name: "Vũ Thị Mai",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        rating: 5,
        comment: "Liệu trình làm đẹp tại spa rất chuyên nghiệp. Sản phẩm được sử dụng đều là hàng cao cấp, an toàn cho da. Tôi sẽ đặt lịch thường xuyên!"
      }
    ];

    // Randomly select 3 testimonials
    const shuffled = mockTestimonials.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  // Hàm xử lý khi nhấn nút đặt lịch
  const handleBooking = () => {
    if (isLoggedIn) {
      navigate("/lich-hen");
    } else {
      navigate("/dang-nhap", { state: { from: "/lich-hen" } });
    }
  };

  // Hàm xử lý khi click vào service card - THÊM MỚI
  const handleServiceClick = (serviceId) => {
    navigate(`/dich-vu/${serviceId}`);
  };

  // Format price helper
  const formatPrice = (service) => {
    // Check different possible price fields
    const price = service?.price || service?.basePrice || service?.cost || 0;
    
    if (price === 0) {
      return "Xem Chi Tiết";
    }
    
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Dynamic carousel items based on top services
  const getCarouselItems = () => {
    if (topServices.length > 0) {
      return [
        {
          title: "Chào Mừng Đến Với Spa Của Chúng Tôi",
          subtitle:
            "Khám phá sự bình yên và thư giãn với các dịch vụ cao cấp của chúng tôi",
          image:
            "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&h=1080&fit=crop&crop=center",
          buttonText: "Đặt Lịch Ngay",
        },
       
        {
          title: "Ưu Đãi Đặc Biệt",
          subtitle:
            "Giảm 20% cho tất cả các liệu pháp massage. Thời gian có hạn!",
          image:
            "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920&h=1080&fit=crop&crop=center",
          buttonText: "Đặt Lịch Ngay",
        },
      ];
    }
    
    // Fallback carousel items
    return [
      {
        title: "Chào Mừng Đến Với Spa Của Chúng Tôi",
        subtitle:
          "Khám phá sự bình yên và thư giãn với các dịch vụ cao cấp của chúng tôi",
        image:
          "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=1920&h=1080&fit=crop&crop=center",
        buttonText: "Đặt Lịch Ngay",
      },
      {
        title: "Ưu Đãi Mùa Hè Đặc Biệt",
        subtitle: "Giảm 20% cho tất cả các liệu pháp massage",
        image:
          "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&h=1080&fit=crop&crop=center",
        buttonText: "Tìm Hiểu Thêm",
      },
    ];
  };

  const carouselItems = getCarouselItems();
  
  // Preload carousel images for better performance
  useEffect(() => {
    carouselItems.forEach(item => {
      const imgElement = document.createElement('img');
      imgElement.src = item.image;
    });
  }, [carouselItems]);

  // Why choose us data
  const whyChooseUs = [
    {
      icon: <CheckCircleOutlined />,
      title: "Chất Lượng Cao Cấp",
      description:
        "Chúng tôi chỉ sử dụng các sản phẩm và thiết bị cao cấp nhất",
    },
    {
      icon: <UserOutlined />,
      title: "Chuyên Gia Giàu Kinh Nghiệm",
      description:
        "Đội ngũ nhân viên được đào tạo chuyên nghiệp và có nhiều năm kinh nghiệm",
    },
    {
      icon: <HeartOutlined />,
      title: "Không Gian Thư Giãn",
      description:
        "Môi trường yên tĩnh và sang trọng giúp bạn thư giãn hoàn toàn",
    },
  ];

  return (
    <div className="home-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <Spin size="large" />
            <div className="loading-text">Đang tải dữ liệu spa...</div>
          </div>
        </div>
      )}

      {/* Hero Section with Carousel - Giữ nguyên */}
      <div className="hero-section">
        <Carousel
          autoplay
          effect="fade"
          dots={true}
          afterChange={setActiveCarouselIndex}
          dotPosition="bottom"
          autoplaySpeed={5000}
          pauseOnHover={false}
        >
          {carouselItems.map((item, index) => (
            <div key={index}>
              <div className="hero-slide">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="hero-image"
                />
                <div
                  className={`hero-content ${
                    activeCarouselIndex === index
                      ? "hero-content--active"
                      : "hero-content--inactive"
                  }`}
                >
                  <Title className="hero-title">{item.title}</Title>
                  <Paragraph className="hero-subtitle">
                    {item.subtitle}
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    icon={<CalendarOutlined />}
                    onClick={handleBooking}
                    className="hero-button"
                  >
                    {item.buttonText}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>

      {/* Most Popular Services Section - Giữ nguyên + thêm one-click */}
      <div className="home-section home-section--white">
        <div className="home-content">
          <Title level={2} className="section-title">
            <FireOutlined />
            Dịch Vụ Được Yêu Thích 
          </Title>
          <Paragraph className="section-subtitle">
            Những dịch vụ được khách hàng lựa chọn nhiều tại spa của chúng
            tôi
          </Paragraph>

          {loading ? (
            <div className="loading-section">
              <Spin size="large" />
              <div className="loading-text">Đang tải dịch vụ phổ biến...</div>
            </div>
          ) : topServices.length > 0 ? (
            <Row gutter={[24, 24]} justify="center">
              {topServices.map((service, index) => (
                <Col xs={24} sm={12} md={6} key={service.id}>                  <Card
                    hoverable
                    className={`popular-service-card ${
                      index === 0 ? "popular-service-card--top" : ""
                    }`}
                    onClick={() => handleServiceClick(service.id)} // THÊM ONE-CLICK
                    style={{ 
                      cursor: 'pointer',
                      border: `1px solid ${index === 0 ? '#FFD700' : '#f0f0f0'}`,
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}
                    cover={
                      <div className="popular-service-cover">
                        <img
                          alt={service.name}
                          src={
                            service.images && service.images.length > 0
                              ? getImageUrl(service.images[0])
                              : getPlaceholderImage()
                          }
                          className="popular-service-image"
                        />
                        {/* Ranking badge */}
                        {index < 3 && (
                          <div className="ranking-badge">
                            <CrownOutlined />
                            Top {index + 1}
                          </div>
                        )}
                        {/* Booking count badge */}
                        {service.bookingCount > 0 && (
                          <div className="booking-count-badge">
                            {service.bookingCount} lượt đặt
                          </div>
                        )}
                      </div>
                    }
                    actions={[
                      <Button
                        type="primary"
                        icon={<CalendarOutlined />}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent card click
                          handleServiceClick(service.id);
                        }}
                        style={{ 
                          backgroundColor: "#FF99AC",
                          borderColor: "#FF99AC",
                          width: "100%"
                        }}
                      >
                        Đặt Lịch
                      </Button>,
                    ]}
                  >                    <Card.Meta
                      title={
                        <div className="popular-service-title">
                          <Text strong style={{ fontSize: "20px" }}>{service.name}</Text>
                          {index === 0 && (
                            <Badge
                              count="Phổ biến nhất"
                              style={{
                                backgroundColor: "#FF99AC",
                                fontSize: "14px",
                                height: "22px",
                                lineHeight: "22px",
                              }}
                            />
                          )}
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph
                            ellipsis={{ rows: 2 }}
                            className="service-description"
                            style={{ fontSize: "18px", marginBottom: "14px" }}
                          >
                            {service.description}
                          </Paragraph>
                          <div className="service-price">
                            <Text strong style={{ color: "#FF99AC", fontSize: "20px" }}>
                              {formatPrice(service)}
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="empty-section">
              <Text type="secondary">Chưa có dữ liệu dịch vụ phổ biến</Text>
            </div>
          )}
        </div>
      </div>

      {/* Services by Categories Section - THAY THẾ "Một số dịch vụ" */}
      <div className="home-section home-section--gray">
        <div className="home-content">          <Title level={2} className="section-title">
            <AppstoreOutlined />
            Danh Mục Dịch Vụ
          </Title>
          <Paragraph className="section-subtitle" style={{ fontSize: '20px' }}>
            Khám phá đa dạng các dịch vụ theo từng danh mục chuyên biệt
          </Paragraph>

          {loading ? (
            <div className="loading-section">
              <Spin size="large" />
              <div className="loading-text">Đang tải danh mục dịch vụ...</div>
            </div>
          ) : categoriesWithServices.length > 0 ? (
            <div className="categories-section">
              {categoriesWithServices.map((category, categoryIndex) => (
                <div key={category.id} className="category-block" style={{ marginBottom: '60px' }}>
                  {/* Category Header */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '24px',
                    padding: '20px',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: '4px solid #FF99AC'
                  }}>
                    <div>                      <Title level={3} style={{ margin: '0 0 8px 0', color: '#2c3e50', fontSize: '26px' }}>
                        {category.name}
                      </Title>
                      <Text type="secondary" style={{ fontSize: '20px' }}>
                        {category.description || "Khám phá các dịch vụ tuyệt vời trong danh mục này"}
                      </Text>
                      
                    </div>                    <Button
                      type="primary"
                      onClick={() => navigate(`/dich-vu?category=${category.id}`)}
                      style={{ 
                        backgroundColor: "#FF99AC",
                        borderColor: "#FF99AC",
                        fontWeight: '500'
                      }}
                      icon={<ArrowRightOutlined />}
                    >
                      Xem tất cả
                    </Button>
                  </div>

                  {/* Services Grid */}
                  {category.services.length > 0 ? (
                    <Row gutter={[20, 20]}>
                      {category.services.map((service) => (
                        <Col xs={24} sm={12} md={6} key={service.id}>                          <Card
                            hoverable
                            onClick={() => handleServiceClick(service.id)} // THÊM ONE-CLICK
                            style={{
                              borderRadius: '12px',
                              overflow: 'hidden',
                              border: '1px solid #f0f0f0',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                              transition: 'all 0.3s ease',
                              height: '100%',
                              cursor: 'pointer'
                            }}
                            cover={
                              <div style={{ height: '160px', overflow: 'hidden' }}>
                                <img
                                  alt={service.name}
                                  src={
                                    service.images && service.images.length > 0
                                      ? getImageUrl(service.images[0])
                                      : getPlaceholderImage()
                                  }
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease'
                                  }}
                                />
                              </div>
                            }                            actions={[
                              <Button
                                type="primary"
                                icon={<CalendarOutlined />}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent card click
                                  handleServiceClick(service.id);
                                }}
                                style={{ 
                                  backgroundColor: "#FF99AC",
                                  borderColor: "#FF99AC",
                                  width: "100%"
                                }}
                              >
                                Đặt Lịch
                              </Button>,
                            ]}
                          >                            <Card.Meta
                              title={
                                <Text strong style={{ fontSize: '20px' }}>
                                  {service.name}
                                </Text>
                              }
                              description={
                                <div>
                                  <Paragraph
                                    ellipsis={{ rows: 2 }}
                                    style={{ marginBottom: '12px', color: '#666', fontSize: '18px' }}
                                  >
                                    {service.description}
                                  </Paragraph>
                                  <div style={{ textAlign: 'right' }}>
                                    <Text strong style={{ color: "#FF99AC", fontSize: '20px' }}>
                                      {formatPrice(service)}
                                    </Text>
                                  </div>
                                </div>
                              }
                            />
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px',
                      background: 'white',
                      borderRadius: '12px',
                      border: '2px dashed #d9d9d9'
                    }}>
                      <Text type="secondary">Danh mục này chưa có dịch vụ nào</Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: 'white',
              borderRadius: '12px',
              border: '2px dashed #d9d9d9'
            }}>
              <Text type="secondary">Chưa có dữ liệu danh mục dịch vụ</Text>
            </div>
          )}      </div>
      </div>

      {/* Why Choose Us Section - Giữ nguyên */}
      <div className="home-section home-section--gray">
        <div className="home-content">
          <Title level={2} className="section-title">
            <SafetyOutlined />
            Tại Sao Chọn Chúng Tôi?
          </Title>
          <Row gutter={[32, 32]} justify="center">
            {whyChooseUs.map((item, index) => (
              <Col xs={24} md={8} key={index}>                <Card className="why-choose-card" hoverable>
                  <div className="why-choose-icon">{item.icon}</div>
                  <Title level={4} style={{ fontSize: '24px' }}>{item.title}</Title>
                  <Paragraph style={{ fontSize: '18px' }}>{item.description}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Testimonials Section - Giữ nguyên */}
      <div className="home-section home-section--white">
        <div className="home-content">
          <Title level={2} className="section-title">
            <StarOutlined />
            Khách Hàng Nói Gì Về Chúng Tôi
          </Title>
          <Row gutter={[24, 24]} justify="center">
            {testimonials.map((testimonial) => (
              <Col xs={24} md={8} key={testimonial.id}>
                <Card className="testimonial-card">
                  <div className="testimonial-header">                    <Avatar
                      size={64}
                      src={testimonial.avatar}
                      icon={<UserOutlined />}
                    />
                    <div className="testimonial-info">
                      <Title level={5} style={{ fontSize: '20px' }}>{testimonial.name}</Title>
                      <Rate disabled defaultValue={testimonial.rating} />
                    </div>
                  </div>
                  <Paragraph className="testimonial-comment" style={{ fontSize: '18px' }}>
                    "{testimonial.comment}"
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Newsletter Section - Giữ nguyên */}
      <div className="home-section home-section--primary">
        <div className="home-content">          <Title level={2} className="section-title section-title--white">
            <MailOutlined />
            Đăng Ký Nhận Tin Khuyến Mãi
          </Title>
          <Paragraph className="section-subtitle section-subtitle--white" style={{ fontSize: '20px' }}>
            Nhận thông tin về các ưu đãi đặc biệt và dịch vụ mới
          </Paragraph>
          <div className="newsletter-form">
            <Input.Group compact>
              <Input
                style={{ width: "70%" }}
                placeholder="Nhập email của bạn"
                size="large"
              />
              <Button type="primary" size="large" style={{ width: "30%" }}>
                Đăng Ký
              </Button>
            </Input.Group>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
