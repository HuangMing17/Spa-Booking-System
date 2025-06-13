import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  message,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Modal,
  Tooltip,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
  CalendarOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  searchOrders,
  getOrdersByStatus,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
  APPOINTMENT_STATUS_COLORS,
  canEditOrder,
  canCancelOrder,
} from "./orderAPI";

const { Search } = Input;
const { Option } = Select;

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, searchKeyword]); // Add searchKeyword to dependencies

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let data;

      if (searchKeyword) {
        data = await searchOrders(searchKeyword);
      } else if (statusFilter !== "ALL") {
        data = await getOrdersByStatus(statusFilter);
      } else {
        // Fetch all appointments using the new API function
        data = await getAllOrders();
      }

      // Ensure data is always an array
      const appointmentData = Array.isArray(data) ? data : [];

      setAppointments(appointmentData);
      calculateStatistics(appointmentData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      message.error("Không thể tải danh sách lịch hẹn!");
      setAppointments([]); // Ensure appointments is always an array
    } finally {
      setLoading(false);
    }
  };
  const calculateStatistics = (appointmentData) => {
    const stats = {
      total: appointmentData.length,
      pending: appointmentData.filter(
        (a) => (a.statusCode || a.status) === APPOINTMENT_STATUS.PENDING
      ).length,
      confirmed: appointmentData.filter(
        (a) => (a.statusCode || a.status) === APPOINTMENT_STATUS.CONFIRMED
      ).length,
      completed: appointmentData.filter(
        (a) => (a.statusCode || a.status) === APPOINTMENT_STATUS.COMPLETED
      ).length,
      cancelled: appointmentData.filter(
        (a) => (a.statusCode || a.status) === APPOINTMENT_STATUS.CANCELLED
      ).length,
    };
    setStatistics(stats);
  };
  const handleSearch = (value) => {
    setSearchKeyword(value);
    setStatusFilter("ALL");
    // fetchAppointments will be called by useEffect when searchKeyword changes
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setSearchKeyword("");
    // fetchAppointments will be called by useEffect when statusFilter changes
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateOrderStatus(appointmentId, newStatus);
      message.success("Cập nhật trạng thái lịch hẹn thành công!");
      fetchAppointments();
    } catch (error) {
      message.error("Cập nhật trạng thái lịch hẹn thất bại!");
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    Modal.confirm({
      title: "Xác nhận hủy lịch hẹn",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn hủy lịch hẹn này không?",
      okText: "Hủy lịch hẹn",
      cancelText: "Quay lại",
      okType: "danger",
      onOk: async () => {
        try {
          await cancelOrder(appointmentId);
          message.success("Hủy lịch hẹn thành công!");
          fetchAppointments();
        } catch (error) {
          message.error("Hủy lịch hẹn thất bại!");
        }
      },
    });
  };

  const getActionMenuItems = (record) => {
    const items = [
      {
        key: "view",
        icon: <EyeOutlined />,
        label: "Xem chi tiết",
        onClick: () => navigate(`/admin/orders/${record.id}`),
      },
    ];

    if (canEditOrder(record.statusCode || record.status)) {
      items.push({
        key: "edit",
        icon: <EditOutlined />,
        label: "Chỉnh sửa lịch hẹn",
        onClick: () => navigate(`/admin/orders/${record.id}/edit`),
      });
    }

    if (canCancelOrder(record.statusCode || record.status)) {
      items.push({
        key: "cancel",
        icon: <DeleteOutlined />,
        label: "Hủy lịch hẹn",
        danger: true,
        onClick: () => handleCancelAppointment(record.id),
      });
    }

    return items;
  };

  const columns = [
    {
      title: "Mã lịch hẹn",
      dataIndex: "id",
      key: "id",
      width: 120,
      render: (id) => (
        <Button
          type="link"
          onClick={() => navigate(`/admin/orders/${id}`)}
          style={{ padding: 0, fontWeight: 600 }}
        >
          #LH{id.slice(-6)}
        </Button>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      render: (customerName, record) => {
        // Use the direct fields from API response
        const name =
          customerName || record.customer?.fullName || "Không có tên";
        const phone =
          record.customerPhone || record.customer?.phone || "Không có SĐT";

        return (
          <div>
            <div style={{ fontWeight: 500 }}>{name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{phone}</div>
          </div>
        );
      },
    },
    {
      title: "Ngày hẹn",
      dataIndex: "appointmentDate",
      key: "appointmentDate",
      render: (date) => (
        <div>
          <CalendarOutlined style={{ marginRight: 4, color: "#1890ff" }} />
          {new Date(date).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          <br />
          <ClockCircleOutlined style={{ marginRight: 4, color: "#666" }} />
          <span style={{ fontSize: 12, color: "#666" }}>
            {new Date(date).toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      ),
    },
    {
      title: "Dịch vụ",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <div>
          <div style={{ fontWeight: 500 }}>{items?.length || 0} dịch vụ</div>
          {items && items.length > 0 && (
            <div style={{ fontSize: 12, color: "#666" }}>
              {items[0].serviceName}
              {items.length > 1 && ` +${items.length - 1} khác`}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => (
        <div style={{ fontWeight: 600, color: "#1890ff" }}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(amount || 0)}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "statusCode",
      key: "statusCode",
      render: (statusCode, record) => {
        // Use statusCode from API response, fallback to status field
        const currentStatus = statusCode || record.status || "PENDING";
        const statusDisplay =
          record.statusName ||
          APPOINTMENT_STATUS_LABELS[currentStatus] ||
          currentStatus;

        return (
          <Select
            value={currentStatus}
            style={{ width: 140 }}
            onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
            disabled={!canEditOrder(currentStatus)}
          >
            {Object.entries(APPOINTMENT_STATUS).map(([key, value]) => (
              <Option key={value} value={value}>
                <Tag
                  color={APPOINTMENT_STATUS_COLORS[value]}
                  style={{ margin: 0 }}
                >
                  {APPOINTMENT_STATUS_LABELS[value]}
                </Tag>
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{ items: getActionMenuItems(record) }}
          placement="bottomRight"
        >
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {" "}
      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lịch hẹn"
              value={statistics.total}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Chờ xác nhận"
              value={statistics.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Đã xác nhận"
              value={statistics.confirmed}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hoàn thành"
              value={statistics.completed}
              prefix={<DollarOutlined />}
              valueStyle={{ color: "#13c2c2" }}
            />
          </Card>
        </Col>
      </Row>{" "}
      {/* Main Content */}
      <Card
        title="Quản lý lịch hẹn"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/orders/create")}
          >
            Tạo lịch hẹn mới
          </Button>
        }
      >
        {/* Filters */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} lg={8}>
            <Search
              placeholder="Tìm kiếm theo mã lịch hẹn, tên khách hàng, SĐT..."
              onSearch={handleSearch}
              enterButton={<SearchOutlined />}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Select
              placeholder="Lọc theo trạng thái"
              style={{ width: "100%" }}
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              {Object.entries(APPOINTMENT_STATUS_LABELS).map(([key, label]) => (
                <Option key={key} value={key}>
                  <Tag
                    color={APPOINTMENT_STATUS_COLORS[key]}
                    style={{ margin: 0 }}
                  >
                    {label}
                  </Tag>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>

        {/* Appointments Table */}
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} lịch hẹn`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default AppointmentList;
