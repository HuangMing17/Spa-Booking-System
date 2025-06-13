import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Table,
  DatePicker,
  Select,
  Button,
  Space,
  Tag,
  Progress,
  Spin,
  message,
  Divider,
  Alert,
  Empty,
} from "antd";
import {
  DollarOutlined,
  RiseOutlined,
  CalendarOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  ExportOutlined,
  ReloadOutlined,
  FallOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// Import API functions
import {
  getAllOrders,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
} from "../orders/orderAPI";
import { getCustomers } from "../customers/customerAPI";
import { fetchServices } from "../services/serviceAPI";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const RevenueReport = () => {
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);
  const [period, setPeriod] = useState("daily"); // daily, weekly, monthly
  const [data, setData] = useState({
    appointments: [],
    customers: [],
    services: [],
  });

  // Statistics states
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    completedRevenue: 0,
    averageOrderValue: 0,
    totalOrders: 0,
    completedOrders: 0,
    previousPeriodRevenue: 0,
    revenueGrowth: 0,
  });

  const [revenueByPeriod, setRevenueByPeriod] = useState([]);
  const [revenueByService, setRevenueByService] = useState([]);
  const [revenueByCustomer, setRevenueByCustomer] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    loadRevenueData();
  }, [dateRange, period]);
  const loadRevenueData = async () => {
    try {
      setLoading(true);

      // Load all required data
      const [appointmentsRes, customersRes, servicesRes] = await Promise.all([
        getAllOrders(),
        getCustomers(),
        fetchServices(),
      ]);

      console.log("🐛 DEBUG Revenue Report - Raw API responses:");
      console.log("Appointments:", appointmentsRes);
      console.log("Customers:", customersRes);
      console.log("Services:", servicesRes);

      const appointments = Array.isArray(appointmentsRes) ? appointmentsRes : [];
      const customers = Array.isArray(customersRes) ? customersRes : [];
      const services = Array.isArray(servicesRes) ? servicesRes : [];

      console.log("🐛 DEBUG Revenue Report - Processed arrays:");
      console.log("Appointments array:", appointments.length, appointments);
      console.log("Customers array:", customers.length);
      console.log("Services array:", services.length);

      setData({ appointments, customers, services });

      // Filter appointments by date range
      const [startDate, endDate] = dateRange;
      console.log("🐛 DEBUG Revenue Report - Date range:", startDate.format(), "to", endDate.format());
      
      const filteredAppointments = appointments.filter((apt) => {
        const aptDate = dayjs(apt.appointmentDate || apt.createdAt);
        const isInRange = aptDate.isBetween(startDate, endDate, "day", "[]");
        if (appointments.length < 5) { // Log first few for debugging
          console.log("🐛 DEBUG Appointment filter:", {
            id: apt.id,
            appointmentDate: apt.appointmentDate,
            createdAt: apt.createdAt,
            aptDate: aptDate.format(),
            isInRange
          });
        }
        return isInRange;
      });

      console.log("🐛 DEBUG Revenue Report - Filtered appointments:", filteredAppointments.length, filteredAppointments);

      // If no real data, add sample data for testing
      if (appointments.length === 0) {
        console.log("🐛 DEBUG: No real appointments data, adding sample data");
        const sampleAppointments = [
          {
            id: "sample-1",
            customerId: "customer-1",
            customerName: "Nguyễn Văn A",
            appointmentDate: dayjs().subtract(5, "day").toISOString(),
            createdAt: dayjs().subtract(5, "day").toISOString(),
            statusCode: APPOINTMENT_STATUS.COMPLETED,
            totalAmount: 1500000,
            items: [
              {
                productId: "service-1",
                productName: "Massage toàn thân",
                serviceName: "Massage toàn thân",
                quantity: 1,
                unitPrice: 1500000,
                totalPrice: 1500000,
              }
            ]
          },
          {
            id: "sample-2",
            customerId: "customer-2",
            customerName: "Trần Thị B",
            appointmentDate: dayjs().subtract(3, "day").toISOString(),
            createdAt: dayjs().subtract(3, "day").toISOString(),
            statusCode: APPOINTMENT_STATUS.COMPLETED,
            totalAmount: 2500000,
            items: [
              {
                productId: "service-2",
                productName: "Chăm sóc da mặt",
                serviceName: "Chăm sóc da mặt",
                quantity: 1,
                unitPrice: 2500000,
                totalPrice: 2500000,
              }
            ]
          },
          {
            id: "sample-3",
            customerId: "customer-3",
            customerName: "Lê Văn C",
            appointmentDate: dayjs().subtract(1, "day").toISOString(),
            createdAt: dayjs().subtract(1, "day").toISOString(),
            statusCode: APPOINTMENT_STATUS.COMPLETED,
            totalAmount: 3000000,
            items: [
              {
                productId: "service-1",
                productName: "Massage toàn thân",
                serviceName: "Massage toàn thân",
                quantity: 2,
                unitPrice: 1500000,
                totalPrice: 3000000,
              }
            ]
          }
        ];
        
        setData({ appointments: sampleAppointments, customers, services });
        
        // Recalculate with sample data
        const sampleFiltered = sampleAppointments.filter((apt) => {
          const aptDate = dayjs(apt.appointmentDate || apt.createdAt);
          return aptDate.isBetween(startDate, endDate, "day", "[]");
        });
        
        console.log("🐛 DEBUG: Sample filtered appointments:", sampleFiltered.length);
        
        // Calculate revenue statistics
        calculateRevenueStats(sampleFiltered, sampleAppointments);
        
        // Calculate revenue by period
        calculateRevenueByPeriod(sampleFiltered);
        
        // Calculate revenue by service
        calculateRevenueByService(sampleFiltered, services);
        
        // Calculate revenue by customer
        calculateRevenueByCustomer(sampleFiltered, customers);
        
        // Calculate payment methods (mock data for now)
        calculatePaymentMethods(sampleFiltered);
        
        return; // Exit early since we used sample data
      }

      // Calculate revenue statistics
      calculateRevenueStats(filteredAppointments, appointments);
      
      // Calculate revenue by period
      calculateRevenueByPeriod(filteredAppointments);
      
      // Calculate revenue by service
      calculateRevenueByService(filteredAppointments, services);
      
      // Calculate revenue by customer
      calculateRevenueByCustomer(filteredAppointments, customers);
      
      // Calculate payment methods (mock data for now)
      calculatePaymentMethods(filteredAppointments);

    } catch (error) {
      console.error("Error loading revenue data:", error);
      message.error("Không thể tải dữ liệu báo cáo doanh thu!");
    } finally {
      setLoading(false);
    }
  };
  const calculateRevenueStats = (filteredAppointments, allAppointments) => {
    console.log("🐛 DEBUG calculateRevenueStats - Input:");
    console.log("Filtered appointments:", filteredAppointments.length);
    console.log("All appointments:", allAppointments.length);
    
    const completedAppointments = filteredAppointments.filter(
      (apt) => apt.statusCode === APPOINTMENT_STATUS.COMPLETED
    );

    console.log("🐛 DEBUG calculateRevenueStats - Status filtering:");
    console.log("Completed appointments:", completedAppointments.length);
    console.log("APPOINTMENT_STATUS.COMPLETED:", APPOINTMENT_STATUS.COMPLETED);
    
    // Log status codes of first few appointments
    filteredAppointments.slice(0, 5).forEach((apt, index) => {
      console.log(`🐛 DEBUG Appointment ${index + 1} status:`, {
        id: apt.id,
        statusCode: apt.statusCode,
        status: apt.status,
        totalAmount: apt.totalAmount
      });
    });

    const totalRevenue = completedAppointments.reduce(
      (sum, apt) => sum + (apt.totalAmount || 0),
      0
    );

    console.log("🐛 DEBUG calculateRevenueStats - Revenue calculation:");
    console.log("Total revenue:", totalRevenue);

    const totalOrders = filteredAppointments.length;
    const completedOrders = completedAppointments.length;
    const averageOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

    // Calculate previous period for comparison
    const [startDate, endDate] = dateRange;
    const periodLength = endDate.diff(startDate, "day");
    const previousStartDate = startDate.subtract(periodLength + 1, "day");
    const previousEndDate = startDate.subtract(1, "day");

    const previousPeriodAppointments = allAppointments.filter((apt) => {
      const aptDate = dayjs(apt.appointmentDate || apt.createdAt);
      return aptDate.isBetween(previousStartDate, previousEndDate, "day", "[]") &&
             apt.statusCode === APPOINTMENT_STATUS.COMPLETED;
    });

    const previousPeriodRevenue = previousPeriodAppointments.reduce(
      (sum, apt) => sum + (apt.totalAmount || 0),
      0
    );

    const revenueGrowth = previousPeriodRevenue > 0 
      ? ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100 
      : 0;

    setRevenueStats({
      totalRevenue,
      completedRevenue: totalRevenue,
      averageOrderValue,
      totalOrders,
      completedOrders,
      previousPeriodRevenue,
      revenueGrowth,
    });
  };

  const calculateRevenueByPeriod = (appointments) => {
    const [startDate, endDate] = dateRange;
    const revenueMap = new Map();

    // Initialize all periods with 0 revenue
    let currentDate = startDate.clone();
    while (currentDate.isSameOrBefore(endDate)) {
      let key;
      if (period === "daily") {
        key = currentDate.format("YYYY-MM-DD");
        currentDate = currentDate.add(1, "day");
      } else if (period === "weekly") {
        key = `Tuần ${currentDate.week()} - ${currentDate.format("YYYY")}`;
        currentDate = currentDate.add(1, "week");
      } else {
        key = currentDate.format("MM/YYYY");
        currentDate = currentDate.add(1, "month");
      }
      revenueMap.set(key, 0);
    }

    // Calculate actual revenue
    appointments
      .filter((apt) => apt.statusCode === APPOINTMENT_STATUS.COMPLETED)
      .forEach((apt) => {
        const aptDate = dayjs(apt.appointmentDate || apt.createdAt);
        let key;
        if (period === "daily") {
          key = aptDate.format("YYYY-MM-DD");
        } else if (period === "weekly") {
          key = `Tuần ${aptDate.week()} - ${aptDate.format("YYYY")}`;
        } else {
          key = aptDate.format("MM/YYYY");
        }

        if (revenueMap.has(key)) {
          revenueMap.set(key, revenueMap.get(key) + (apt.totalAmount || 0));
        }
      });

    const periodData = Array.from(revenueMap.entries()).map(([period, revenue]) => ({
      period,
      revenue,
      formattedRevenue: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(revenue),
    }));

    setRevenueByPeriod(periodData);
  };

  const calculateRevenueByService = (appointments, services) => {
    const serviceRevenueMap = new Map();

    appointments
      .filter((apt) => apt.statusCode === APPOINTMENT_STATUS.COMPLETED)
      .forEach((apt) => {
        if (apt.items && Array.isArray(apt.items)) {
          apt.items.forEach((item) => {
            const serviceName = item.productName || item.serviceName || "Dịch vụ không xác định";
            const revenue = item.totalPrice || (item.unitPrice || item.price || 0) * item.quantity;
            const quantity = item.quantity || 1;

            if (serviceRevenueMap.has(serviceName)) {
              const existing = serviceRevenueMap.get(serviceName);
              serviceRevenueMap.set(serviceName, {
                revenue: existing.revenue + revenue,
                quantity: existing.quantity + quantity,
                orders: existing.orders + 1,
              });
            } else {
              serviceRevenueMap.set(serviceName, {
                revenue,
                quantity,
                orders: 1,
              });
            }
          });
        }
      });

    const serviceData = Array.from(serviceRevenueMap.entries())
      .map(([serviceName, data]) => ({
        serviceName,
        revenue: data.revenue,
        quantity: data.quantity,
        orders: data.orders,
        averageValue: data.orders > 0 ? data.revenue / data.orders : 0,
        formattedRevenue: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(data.revenue),
      }))
      .sort((a, b) => b.revenue - a.revenue);

    setRevenueByService(serviceData);
  };

  const calculateRevenueByCustomer = (appointments, customers) => {
    const customerRevenueMap = new Map();

    appointments
      .filter((apt) => apt.statusCode === APPOINTMENT_STATUS.COMPLETED)
      .forEach((apt) => {
        const customerId = apt.customerId;
        const customerName = apt.customerName || "Khách hàng không xác định";
        const revenue = apt.totalAmount || 0;

        if (customerRevenueMap.has(customerId)) {
          const existing = customerRevenueMap.get(customerId);
          customerRevenueMap.set(customerId, {
            ...existing,
            revenue: existing.revenue + revenue,
            orders: existing.orders + 1,
          });
        } else {
          customerRevenueMap.set(customerId, {
            customerName,
            revenue,
            orders: 1,
          });
        }
      });

    const customerData = Array.from(customerRevenueMap.entries())
      .map(([customerId, data]) => ({
        customerId,
        customerName: data.customerName,
        revenue: data.revenue,
        orders: data.orders,
        averageOrderValue: data.orders > 0 ? data.revenue / data.orders : 0,
        formattedRevenue: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(data.revenue),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10); // Top 10 customers

    setRevenueByCustomer(customerData);
  };

  const calculatePaymentMethods = (appointments) => {
    // Mock payment method data since it's not in the current API
    const completedOrders = appointments.filter(
      (apt) => apt.statusCode === APPOINTMENT_STATUS.COMPLETED
    ).length;

    const mockPaymentMethods = [
      { method: "Tiền mặt", count: Math.floor(completedOrders * 0.6), percentage: 60 },
      { method: "Chuyển khoản", count: Math.floor(completedOrders * 0.25), percentage: 25 },
      { method: "Thẻ tín dụng", count: Math.floor(completedOrders * 0.15), percentage: 15 },
    ];

    setPaymentMethods(mockPaymentMethods);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const exportReport = () => {
    message.info("Tính năng xuất báo cáo sẽ được phát triển trong phiên bản tiếp theo");
  };

  // Table columns for revenue by service
  const serviceColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "Doanh thu",
      dataIndex: "formattedRevenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Số đơn",
      dataIndex: "orders",
      key: "orders",
      sorter: (a, b) => a.orders - b.orders,
    },
    {
      title: "Giá trị TB/đơn",
      key: "averageValue",
      render: (_, record) => formatCurrency(record.averageValue),
      sorter: (a, b) => a.averageValue - b.averageValue,
    },
  ];

  // Table columns for revenue by customer
  const customerColumns = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (name) => <Text strong>{name}</Text>,
    },
    {
      title: "Doanh thu",
      dataIndex: "formattedRevenue",
      key: "revenue",
      sorter: (a, b) => a.revenue - b.revenue,
    },
    {
      title: "Số đơn",
      dataIndex: "orders",
      key: "orders",
      sorter: (a, b) => a.orders - b.orders,
    },
    {
      title: "Giá trị TB/đơn",
      key: "averageOrderValue",
      render: (_, record) => formatCurrency(record.averageOrderValue),
      sorter: (a, b) => a.averageOrderValue - b.averageOrderValue,
    },
  ];

  if (loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang tải báo cáo doanh thu...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
            <DollarOutlined style={{ marginRight: 8 }} />
            Báo Cáo Doanh Thu
          </Title>
          <Text type="secondary">
            Phân tích chi tiết doanh thu và hiệu quả kinh doanh
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
            <Select
              value={period}
              onChange={setPeriod}
              style={{ width: 120 }}
            >
              <Option value="daily">Theo ngày</Option>
              <Option value="weekly">Theo tuần</Option>
              <Option value="monthly">Theo tháng</Option>
            </Select>
            <Button icon={<ReloadOutlined />} onClick={loadRevenueData}>
              Làm mới
            </Button>
            <Button type="primary" icon={<ExportOutlined />} onClick={exportReport}>
              Xuất báo cáo
            </Button>
          </Space>        </Col>
      </Row>

      {/* Debug Information */}
      {data.appointments.length === 0 ? (
        <Alert
          message="Thông tin Debug"
          description={
            <div>
              <p><strong>Trạng thái dữ liệu:</strong></p>
              <p>• Appointments: {data.appointments.length}</p>
              <p>• Customers: {data.customers.length}</p>
              <p>• Services: {data.services.length}</p>
              <p>• Date Range: {dateRange[0].format("DD/MM/YYYY")} - {dateRange[1].format("DD/MM/YYYY")}</p>
              <p><strong>Ghi chú:</strong> Đang sử dụng dữ liệu mẫu để demo vì không có dữ liệu thực từ API</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      ) : (
        <Alert
          message="Dữ liệu thực từ API"
          description={`Tìm thấy ${data.appointments.length} đơn hàng trong hệ thống`}
          type="success"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      {/* Key Metrics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={revenueStats.totalRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
              valueStyle={{ color: "#52c41a" }}
            />
            <div style={{ marginTop: 8 }}>
              {revenueStats.revenueGrowth > 0 ? (
                <Text type="success">
                  <RiseOutlined /> +{revenueStats.revenueGrowth.toFixed(1)}% so với kỳ trước
                </Text>
              ) : (
                <Text type="danger">
                  <FallOutlined /> {revenueStats.revenueGrowth.toFixed(1)}% so với kỳ trước
                </Text>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng đơn hàng"
              value={revenueStats.totalOrders}
              prefix={<CalendarOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#1890ff" }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                {revenueStats.completedOrders} đơn hoàn thành
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Giá trị TB/đơn"
              value={revenueStats.averageOrderValue}
              formatter={(value) => formatCurrency(value)}
              prefix={<BarChartOutlined style={{ color: "#722ed1" }} />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>            <Statistic
              title="Tỷ lệ hoàn thành"
              value={revenueStats.totalOrders > 0 ? (revenueStats.completedOrders / revenueStats.totalOrders * 100) : 0}
              suffix="%"
              prefix={<ArrowUpOutlined style={{ color: "#fa8c16" }} />}
              valueStyle={{ color: "#fa8c16" }}
              precision={1}
            />
          </Card>
        </Col>
      </Row>

      {/* Revenue Trend */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <LineChartOutlined />
                <span>Xu hướng doanh thu theo {period === "daily" ? "ngày" : period === "weekly" ? "tuần" : "tháng"}</span>
              </Space>
            }
          >
            {revenueByPeriod.length > 0 ? (
              <Table
                dataSource={revenueByPeriod}
                columns={[
                  {
                    title: "Thời gian",
                    dataIndex: "period",
                    key: "period",
                  },
                  {
                    title: "Doanh thu",
                    dataIndex: "formattedRevenue",
                    key: "revenue",
                    sorter: (a, b) => a.revenue - b.revenue,
                  },
                ]}
                pagination={{ pageSize: 10 }}
                size="small"
              />
            ) : (
              <Empty description="Không có dữ liệu doanh thu trong khoảng thời gian này" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Revenue by Service and Customer */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>Doanh thu theo dịch vụ</span>
              </Space>
            }
          >
            {revenueByService.length > 0 ? (
              <Table
                dataSource={revenueByService}
                columns={serviceColumns}
                pagination={{ pageSize: 10 }}
                size="small"
              />
            ) : (
              <Empty description="Không có dữ liệu doanh thu theo dịch vụ" />
            )}
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card            title={
              <Space>
                <ArrowUpOutlined />
                <span>Top khách hàng</span>
              </Space>
            }
          >
            {revenueByCustomer.length > 0 ? (
              <Table
                dataSource={revenueByCustomer}
                columns={customerColumns}
                pagination={false}
                size="small"
              />
            ) : (
              <Empty description="Không có dữ liệu khách hàng" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Payment Methods */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>Phương thức thanh toán</span>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              {paymentMethods.map((method, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card size="small">
                    <Statistic
                      title={method.method}
                      value={method.count}
                      suffix="đơn"
                    />
                    <Progress
                      percent={method.percentage}
                      showInfo={false}
                      strokeColor={
                        index === 0 ? "#52c41a" : 
                        index === 1 ? "#1890ff" : "#fa8c16"
                      }
                    />
                    <Text type="secondary">{method.percentage}% tổng đơn</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RevenueReport;
