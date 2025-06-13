import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Space,
  Tag,
  Typography,
  message,
  Modal,
  Input,
  Row,
  Col,
  Statistic,
  Avatar,
  Tooltip,
  Dropdown,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UserOutlined,
  MoreOutlined,
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getCustomers,
  deleteCustomer,
  searchCustomers,
  updateCustomerStatus,
} from "./customerAPI";

const { Title } = Typography;
const { Search } = Input;

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, []);
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log("CustomerList: Starting fetchCustomers...");
      const data = await getCustomers();
      console.log("CustomerList: Received data from getCustomers:", data);
      console.log("CustomerList: Data type:", typeof data);
      console.log("CustomerList: Is array:", Array.isArray(data));

      setCustomers(data || []);
      console.log("CustomerList: Set customers state to:", data || []);
    } catch (error) {
      console.error("CustomerList: Error in fetchCustomers:", error);
      message.error("Không thể tải danh sách khách hàng!");
      setCustomers([]); // Ensure customers is always an array
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = async (value) => {
    try {
      setLoading(true);
      setSearchKeyword(value);
      if (value.trim()) {
        console.log("CustomerList: Starting search with keyword:", value);
        const data = await searchCustomers(value);
        console.log("CustomerList: Received search data:", data);
        setCustomers(data || []);
      } else {
        await fetchCustomers();
      }
    } catch (error) {
      console.error("CustomerList: Error in handleSearch:", error);
      message.error("Tìm kiếm thất bại!");
      setCustomers([]); // Ensure customers is always an array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      message.success("Xóa khách hàng thành công!");
      fetchCustomers();
    } catch (error) {
      message.error("Xóa khách hàng thất bại!");
    }
  };

  const handleStatusChange = async (id, isActive) => {
    try {
      await updateCustomerStatus(id, isActive);
      message.success(
        `${isActive ? "Kích hoạt" : "Vô hiệu hóa"} khách hàng thành công!`
      );
      fetchCustomers();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại!");
    }
  };

  const getActionMenu = (record) => ({
    items: [
      {
        key: "view",
        icon: <EyeOutlined />,
        label: "Xem chi tiết",
        onClick: () => navigate(`/admin/customers/${record.id}`),
      },
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Chỉnh sửa",
        onClick: () => navigate(`/admin/customers/${record.id}/edit`),
      },
      {
        type: "divider",
      },
      {
        key: "status",
        icon: record.isActive ? <StopOutlined /> : <CheckCircleOutlined />,
        label: record.isActive ? "Vô hiệu hóa" : "Kích hoạt",
        onClick: () => handleStatusChange(record.id, !record.isActive),
      },
      {
        type: "divider",
      },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Xóa",
        danger: true,
        onClick: () => {
          Modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc chắn muốn xóa khách hàng "${record.fullName}"?`,
            okText: "Xóa",
            cancelText: "Hủy",
            okType: "danger",
            onOk: () => handleDelete(record.id),
          });
        },
      },
    ],
  });

  const columns = [
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.fullName}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{record.email}</div>
          </div>
        </Space>
      ),
      width: 250,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Hoạt động" : "Không hoạt động"}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Ngày đăng ký",
      dataIndex: "registeredAt",
      key: "registeredAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
      width: 120,
    },
    {
      title: "Cập nhật lần cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
      width: 140,
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/customers/${record.id}`)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/customers/${record.id}/edit`)}
            />
          </Tooltip>
          <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];
  // Calculate statistics - ensure customers is an array
  const customersArray = customers || [];
  const totalCustomers = customersArray.length;
  const activeCustomers = customersArray.filter((c) => c.isActive).length;
  const newCustomers = customersArray.filter((c) => {
    if (!c.registeredAt) return false;
    const regDate = new Date(c.registeredAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return regDate >= thirtyDaysAgo;
  }).length;

  return (
    <div>
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng khách hàng"
              value={totalCustomers}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đang hoạt động"
              value={activeCustomers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Khách hàng mới (30 ngày)"
              value={newCustomers}
              prefix={<PlusOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tỷ lệ hoạt động"
              value={
                totalCustomers > 0
                  ? ((activeCustomers / totalCustomers) * 100).toFixed(1)
                  : 0
              }
              suffix="%"
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                Quản lý khách hàng
              </Title>
            </Col>
            <Col>
              {" "}
              <Space>
                <Search
                  placeholder="Tìm kiếm khách hàng..."
                  allowClear
                  onSearch={handleSearch}
                  style={{ width: 300 }}
                  enterButton={<SearchOutlined />}
                />

                <Button
                  icon={<ReloadOutlined />}
                  onClick={fetchCustomers}
                  loading={loading}
                >
                  Làm mới
                </Button>
                <Button
                  icon={<ExportOutlined />}
                  onClick={() =>
                    message.info("Tính năng xuất dữ liệu đang phát triển")
                  }
                >
                  Xuất Excel
                </Button>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate("/admin/customers/create")}
                >
                  Thêm khách hàng
                </Button>
              </Space>
            </Col>
          </Row>
        </div>{" "}
        <Table
          columns={columns}
          dataSource={customersArray}
          loading={loading}
          rowKey="id"
          pagination={{
            total: customersArray.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} khách hàng`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>
    </div>
  );
};

export default CustomerList;
