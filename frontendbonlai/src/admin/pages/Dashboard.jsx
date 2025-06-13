import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Table,
  Space,
  Button,
  Tag,
  Avatar,
  Statistic,
  Spin,
  message,
  DatePicker,
  Select,
  Progress,
  List,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ShoppingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  EyeOutlined,
  RightOutlined,
  TrophyOutlined,
  TeamOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Import API functions
import {
  getAllOrders,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
} from "./orders/orderAPI";
import { getCustomers } from "./customers/customerAPI";
import { fetchServices } from "./services/serviceAPI";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Dashboard = () => {
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);

  // Data states
  const [statistics, setStatistics] = useState({
    totalAppointments: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    totalServices: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
  });

  const [recentAppointments, setRecentAppointments] = useState([]);
  const [topServices, setTopServices] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, [dateRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load all data in parallel
      const [appointmentsRes, customersRes, servicesRes] = await Promise.all([
        getAllOrders(),
        getCustomers(),
        fetchServices(),
      ]);

      // Process appointments data
      const appointments = Array.isArray(appointmentsRes)
        ? appointmentsRes
        : [];
      const customers = Array.isArray(customersRes) ? customersRes : [];
      const services = Array.isArray(servicesRes) ? servicesRes : [];

      // Calculate statistics
      const stats = calculateStatistics(appointments, customers, services);
      setStatistics(stats);

      // Process recent appointments (last 10)
      const recent = appointments
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);
      setRecentAppointments(recent);

      // Calculate top services
      const topServicesData = calculateTopServices(appointments);
      setTopServices(topServicesData);

      // Calculate revenue data
      const revenue = calculateRevenueData(appointments, dateRange);
      setRevenueData(revenue); // Get new customers (last 30 days)
      const thirtyDaysAgo = dayjs().subtract(30, "day");
      const newCustomersData = customers
        .filter((customer) => {
          // Try multiple date field possibilities
          const dateField =
            customer.createdAt || customer.registeredAt || customer.dateCreated;
          return dateField && dayjs(dateField).isAfter(thirtyDaysAgo);
        })
        .sort((a, b) => {
          const dateA = new Date(
            a.createdAt || a.registeredAt || a.dateCreated || 0
          );
          const dateB = new Date(
            b.createdAt || b.registeredAt || b.dateCreated || 0
          );
          return dateB - dateA;
        })
        .slice(0, 5);
      setNewCustomers(newCustomersData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      message.error("Không thể tải dữ liệu dashboard!");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from real data
  const calculateStatistics = (appointments, customers, services) => {
    const totalRevenue = appointments
      .filter((apt) => apt.statusCode === APPOINTMENT_STATUS.COMPLETED)
      .reduce((sum, apt) => sum + (apt.totalAmount || 0), 0);

    const pendingCount = appointments.filter(
      (apt) => apt.statusCode === APPOINTMENT_STATUS.PENDING
    ).length;
    const confirmedCount = appointments.filter(
      (apt) => apt.statusCode === APPOINTMENT_STATUS.CONFIRMED
    ).length;
    const completedCount = appointments.filter(
      (apt) => apt.statusCode === APPOINTMENT_STATUS.COMPLETED
    ).length;
    const cancelledCount = appointments.filter(
      (apt) => apt.statusCode === APPOINTMENT_STATUS.CANCELLED
    ).length;

    return {
      totalAppointments: appointments.length,
      totalCustomers: customers.length,
      totalRevenue,
      totalServices: services.length,
      pendingAppointments: pendingCount,
      confirmedAppointments: confirmedCount,
      completedAppointments: completedCount,
      cancelledAppointments: cancelledCount,
    };
  };

  // Calculate top services
  const calculateTopServices = (appointments) => {
    const serviceCount = {};
    const serviceRevenue = {};

    appointments.forEach((appointment) => {
      if (appointment.items && Array.isArray(appointment.items)) {
        appointment.items.forEach((item) => {
          const serviceName =
            item.productName || item.serviceName || "Dịch vụ không xác định";
          const revenue =
            item.totalPrice || item.unitPrice * item.quantity || 0;

          serviceCount[serviceName] =
            (serviceCount[serviceName] || 0) + item.quantity;
          serviceRevenue[serviceName] =
            (serviceRevenue[serviceName] || 0) + revenue;
        });
      }
    });

    return Object.keys(serviceCount)
      .map((serviceName) => ({
        name: serviceName,
        count: serviceCount[serviceName],
        revenue: serviceRevenue[serviceName],
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  // Calculate revenue data for chart
  const calculateRevenueData = (appointments, dateRange) => {
    const [startDate, endDate] = dateRange;
    const days = [];

    // Generate date range
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      days.push({
        date: currentDate.format("YYYY-MM-DD"),
        revenue: 0,
      });
      currentDate = currentDate.add(1, "day");
    }

    // Calculate revenue for each day
    appointments
      .filter((apt) => apt.statusCode === APPOINTMENT_STATUS.COMPLETED)
      .forEach((appointment) => {
        const appointmentDate = dayjs(appointment.appointmentDate).format(
          "YYYY-MM-DD"
        );
        const dayData = days.find((day) => day.date === appointmentDate);
        if (dayData) {
          dayData.revenue += appointment.totalAmount || 0;
        }
      });

    return days;
  };

  // Statistics cards configuration
  const statisticsCards = [
    {
      title: "Tổng lịch hẹn",
      value: statistics.totalAppointments,
      prefix: <CalendarOutlined />,
      color: "#1890ff",
      bgColor: "#e6f7ff",
      path: "/admin/orders",
    },
    {
      title: "Tổng khách hàng",
      value: statistics.totalCustomers,
      prefix: <UserOutlined />,
      color: "#52c41a",
      bgColor: "#f6ffed",
      path: "/admin/customers",
    },
    {
      title: "Doanh thu",
      value: statistics.totalRevenue,
      prefix: <DollarOutlined />,
      color: "#722ed1",
      bgColor: "#f9f0ff",
      formatter: (value) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(value),
      path: "/admin/orders",
    },
    {
      title: "Tổng dịch vụ",
      value: statistics.totalServices,
      prefix: <ShoppingOutlined />,
      color: "#fa8c16",
      bgColor: "#fff7e6",
      path: "/admin/services",
    },
  ];

  // Appointment status distribution
  const statusDistribution = [
    {
      status: "Chờ xác nhận",
      count: statistics.pendingAppointments,
      color: APPOINTMENT_STATUS_COLORS[APPOINTMENT_STATUS.PENDING],
      percentage: statistics.totalAppointments
        ? (
            (statistics.pendingAppointments / statistics.totalAppointments) *
            100
          ).toFixed(1)
        : 0,
    },
    {
      status: "Đã xác nhận",
      count: statistics.confirmedAppointments,
      color: APPOINTMENT_STATUS_COLORS[APPOINTMENT_STATUS.CONFIRMED],
      percentage: statistics.totalAppointments
        ? (
            (statistics.confirmedAppointments / statistics.totalAppointments) *
            100
          ).toFixed(1)
        : 0,
    },
    {
      status: "Hoàn thành",
      count: statistics.completedAppointments,
      color: APPOINTMENT_STATUS_COLORS[APPOINTMENT_STATUS.COMPLETED],
      percentage: statistics.totalAppointments
        ? (
            (statistics.completedAppointments / statistics.totalAppointments) *
            100
          ).toFixed(1)
        : 0,
    },
    {
      status: "Đã hủy",
      count: statistics.cancelledAppointments,
      color: APPOINTMENT_STATUS_COLORS[APPOINTMENT_STATUS.CANCELLED],
      percentage: statistics.totalAppointments
        ? (
            (statistics.cancelledAppointments / statistics.totalAppointments) *
            100
          ).toFixed(1)
        : 0,
    },
  ];

  // Recent appointments table columns
  const appointmentColumns = [
    {
      title: "Mã LH",
      dataIndex: "id",
      key: "id",
      width: 80,
      render: (id) => <Text code>#{id.slice(-6)}</Text>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (record) => (
        <Space>
          <Avatar size="small" icon={<UserOutlined />} />
          <div>
            <div>{record.customerName || "Không có tên"}</div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {record.customerPhone || "Không có SĐT"}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusCode",
      key: "statusCode",
      render: (status) => (
        <Tag color={APPOINTMENT_STATUS_COLORS[status]}>
          {APPOINTMENT_STATUS_LABELS[status]}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 80,
      render: (record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/orders/${record.id}`)}
        >
          Xem
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải dữ liệu dashboard...</Text>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            <CalendarOutlined style={{ marginRight: 8 }} />
            Dashboard Quản Lý Spa
          </Title>
          <Text type="secondary">
            Tổng quan hoạt động kinh doanh spa của bạn
          </Text>
        </Col>
        <Col>
          <Space>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD/MM/YYYY"
              placeholder={["Từ ngày", "Đến ngày"]}
            />
            <Button type="primary" onClick={loadDashboardData}>
              Làm mới
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statisticsCards.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              onClick={() => navigate(stat.path)}
              style={{
                cursor: "pointer",
                borderRadius: 8,
                border: `1px solid ${stat.color}20`,
              }}
            >
              <Row align="middle">
                <Col span={18}>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: stat.bgColor,
                          color: stat.color,
                          marginRight: 12,
                        }}
                      >
                        {stat.prefix}
                      </div>
                    }
                    formatter={stat.formatter}
                    valueStyle={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: stat.color,
                    }}
                  />
                </Col>
                <Col span={6} style={{ textAlign: "right" }}>
                  <RightOutlined style={{ color: stat.color, fontSize: 16 }} />
                </Col>
              </Row>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Appointment Status Distribution */}
          <Card
            title={
              <Space>
                <CalendarOutlined />
                <span>Phân bố trạng thái lịch hẹn</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <Row gutter={[16, 16]}>
              {statusDistribution.map((item, index) => (
                <Col xs={12} lg={6} key={index}>
                  <Card size="small" style={{ textAlign: "center" }}>
                    <Statistic
                      title={item.status}
                      value={item.count}
                      suffix={`(${item.percentage}%)`}
                      valueStyle={{
                        color:
                          item.color === "orange"
                            ? "#fa8c16"
                            : item.color === "blue"
                            ? "#1890ff"
                            : item.color === "green"
                            ? "#52c41a"
                            : "#ff4d4f",
                      }}
                    />
                    <Progress
                      percent={parseFloat(item.percentage)}
                      showInfo={false}
                      strokeColor={
                        item.color === "orange"
                          ? "#fa8c16"
                          : item.color === "blue"
                          ? "#1890ff"
                          : item.color === "green"
                          ? "#52c41a"
                          : "#ff4d4f"
                      }
                      size="small"
                      style={{ marginTop: 8 }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Recent Appointments */}
          <Card
            title={
              <Space>
                <ClockCircleOutlined />
                <span>Lịch hẹn gần đây</span>
              </Space>
            }
            extra={
              <Button
                type="link"
                onClick={() => navigate("/admin/orders")}
                icon={<RightOutlined />}
              >
                Xem tất cả
              </Button>
            }
          >
            <Table
              columns={appointmentColumns}
              dataSource={recentAppointments}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: "Không có lịch hẹn nào" }}
            />
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Top Services */}
          <Card
            title={
              <Space>
                <TrophyOutlined />
                <span>Top dịch vụ phổ biến</span>
              </Space>
            }
            style={{ marginBottom: 16 }}
          >
            <List
              dataSource={topServices}
              locale={{ emptyText: "Không có dữ liệu" }}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor:
                            index === 0
                              ? "#ffd700"
                              : index === 1
                              ? "#c0c0c0"
                              : index === 2
                              ? "#cd7f32"
                              : "#f0f0f0",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </div>
                    }
                    title={<Text strong>{item.name}</Text>}
                    description={
                      <Space>
                        <Text type="secondary">{item.count} lượt đặt</Text>
                        <Text type="secondary">•</Text>
                        <Text type="secondary">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(item.revenue)}
                        </Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
          {/* New Customers */}
          <Card
            title={
              <Space>
                <TeamOutlined />
                <span>Khách hàng mới (30 ngày)</span>
              </Space>
            }
            extra={
              <Button
                type="link"
                onClick={() => navigate("/admin/customers")}
                icon={<RightOutlined />}
              >
                Xem tất cả
              </Button>
            }
          >
            {" "}
            <List
              dataSource={newCustomers}
              locale={{ emptyText: "Không có khách hàng mới" }}
              renderItem={(customer) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={
                      <Text strong>
                        {customer.fullName || customer.name || "Không có tên"}
                      </Text>
                    }
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">
                          <PhoneOutlined style={{ marginRight: 4 }} />
                          {customer.phone || "Không có SĐT"}
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {dayjs(
                            customer.createdAt ||
                              customer.registeredAt ||
                              customer.dateCreated
                          ).format("DD/MM/YYYY")}
                        </Text>
                        {customer.email && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {customer.email}
                          </Text>
                        )}
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>{" "}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
