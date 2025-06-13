import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  DatePicker,
  Select,
  Button,
  Space,
  Tag,
  Progress,
  Spin,
  Typography,
  Divider,
  Badge,
  Tooltip
} from 'antd';
import {
  BarChartOutlined,
  TrophyOutlined,
  StarOutlined,
  CalendarOutlined,
  DownloadOutlined,
  RiseOutlined,
  FallOutlined
} from '@ant-design/icons';
import { getAllOrders, APPOINTMENT_STATUS } from '../orders/orderAPI';
import { fetchServices, getServicesByCategory } from '../services/serviceAPI';
import { categoryAPI } from '../categories/categoryAPI';
import { formatCurrency } from '../../../utils/formatters';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title, Text } = Typography;

const ServicesReport = () => {
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);
  const [periodType, setPeriodType] = useState('daily');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Data states
  const [servicesData, setServicesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalServices: 0,
    activeServices: 0,
    totalBookings: 0,
    averageRating: 0,
    popularServices: [],
    categoryPerformance: [],
    serviceRevenue: [],
    bookingTrends: [],
    topPerformingServices: []
  });

  useEffect(() => {
    fetchData();
  }, [dateRange, selectedCategory]);

  const fetchData = async () => {
    setLoading(true);
    try {      const [services, orders, categories] = await Promise.all([
        fetchServices(),
        getAllOrders(),
        categoryAPI.getAllCategories()
      ]);

      setServicesData(services);
      setOrdersData(orders);
      setCategoriesData(categories);
      
      calculateAnalytics(services, orders, categories);
    } catch (error) {
      console.error('Error fetching services report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (services, orders, categories) => {
    const startDate = dateRange[0];
    const endDate = dateRange[1];
      // Filter orders by date range
    const filteredOrders = orders.filter(order => {
      const orderDate = dayjs(order.appointmentDate || order.createdAt);
      return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
    });

    // Filter services by category if selected
    const filteredServices = selectedCategory === 'all' 
      ? services 
      : services.filter(service => service.categoryId === selectedCategory);

    // Calculate basic metrics
    const totalServices = filteredServices.length;
    const activeServices = filteredServices.filter(service => service.isActive !== false).length;
    const totalBookings = filteredOrders.length;
    
    // Calculate average rating (mock data for demonstration)
    const averageRating = 4.3;

    // Calculate popular services (by booking count)
    const serviceBookingCount = {};
    const serviceRevenue = {};
    
    filteredOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(serviceItem => {
          const serviceId = serviceItem.productId;
          const serviceName = serviceItem.productName || serviceItem.serviceName;
          serviceBookingCount[serviceId] = (serviceBookingCount[serviceId] || 0) + (serviceItem.quantity || 1);
          serviceRevenue[serviceId] = (serviceRevenue[serviceId] || 0) + (serviceItem.totalPrice || serviceItem.unitPrice * serviceItem.quantity || 0);
        });
      }
    });

    // Get popular services with details
    const popularServices = Object.entries(serviceBookingCount)
      .map(([serviceId, count]) => {
        const service = services.find(s => s.id === serviceId);
        return {
          serviceId,
          serviceName: service?.name || 'Unknown Service',
          category: service?.category || 'Unknown',
          bookingCount: count,
          revenue: serviceRevenue[serviceId] || 0,
          averagePrice: (serviceRevenue[serviceId] || 0) / count,
          rating: 4.0 + Math.random() * 1, // Mock rating
          growth: (Math.random() - 0.5) * 40 // Mock growth percentage
        };
      })
      .sort((a, b) => b.bookingCount - a.bookingCount)
      .slice(0, 10);    // Calculate category performance
    const categoryStats = {};
    categories.forEach(category => {
      const categoryServices = services.filter(s => s.categories?.some(cat => cat.id === category.id) || s.categoryId === category.id);
      const categoryBookings = filteredOrders.filter(order => 
        order.items?.some(item => {
          const service = services.find(svc => svc.id === item.productId);
          return service?.categories?.some(cat => cat.id === category.id) || service?.categoryId === category.id;
        })
      );
      
      const categoryRevenue = categoryBookings.reduce((sum, order) => {
        const relevantItems = order.items?.filter(item => {
          const service = services.find(svc => svc.id === item.productId);
          return service?.categories?.some(cat => cat.id === category.id) || service?.categoryId === category.id;
        }) || [];
        return sum + relevantItems.reduce((sSum, item) => sSum + (item.totalPrice || item.unitPrice * item.quantity || 0), 0);
      }, 0);

      categoryStats[category.id] = {
        categoryName: category.name,
        serviceCount: categoryServices.length,
        bookingCount: categoryBookings.length,
        revenue: categoryRevenue,
        averageBookingValue: categoryBookings.length > 0 ? categoryRevenue / categoryBookings.length : 0
      };
    });

    const categoryPerformance = Object.values(categoryStats)
      .sort((a, b) => b.revenue - a.revenue);

    // Calculate booking trends by period
    const bookingTrends = calculateBookingTrends(filteredOrders, periodType, startDate, endDate);

    // Top performing services (by revenue)
    const topPerformingServices = popularServices
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    setAnalytics({
      totalServices,
      activeServices,
      totalBookings,
      averageRating,
      popularServices,
      categoryPerformance,
      serviceRevenue: Object.entries(serviceRevenue).map(([id, revenue]) => ({
        serviceId: id,
        serviceName: services.find(s => s.id === id)?.name || 'Unknown',
        revenue
      })).sort((a, b) => b.revenue - a.revenue),
      bookingTrends,
      topPerformingServices
    });
  };

  const calculateBookingTrends = (orders, period, startDate, endDate) => {
    const trends = {};
    const format = period === 'daily' ? 'YYYY-MM-DD' : period === 'weekly' ? 'YYYY-WW' : 'YYYY-MM';
      orders.forEach(order => {
      const orderDate = dayjs(order.appointmentDate || order.createdAt);
      const key = orderDate.format(format);
      trends[key] = (trends[key] || 0) + 1;
    });

    return Object.entries(trends)
      .map(([period, count]) => ({ period, count }))
      .sort((a, b) => a.period.localeCompare(b.period));
  };

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting services report...');
  };

  const popularServicesColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      key: 'rank',
      width: 60,
      render: (_, record, index) => (
        <Badge 
          count={index + 1} 
          style={{ 
            backgroundColor: index < 3 ? '#faad14' : '#d9d9d9',
            color: index < 3 ? '#fff' : '#666'
          }} 
        />
      )
    },
    {
      title: 'Service Name',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>{record.category}</Text>
        </div>
      )
    },
    {
      title: 'Bookings',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      align: 'center',
      render: (count) => <Text strong>{count}</Text>
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right',
      render: (revenue) => <Text strong>{formatCurrency(revenue)}</Text>
    },
    {
      title: 'Avg. Price',
      dataIndex: 'averagePrice',
      key: 'averagePrice',
      align: 'right',
      render: (price) => formatCurrency(price)
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      align: 'center',
      render: (rating) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <Text>{rating.toFixed(1)}</Text>
        </Space>
      )
    },
    {
      title: 'Growth',
      dataIndex: 'growth',
      key: 'growth',
      align: 'center',
      render: (growth) => (
        <Tag color={growth >= 0 ? 'green' : 'red'} icon={growth >= 0 ? <RiseOutlined /> : <FallOutlined />}>
          {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
        </Tag>
      )
    }
  ];

  const categoryPerformanceColumns = [
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Services',
      dataIndex: 'serviceCount',
      key: 'serviceCount',
      align: 'center'
    },
    {
      title: 'Bookings',
      dataIndex: 'bookingCount',
      key: 'bookingCount',
      align: 'center'
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right',
      render: (revenue) => formatCurrency(revenue)
    },
    {
      title: 'Avg. Booking Value',
      dataIndex: 'averageBookingValue',
      key: 'averageBookingValue',
      align: 'right',
      render: (value) => formatCurrency(value)
    },
    {
      title: 'Performance',
      key: 'performance',
      align: 'center',
      render: (_, record) => {
        const maxRevenue = Math.max(...analytics.categoryPerformance.map(c => c.revenue));
        const percentage = maxRevenue > 0 ? (record.revenue / maxRevenue) * 100 : 0;
        return (
          <Progress 
            percent={percentage} 
            size="small" 
            status={percentage > 75 ? 'success' : percentage > 50 ? 'normal' : 'exception'}
            showInfo={false}
          />
        );
      }
    }
  ];

  if (loading) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: '20px' }}>
          <Text>Loading services report...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0 }}>
              <BarChartOutlined style={{ marginRight: '12px', color: '#1890ff' }} />
              Services Report
            </Title>
            <Text type="secondary">Analyze service performance and booking patterns</Text>
          </Col>
          <Col>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              onClick={handleExport}
            >
              Export Report
            </Button>
          </Col>
        </Row>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Date Range:</Text>
          </Col>
          <Col>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="YYYY-MM-DD"
              allowClear={false}
            />
          </Col>
          <Col>
            <Text strong>Period:</Text>
          </Col>
          <Col>
            <Select
              value={periodType}
              onChange={setPeriodType}
              style={{ width: 120 }}
            >
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
          </Col>
          <Col>
            <Text strong>Category:</Text>
          </Col>
          <Col>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 200 }}
              placeholder="Select category"
            >
              <Option value="all">All Categories</Option>
              {categoriesData.map(category => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Key Metrics */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Services"
              value={analytics.totalServices}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Active Services"
              value={analytics.activeServices}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Bookings"
              value={analytics.totalBookings}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Average Rating"
              value={analytics.averageRating}
              precision={1}
              prefix={<StarOutlined />}
              suffix="/ 5.0"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Popular Services */}
        <Col xs={24} xl={14}>
          <Card
            title={
              <Space>
                <TrophyOutlined style={{ color: '#faad14' }} />
                Most Popular Services
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            <Table
              dataSource={analytics.popularServices}
              columns={popularServicesColumns}
              pagination={{ pageSize: 10 }}
              rowKey="serviceId"
              size="small"
            />
          </Card>
        </Col>

        {/* Top Performing Services */}
        <Col xs={24} xl={10}>
          <Card
            title={
              <Space>
                <RiseOutlined style={{ color: '#52c41a' }} />
                Top Revenue Generators
              </Space>
            }
            style={{ marginBottom: '24px' }}
          >
            {analytics.topPerformingServices.map((service, index) => (
              <div key={service.serviceId} style={{ marginBottom: '16px' }}>
                <Row justify="space-between" align="middle">
                  <Col span={16}>
                    <Text strong>{service.serviceName}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {service.bookingCount} bookings
                    </Text>
                  </Col>
                  <Col span={8} style={{ textAlign: 'right' }}>
                    <Text strong>{formatCurrency(service.revenue)}</Text>
                  </Col>
                </Row>
                <Progress
                  percent={(service.revenue / analytics.topPerformingServices[0]?.revenue) * 100}
                  size="small"
                  showInfo={false}
                  strokeColor="#52c41a"
                />
                {index < analytics.topPerformingServices.length - 1 && <Divider />}
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Category Performance */}
      <Card
        title={
          <Space>
            <BarChartOutlined style={{ color: '#1890ff' }} />
            Category Performance Analysis
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Table
          dataSource={analytics.categoryPerformance}
          columns={categoryPerformanceColumns}
          pagination={false}
          rowKey="categoryName"
          size="middle"
        />
      </Card>

      {/* Booking Trends */}
      <Card
        title={
          <Space>
            <CalendarOutlined style={{ color: '#722ed1' }} />
            Booking Trends ({periodType.charAt(0).toUpperCase() + periodType.slice(1)})
          </Space>
        }
      >
        <Row gutter={16}>
          {analytics.bookingTrends.slice(0, 7).map((trend, index) => (
            <Col key={trend.period} span={24 / Math.min(analytics.bookingTrends.length, 7)}>
              <div style={{ textAlign: 'center', padding: '12px' }}>
                <Text type="secondary">{trend.period}</Text>
                <br />
                <Text strong style={{ fontSize: '18px' }}>{trend.count}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>bookings</Text>
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default ServicesReport;
