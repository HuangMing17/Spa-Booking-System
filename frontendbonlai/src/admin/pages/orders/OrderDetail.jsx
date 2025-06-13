import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Descriptions,
  Space,
  Button,
  Tag,
  Row,
  Col,
  Table,
  message,
  Modal,
  Statistic,
  Divider,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  PrinterOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  GiftOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
  canEditOrder,
  canCancelOrder,
  calculateTotalAmount,
  calculateTotalDuration,
} from "./orderAPI";

const { Title, Text } = Typography;

const AppointmentDetail = () => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    fetchAppointment();
  }, [id]);
  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);

      setAppointment(data);
    } catch (error) {
      message.error("Không thể tải thông tin lịch hẹn!");
      navigate("/admin/appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      message.success("Cập nhật trạng thái thành công!");
      fetchAppointment();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleCancelAppointment = () => {
    Modal.confirm({
      title: "Xác nhận hủy lịch hẹn",
      icon: <ExclamationCircleOutlined />,
      content:
        "Bạn có chắc chắn muốn hủy lịch hẹn này không? Thao tác này không thể hoàn tác.",
      okText: "Hủy lịch hẹn",
      cancelText: "Quay lại",
      okType: "danger",
      onOk: async () => {
        try {
          await cancelOrder(id);
          message.success("Hủy lịch hẹn thành công!");
          fetchAppointment();
        } catch (error) {
          message.error("Hủy lịch hẹn thất bại!");
        }
      },
    });
  };

  if (loading) {
    return <Card loading={true} />;
  }
  if (!appointment) {
    return <Card>Không tìm thấy thông tin lịch hẹn!</Card>;
  }
  const serviceColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "productName",
      key: "productName",
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name || record.serviceName}</div>
          <div style={{ fontSize: 12, color: "#666" }}>
            {record.variantName}
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      width: 120,
      render: (duration, record) => (
        <span>{duration * record.quantity} phút</span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      width: 150,
      render: (unitPrice, record) => {
        // Use unitPrice from API response, fallback to price field
        const price = unitPrice || record.price || 0;
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price);
      },
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 150,
      render: (_, record) => {
        // Use totalPrice from API response, or calculate from unitPrice * quantity
        const total =
          record.totalPrice ||
          (record.unitPrice || record.price || 0) * record.quantity;
        return new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(total);
      },
    },
  ];
  const totalAmount = calculateTotalAmount(
    appointment.items || [],
    appointment.couponDiscount || 0
  );
  const totalDuration = calculateTotalDuration(appointment.items || []);

  const cardStyle = {
    marginBottom: 24,
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f0f0f0",
  };

  return (
    <div
      style={{
        padding: "24px",
        maxWidth: "1400px",
        margin: "0 auto",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Card style={cardStyle}>
        <Row justify="space-between" align="middle">
          <Col xs={24} lg={12}>
            <Space size="middle">
              {" "}
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/appointments")}
              >
                Quay lại
              </Button>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  Chi tiết lịch hẹn #{id.slice(-8)}
                </Title>{" "}
                <Tag
                  color={
                    APPOINTMENT_STATUS_COLORS[
                      appointment.statusCode || appointment.status
                    ]
                  }
                  style={{ marginTop: 8 }}
                >
                  {
                    APPOINTMENT_STATUS_LABELS[
                      appointment.statusCode || appointment.status
                    ]
                  }
                </Tag>
              </div>
            </Space>
          </Col>
          <Col xs={24} lg={12} style={{ textAlign: "right" }}>
            {" "}
            <Space size="middle" wrap>
              <Button icon={<PrinterOutlined />}>In lịch hẹn</Button>
              {canEditOrder(appointment.statusCode || appointment.status) && (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/admin/appointments/${id}/edit`)}
                >
                  Chỉnh sửa
                </Button>
              )}
              {canCancelOrder(appointment.statusCode || appointment.status) && (
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleCancelAppointment}
                >
                  Hủy lịch hẹn
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Customer Information */}
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Thông tin khách hàng
              </Title>
            }
            style={cardStyle}
          >
            <Descriptions bordered column={1} size="middle">
              {" "}
              <Descriptions.Item
                label={<strong>Họ và tên</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                {" "}
                <Space>
                  <UserOutlined />
                  <Text strong>
                    {appointment.customerName ||
                      appointment.customer?.fullName ||
                      "Không có tên"}
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item
                label={<strong>Số điện thoại</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Space>
                  <PhoneOutlined />
                  <Text>
                    {appointment.customerPhone ||
                      appointment.customer?.phone ||
                      "Không có SĐT"}
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item
                label={<strong>Email</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Space>
                  <MailOutlined />
                  <Text>
                    {appointment.customerEmail ||
                      appointment.customer?.email ||
                      "Không có email"}
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item
                label={<strong>Ngày hẹn</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Space>
                  <CalendarOutlined />
                  <Text>
                    {new Date(appointment.appointmentDate).toLocaleDateString(
                      "vi-VN",
                      {
                        weekday: "long",
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </Text>
                </Space>
              </Descriptions.Item>
              <Descriptions.Item
                label={<strong>Giờ hẹn</strong>}
                labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
              >
                <Space>
                  <ClockCircleOutlined />
                  <Text>
                    {new Date(appointment.appointmentDate).toLocaleTimeString(
                      "vi-VN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Text>
                </Space>
              </Descriptions.Item>
              {appointment.notes && (
                <Descriptions.Item
                  label={<strong>Ghi chú</strong>}
                  labelStyle={{ width: "200px", backgroundColor: "#fafafa" }}
                >
                  <Text>{appointment.notes}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>

          {/* Services List */}
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Danh sách dịch vụ
              </Title>
            }
            style={cardStyle}
          >
            {" "}
            <Table
              columns={serviceColumns}
              dataSource={appointment.items || []}
              rowKey={(record, index) =>
                `${record.productId}-${record.variantId}-${index}`
              }
              pagination={false}
              bordered
              size="middle"
              locale={{
                emptyText: "Không có dịch vụ nào",
              }}
            />
            {/* Appointment Summary */}
            <div
              style={{
                marginTop: 16,
                padding: 16,
                backgroundColor: "#f8f9fa",
                borderRadius: 8,
              }}
            >
              <Row justify="space-between" style={{ marginBottom: 8 }}>
                <Text>Tạm tính:</Text>
                <Text>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(calculateTotalAmount(appointment.items || [], 0))}
                </Text>
              </Row>
              {appointment.couponDiscount > 0 && (
                <>
                  <Row justify="space-between" style={{ marginBottom: 8 }}>
                    <Text>
                      <GiftOutlined
                        style={{ marginRight: 4, color: "#52c41a" }}
                      />
                      Mã giảm giá ({appointment.couponCode}):
                    </Text>
                    <Text style={{ color: "#52c41a" }}>
                      -
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(appointment.couponDiscount)}
                    </Text>
                  </Row>
                </>
              )}
              <Divider style={{ margin: "12px 0" }} />
              <Row justify="space-between">
                <Text strong style={{ fontSize: 16 }}>
                  Tổng cộng:
                </Text>
                <Text strong style={{ fontSize: 16, color: "#1890ff" }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmount)}
                </Text>
              </Row>{" "}
            </div>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {" "}
          {/* Appointment Statistics */}
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Thống kê lịch hẹn
              </Title>
            }
            style={cardStyle}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card size="small" style={{ textAlign: "center" }}>
                  <Statistic
                    title="Tổng số dịch vụ"
                    value={appointment.items?.length || 0}
                    prefix={<ShoppingCartOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card size="small" style={{ textAlign: "center" }}>
                  <Statistic
                    title="Tổng thời gian"
                    value={totalDuration}
                    suffix="phút"
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Card>
              </Col>
              <Col span={24}>
                <Card size="small" style={{ textAlign: "center" }}>
                  <Statistic
                    title="Tổng tiền"
                    value={totalAmount}
                    precision={0}
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value)
                    }
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Card>
              </Col>
            </Row>
          </Card>{" "}
          {/* Quick Actions */}
          {canEditOrder(appointment.statusCode || appointment.status) && (
            <Card
              title={
                <Title level={4} style={{ margin: 0 }}>
                  Thao tác nhanh
                </Title>
              }
              style={cardStyle}
            >
              <Space
                direction="vertical"
                style={{ width: "100%" }}
                size="middle"
              >
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() =>
                    handleStatusChange(APPOINTMENT_STATUS.CONFIRMED)
                  }
                  disabled={
                    (appointment.statusCode || appointment.status) !==
                    APPOINTMENT_STATUS.PENDING
                  }
                >
                  Xác nhận lịch hẹn
                </Button>
                <Button
                  block
                  size="large"
                  onClick={() =>
                    handleStatusChange(APPOINTMENT_STATUS.PROCESSING)
                  }
                  disabled={
                    (appointment.statusCode || appointment.status) !==
                    APPOINTMENT_STATUS.CONFIRMED
                  }
                >
                  Bắt đầu thực hiện
                </Button>
                <Button
                  type="primary"
                  block
                  size="large"
                  onClick={() =>
                    handleStatusChange(APPOINTMENT_STATUS.COMPLETED)
                  }
                  disabled={
                    (appointment.statusCode || appointment.status) !==
                    APPOINTMENT_STATUS.PROCESSING
                  }
                >
                  Hoàn thành
                </Button>
              </Space>
            </Card>
          )}
          {/* Appointment Information */}
          <Card
            title={
              <Title level={4} style={{ margin: 0 }}>
                Thông tin lịch hẹn
              </Title>
            }
            style={cardStyle}
          >
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã lịch hẹn">
                <Text code>#{id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(appointment.createdAt).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Cập nhật lần cuối">
                {new Date(appointment.updatedAt).toLocaleString("vi-VN")}
              </Descriptions.Item>
              <Descriptions.Item label="Người tạo">
                {appointment.createdBy || "Admin"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AppointmentDetail;
