import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Typography,
  Space,
  Tag,
  Button,
  Row,
  Col,
  message,
  Modal,
  Descriptions,
  Input,
  DatePicker,
  Empty,
  Tooltip,
  Alert,
  Statistic,
  Divider,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  MailOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  FilterOutlined,
  DollarOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import {
  getOrdersByCustomer,
  cancelOrder,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
  canCancelOrder,
  calculateTotalAmount,
  calculateTotalDuration,
} from "../../admin/pages/orders/orderAPI";
import { useCustomerAuth } from "../../auth/customer/context/CustomerAuthContext";

const { Title, Text } = Typography;
const { Search } = Input;
const { RangePicker } = DatePicker;

const MyBookings = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useCustomerAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để xem lịch hẹn của bạn");
      navigate("/dang-nhap", {
        state: {
          redirectPath: "/lich-hen-cua-toi",
        },
      });
      return;
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (isLoggedIn && user) {
      loadBookings();
    }
  }, [isLoggedIn, user]);
  
  const loadBookings = async () => {
    if (!user || !user.id) {
      console.error("No user information available");
      return;
    }

    try {
      setLoading(true);

      console.log("Loading bookings for user:", user.id);
      console.log("User object:", user);

      // Get bookings for the logged-in customer
      const customerBookings = await getOrdersByCustomer(user.id);
      console.log("Raw API response:", customerBookings);

      const bookingData = Array.isArray(customerBookings)
        ? customerBookings
        : [];

      console.log("Processed bookings:", bookingData);

      setBookings(bookingData);
      calculateStatistics(bookingData);

      if (bookingData.length === 0) {
        console.log("No bookings found for user");
        message.info("Bạn chưa có lịch hẹn nào.");
      } else {
        console.log(`Found ${bookingData.length} bookings`);
      }
    } catch (error) {
      console.error("Error loading bookings:", error);
      console.error("Error details:", error.response?.data || error.message);
      message.error("Không thể tải danh sách lịch hẹn!");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateStatistics = (bookingData) => {
    const stats = {
      total: bookingData.length,
      pending: bookingData.filter(
        (b) => (b.statusCode || b.status) === APPOINTMENT_STATUS.PENDING
      ).length,
      confirmed: bookingData.filter(
        (b) => (b.statusCode || b.status) === APPOINTMENT_STATUS.CONFIRMED
      ).length,
      completed: bookingData.filter(
        (b) => (b.statusCode || b.status) === APPOINTMENT_STATUS.COMPLETED
      ).length,
      cancelled: bookingData.filter(
        (b) => (b.statusCode || b.status) === APPOINTMENT_STATUS.CANCELLED
      ).length,
    };
    setStatistics(stats);
  };

  const handleCancelBooking = (bookingId) => {
    console.log("Attempting to cancel booking:", bookingId);
    console.log("User ID:", user?.id);
    console.log("Modal available:", typeof Modal !== 'undefined');

    // Test if Modal is available and working
    try {
      console.log("Creating Modal.confirm...");
      
      const modalInstance = Modal.confirm({
        title: "Xác nhận hủy lịch hẹn",
        icon: <ExclamationCircleOutlined />,
        content:
          "Bạn có chắc chắn muốn hủy lịch hẹn này không? Thao tác này không thể hoàn tác.",
        okText: "Hủy lịch hẹn",
        cancelText: "Quay lại",
        okType: "danger",
        centered: true,
        maskClosable: false,
        zIndex: 1050,
        getContainer: () => document.body,
        onOk: async () => {
          try {
            console.log("User confirmed cancellation");
            console.log(
              "Cancelling booking:",
              bookingId,
              "for customer:",
              user.id
            );
            
            if (!bookingId) {
              throw new Error("Booking ID is missing");
            }
            
            if (!user?.id) {
              throw new Error("User ID is missing");
            }

            const result = await cancelOrder(bookingId, user.id);
            console.log("Cancel result:", result);
            message.success("Hủy lịch hẹn thành công!");
            loadBookings(); // Reload bookings after cancellation
          } catch (error) {
            console.error("Cancel booking error:", error);
            console.error(
              "Error details:",
              error.response?.data || error.message
            );
            message.error(
              "Hủy lịch hẹn thất bại! " +
                (error.response?.data?.message || error.message || "")
            );
          }
        },
        onCancel: () => {
          console.log("User cancelled the modal");
        }
      });

      console.log("Modal instance created:", modalInstance);

      // Fallback: if Modal doesn't show, use browser confirm
      setTimeout(() => {
        console.log("Checking if modal is visible...");
        const modalElement = document.querySelector('.ant-modal-confirm');
        if (!modalElement) {
          console.warn("Modal not visible, using browser confirm as fallback");
          const confirmed = window.confirm(
            "Bạn có chắc chắn muốn hủy lịch hẹn này không? Thao tác này không thể hoàn tác."
          );
          
          if (confirmed) {
            handleCancelConfirmed(bookingId);
          }
        }
      }, 100);

    } catch (modalError) {
      console.error("Error creating Modal:", modalError);
      
      // Fallback to browser confirm if Modal fails
      const confirmed = window.confirm(
        "Bạn có chắc chắn muốn hủy lịch hẹn này không? Thao tác này không thể hoàn tác."
      );
      
      if (confirmed) {
        handleCancelConfirmed(bookingId);
      }
    }
  };

  const handleCancelConfirmed = async (bookingId) => {
    try {
      console.log("Executing cancellation for booking:", bookingId);
      
      if (!bookingId) {
        throw new Error("Booking ID is missing");
      }
      
      if (!user?.id) {
        throw new Error("User ID is missing");
      }

      const result = await cancelOrder(bookingId, user.id);
      console.log("Cancel result:", result);
      message.success("Hủy lịch hẹn thành công!");
      loadBookings(); // Reload bookings after cancellation
    } catch (error) {
      console.error("Cancel booking error:", error);
      console.error(
        "Error details:",
        error.response?.data || error.message
      );
      message.error(
        "Hủy lịch hẹn thất bại! " +
          (error.response?.data?.message || error.message || "")
      );
    }
  };

  const handleViewDetail = (booking) => {
    setSelectedBooking(booking);
    setDetailModalVisible(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    let matchesSearch = true;
    let matchesDate = true;

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      matchesSearch =
        booking.id?.toLowerCase().includes(keyword) ||
        booking.items?.some(
          (item) =>
            item.serviceName?.toLowerCase().includes(keyword) ||
            item.productName?.toLowerCase().includes(keyword)
        );
    }

    if (dateRange && dateRange.length === 2) {
      const bookingDate = dayjs(booking.appointmentDate);
      matchesDate = bookingDate.isBetween(
        dateRange[0],
        dateRange[1],
        "day",
        "[]"
      );
    }

    return matchesSearch && matchesDate;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };

  const columns = [
    {
      title: "Mã lịch hẹn",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id) => (
        <Text code style={{ fontWeight: 600 }}>
          #{id?.slice(-8) || "N/A"}
        </Text>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {items && items.length > 0
              ? items[0].serviceName || items[0].productName
              : "N/A"}
          </div>
          {items && items.length > 1 && (
            <div style={{ fontSize: 12, color: "#666" }}>
              +{items.length - 1} dịch vụ khác
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Ngày & Giờ",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => (
        <div>
          <div>
            <CalendarOutlined style={{ marginRight: 4, color: "#1890ff" }} />
            {new Date(date).toLocaleDateString("vi-VN")}
          </div>
          <div style={{ fontSize: 12, color: "#666" }}>
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {new Date(date).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <Text strong style={{ color: "#1890ff" }}>
          {formatPrice(amount)}
        </Text>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusCode",
      key: "statusCode",
      render: (statusCode, record) => {
        const currentStatus = statusCode || record.status || "PENDING";
        return (
          <Tag color={APPOINTMENT_STATUS_COLORS[currentStatus]}>
            {APPOINTMENT_STATUS_LABELS[currentStatus] || currentStatus}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          {canCancelOrder(record.statusCode || record.status) && (
            <Tooltip title="Hủy lịch hẹn">
              <Button
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleCancelBooking(record.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  // Show loading if not logged in or no user data
  if (!isLoggedIn || !user) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin
          size="large"
          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
        />
        <div style={{ marginTop: 16 }}>
          <Text>Đang kiểm tra thông tin đăng nhập...</Text>
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
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              {" "}
              <Title level={2} style={{ color: "#1890ff", marginBottom: 8 }}>
                Lịch hẹn của tôi
              </Title>
              {user && (
                <Text type="secondary">
                  Xin chào, {user.fullName || user.name} - {user.phone}
                </Text>
              )}
            </div>

            {/* Statistics Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
              <Col xs={12} sm={6}>
                <Card size="small">
                  <Statistic
                    title="Tổng lịch hẹn"
                    value={statistics.total}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small">
                  <Statistic
                    title="Chờ xác nhận"
                    value={statistics.pending}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small">
                  <Statistic
                    title="Đã xác nhận"
                    value={statistics.confirmed}
                    prefix={<CheckCircleOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={6}>
                <Card size="small">
                  <Statistic
                    title="Hoàn thành"
                    value={statistics.completed}
                    prefix={<DollarOutlined />}
                    valueStyle={{ color: "#13c2c2" }}
                  />
                </Card>
              </Col>
            </Row>

            {/* Filters */}
            <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
              <Col xs={24} sm={12} lg={8}>
                <Search
                  placeholder="Tìm kiếm theo mã lịch hẹn hoặc tên dịch vụ..."
                  onSearch={setSearchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  enterButton={<SearchOutlined />}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <RangePicker
                  style={{ width: "100%" }}
                  placeholder={["Từ ngày", "Đến ngày"]}
                  format="DD/MM/YYYY"
                  onChange={setDateRange}
                />
              </Col>
              <Col xs={24} sm={12} lg={8}>
                {" "}
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadBookings}
                  loading={loading}
                >
                  Làm mới
                </Button>
              </Col>
            </Row>

            {/* Bookings Table */}
            <Table
              columns={columns}
              dataSource={filteredBookings}
              rowKey="id"
              loading={loading}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} của ${total} lịch hẹn`,
              }}
              locale={{
                emptyText: (
                  <Empty
                    description="Chưa có lịch hẹn nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  >
                    <Button
                      type="primary"
                      onClick={() => navigate("/services")}
                    >
                      Đặt lịch ngay
                    </Button>
                  </Empty>
                ),
              }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Booking Detail Modal */}
      <Modal
        title={
          <Space>
            <EyeOutlined />
            Chi tiết lịch hẹn #{selectedBooking?.id?.slice(-8) || "N/A"}
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
          selectedBooking &&
            canCancelOrder(
              selectedBooking.statusCode || selectedBooking.status
            ) && (
              <Button
                key="cancel"
                danger
                onClick={() => {
                  setDetailModalVisible(false);
                  handleCancelBooking(selectedBooking.id);
                }}
              >
                Hủy lịch hẹn
              </Button>
            ),
        ]}
        width={800}
      >
        {selectedBooking && (
          <div>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="Mã lịch hẹn">
                <Text code>{selectedBooking.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày & Giờ hẹn">
                <Space>
                  <CalendarOutlined />
                  {new Date(selectedBooking.appointmentDate).toLocaleDateString(
                    "vi-VN"
                  )}
                  <ClockCircleOutlined />
                  {new Date(selectedBooking.appointmentDate).toLocaleTimeString(
                    "vi-VN",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={
                    APPOINTMENT_STATUS_COLORS[
                      selectedBooking.statusCode || selectedBooking.status
                    ]
                  }
                >
                  {APPOINTMENT_STATUS_LABELS[
                    selectedBooking.statusCode || selectedBooking.status
                  ] || selectedBooking.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tổng tiền">
                <Text strong style={{ color: "#1890ff", fontSize: 16 }}>
                  {formatPrice(selectedBooking.totalAmount)}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú">
                {selectedBooking.note || "Không có ghi chú"}
              </Descriptions.Item>
            </Descriptions>

            <Divider>Dịch vụ đã đặt</Divider>

            {selectedBooking.items && selectedBooking.items.length > 0 ? (
              <Table
                dataSource={selectedBooking.items}
                rowKey="id"
                pagination={false}
                size="small"
                columns={[
                  {
                    title: "Dịch vụ",
                    dataIndex: "serviceName",
                    key: "serviceName",
                    render: (name, record) =>
                      name || record.productName || "N/A",
                  },
                  {
                    title: "Số lượng",
                    dataIndex: "quantity",
                    key: "quantity",
                  },
                  {
                    title: "Đơn giá",
                    dataIndex: "unitPrice",
                    key: "unitPrice",
                    render: (price, record) =>
                      formatPrice(price || record.price || 0),
                  },
                  {
                    title: "Thành tiền",
                    dataIndex: "totalPrice",
                    key: "totalPrice",
                    render: (total, record) =>
                      formatPrice(
                        total ||
                          (record.unitPrice || record.price || 0) *
                            (record.quantity || 1)
                      ),
                  },
                ]}
              />
            ) : (
              <Empty description="Không có dịch vụ nào" />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;
