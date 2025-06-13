import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  message,
  Input,
  Tooltip,
  Tag,
  Image,
  Popconfirm,
  Select,
  Typography,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  fetchServices,
  searchServices,
  deleteService,
  getServicesByCategory,
} from "./serviceAPI";
import ServiceForm from "./ServiceForm";
import ServiceDetail from "./ServiceDetail";
import axios from "../../../utils/axios";
import { getImageUrl, getPlaceholderImage } from "../../../utils/imageUtils";

const { Text } = Typography;
const { Option } = Select;

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch services
  const fetchAllServices = async () => {
    setLoading(true);
    try {
      const response = await fetchServices();
      setServices(Array.isArray(response) ? response : []);
      console.log("Services data:", response);
    } catch (error) {
      message.error("Không thể tải danh sách dịch vụ!");
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter
  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Search services
  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchAllServices();
      return;
    }

    setLoading(true);
    try {
      const response = await searchServices(searchKeyword);
      setServices(Array.isArray(response) ? response : []);
      console.log("Search results:", response);
    } catch (error) {
      message.error("Lỗi khi tìm kiếm dịch vụ!");
      console.error("Error searching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter services by category
  const handleCategoryFilter = async (categoryId) => {
    setSelectedCategory(categoryId);
    if (!categoryId) {
      fetchAllServices();
      return;
    }

    setLoading(true);
    try {
      const response = await getServicesByCategory(categoryId);
      setServices(Array.isArray(response) ? response : []);
    } catch (error) {
      message.error("Lỗi khi lọc dịch vụ theo danh mục!");
      console.error("Error filtering services:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete service
  const handleDeleteService = async (id) => {
    try {
      setLoading(true);
      await deleteService(id);
      message.success("Xóa dịch vụ thành công!");
      await fetchAllServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      message.error(
        error?.response?.data?.message ||
          "Không thể xóa dịch vụ. Vui lòng thử lại sau!"
      );
    } finally {
      setLoading(false);
    }
  };

  // View service details
  const viewServiceDetails = (service) => {
    setSelectedService(service);
    setDetailVisible(true);
  };

  // Open form for editing
  const editService = (service) => {
    console.log("Editing service:", service);
    setEditingService(service);
    setFormVisible(true);
  };

  // Handle form submission result
  const handleFormSubmit = () => {
    setFormVisible(false);
    setEditingService(null);
    fetchAllServices();
  };

  // Initial data load
  useEffect(() => {
    fetchAllServices();
    fetchCategories();
  }, []);

  // Table columns
  const columns = [
    {
      title: "Tên dịch vụ",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <a onClick={() => viewServiceDetails(record)}>{text}</a>
      ),
    },
    {
      title: "Danh mục",
      key: "category",
      render: (_, record) => (
        <span>
          {record.categoryName ||
            (record.category && record.category.name) ||
            (record.categories &&
              record.categories.length > 0 &&
              record.categories.map((cat) => cat.name).join(", ")) ||
            "Chưa phân loại"}
        </span>
      ),
    },
    {
      title: "Giá Bán",
      key: "price",
      render: (_, record) => (
        <div>
          <Text
            style={{
              textDecoration: record.salePrice ? "line-through" : "none",
              color: record.salePrice ? "#999" : "inherit",
              fontSize: record.salePrice ? "12px" : "14px",
            }}
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(record.regularPrice || 0)}
          </Text>
          {record.salePrice && (
            <div>
              <Text strong style={{ color: "#ff4d4f" }}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(record.salePrice)}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "stock",
      key: "stock",
      render: (stock) => (
        <Text style={{ color: stock > 0 ? "inherit" : "#ff4d4f" }}>
          {stock || 0}
        </Text>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: {
        showTitle: false,
      },
      render: (description) => (
        <Tooltip placement="topLeft" title={description || "Không có mô tả"}>
          {description || "Không có mô tả"}
        </Tooltip>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail) => (
        <Image
          src={getImageUrl(thumbnail)}
          alt="Thumbnail"
          width={50}
          height={50}
          style={{ objectFit: "cover" }}
          fallback={getPlaceholderImage(50, 50)}
        />
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"}>
          {isActive ? "Đang hoạt động" : "Không hoạt động"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => viewServiceDetails(record)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => editService(record)}
          />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa dịch vụ này?"
            onConfirm={() => handleDeleteService(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="default"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="service-list-container">
      <div className="service-list-header" style={{ marginBottom: 16 }}>
        <h1>Quản lý dịch vụ spa</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", gap: "16px" }}>
            <Input.Search
              placeholder="Tìm kiếm dịch vụ..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={handleSearch}
              style={{ width: 300 }}
              enterButton={<SearchOutlined />}
            />
            <Select
              placeholder="Lọc theo danh mục"
              style={{ width: 200 }}
              allowClear
              value={selectedCategory}
              onChange={handleCategoryFilter}
            >
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
            <Button onClick={fetchAllServices}>Tất cả dịch vụ</Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingService(null);
              setFormVisible(true);
            }}
          >
            Thêm dịch vụ mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={services}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Service Form Modal */}
      <Modal
        title={editingService ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <ServiceForm
          service={editingService}
          onSubmitSuccess={handleFormSubmit}
          onCancel={() => setFormVisible(false)}
        />
      </Modal>

      {/* Service Detail Modal */}
      <Modal
        title="Chi tiết dịch vụ"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
        destroyOnClose
      >
        {selectedService && <ServiceDetail service={selectedService} />}
      </Modal>
    </div>
  );
};

export default ServiceList;
