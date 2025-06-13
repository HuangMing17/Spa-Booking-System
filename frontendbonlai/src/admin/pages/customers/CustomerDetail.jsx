import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Descriptions,
  Space,
  Button,
  Tag,
  Avatar,
  Row,
  Col,
  Statistic,
  Table,
  Timeline,
  message,
  Modal,
  Divider,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerById, deleteCustomer } from "./customerAPI";

const { Title, Text } = Typography;

const CustomerDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (error) {
      message.error("Không thể tải thông tin khách hàng!");
      navigate("/admin/customers");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa khách hàng "${customer?.fullName}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteCustomer(id);
          message.success("Xóa khách hàng thành công!");
          navigate("/admin/customers");
        } catch (error) {
          message.error("Xóa khách hàng thất bại!");
        }
      },
    });
  };

  if (loading) {
    return <Card loading={true} />;
  }

  if (!customer) {
    return <Card>Không tìm thấy thông tin khách hàng!</Card>;
  }

  // Mock data for demonstration - replace with actual API data
  const mockBookings = [
    {
      id: "1",
      service: "Massage thư giãn",
      date: "2024-01-15",
      status: "completed",
      amount: 500000,
    },
    {
      id: "2",
      service: "Chăm sóc da mặt",
      date: "2024-01-20",
      status: "cancelled",
      amount: 300000,
    },
  ];

  const bookingColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Ngày đặt",
      dataIndex: "date",
      key: "date",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusConfig = {
          completed: { color: "green", text: "Hoàn thành" },
          cancelled: { color: "red", text: "Đã hủy" },
          pending: { color: "orange", text: "Chờ xác nhận" },
        };
        const config = statusConfig[status] || {
          color: "default",
          text: status,
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `${amount.toLocaleString()} VNĐ`,
    },
  ];

  const addressColumns = [
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const typeConfig = {
          home: { color: "blue", text: "Nhà riêng" },
          office: { color: "green", text: "Văn phòng" },
          other: { color: "orange", text: "Khác" },
        };
        const config = typeConfig[type] || {
          color: "default",
          text: type || "Chưa xác định",
        };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Địa chỉ",
      key: "address",
      render: (_, record) => (
        <div>
          <div>{record.street}</div>
          <Text type="secondary">
            {[record.ward, record.district, record.city]
              .filter(Boolean)
              .join(", ")}
          </Text>
        </div>
      ),
    },
    {
      title: "Mặc định",
      dataIndex: "isDefault",
      key: "isDefault",
      render: (isDefault) =>
        isDefault ? <Tag color="gold">Mặc định</Tag> : null,
    },
  ];

  const totalSpent = mockBookings
    .filter((booking) => booking.status === "completed")
    .reduce((sum, booking) => sum + booking.amount, 0);

  const completedBookings = mockBookings.filter(
    (booking) => booking.status === "completed"
  ).length;

  return (
    <div>
      <Card>
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: 24 }}
        >
          <Col>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/customers")}
              >
                Quay lại
              </Button>
              <Title level={3} style={{ margin: 0 }}>
                Chi tiết khách hàng
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => navigate(`/admin/customers/${id}/edit`)}
              >
                Chỉnh sửa
              </Button>
              <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                Xóa
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Customer Info Header */}
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card style={{ textAlign: "center" }}>
              <Avatar
                size={80}
                icon={<UserOutlined />}
                style={{ marginBottom: 16 }}
              />
              <Title level={4} style={{ margin: 0 }}>
                {customer.fullName}
              </Title>
              <Tag
                color={customer.isActive ? "green" : "red"}
                style={{ marginTop: 8 }}
              >
                {customer.isActive ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            </Card>
          </Col>
          <Col span={18}>
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Tổng chi tiêu"
                    value={totalSpent}
                    suffix="VNĐ"
                    valueStyle={{ color: "#3f8600" }}
                    prefix={<ShoppingOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Số lần sử dụng dịch vụ"
                    value={completedBookings}
                    valueStyle={{ color: "#1890ff" }}
                    prefix={<CalendarOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Địa chỉ đã lưu"
                    value={customer.addresses?.length || 0}
                    valueStyle={{ color: "#722ed1" }}
                    prefix={<HomeOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Customer Details */}
        <Card title="Thông tin cơ bản" style={{ marginBottom: 24 }}>
          <Descriptions bordered column={2}>
            <Descriptions.Item label="ID" span={2}>
              {customer.id}
            </Descriptions.Item>
            <Descriptions.Item label="Họ và tên">
              {customer.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Space>
                <MailOutlined />
                {customer.email}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              <Space>
                <PhoneOutlined />
                {customer.phone}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={customer.isActive ? "green" : "red"}>
                {customer.isActive ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đăng ký">
              {customer.registeredAt
                ? new Date(customer.registeredAt).toLocaleDateString("vi-VN")
                : "Chưa có"}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật lần cuối">
              {customer.updatedAt
                ? new Date(customer.updatedAt).toLocaleDateString("vi-VN")
                : "Chưa có"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* Addresses */}
        <Card
          title="Địa chỉ"
          style={{ marginBottom: 24 }}
          extra={
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => navigate(`/admin/customers/${id}/edit`)}
            >
              Thêm địa chỉ
            </Button>
          }
        >
          {customer.addresses && customer.addresses.length > 0 ? (
            <Table
              columns={addressColumns}
              dataSource={customer.addresses}
              rowKey="id"
              pagination={false}
              size="small"
            />
          ) : (
            <div
              style={{ textAlign: "center", padding: "40px 0", color: "#999" }}
            >
              <HomeOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <div>Chưa có địa chỉ nào được lưu</div>
            </div>
          )}
        </Card>

        {/* Booking History */}
        <Card title="Lịch sử đặt lịch">
          <Table
            columns={bookingColumns}
            dataSource={mockBookings}
            rowKey="id"
            pagination={{
              pageSize: 5,
              showSizeChanger: false,
            }}
            locale={{
              emptyText: (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                    color: "#999",
                  }}
                >
                  <CalendarOutlined
                    style={{ fontSize: 48, marginBottom: 16 }}
                  />
                  <div>Chưa có lịch sử đặt lịch</div>
                </div>
              ),
            }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default CustomerDetail;
