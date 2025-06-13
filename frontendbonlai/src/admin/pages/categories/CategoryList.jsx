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
  Avatar,
  Typography,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "../../../utils/axios";
import CategoryForm from "./CategoryForm";
import CategoryDetail from "./CategoryDetail";
import { getImageUrl, getPlaceholderImage } from "../../../utils/imageUtils";

const { Text } = Typography;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/categories");
      // Axios instance đã được cấu hình để trả về response.data
      // nên response ở đây đã là mảng dữ liệu
      setCategories(Array.isArray(response) ? response : [response]);
      console.log("Categories data:", response);
    } catch (error) {
      message.error("Không thể tải danh sách danh mục!");
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  // Search categories
  const searchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/categories/search?keyword=${searchKeyword}`
      );
      // Axios instance đã được cấu hình để trả về response.data
      setCategories(Array.isArray(response) ? response : [response]);
      console.log("Search results:", response);
    } catch (error) {
      message.error("Lỗi khi tìm kiếm danh mục!");
      console.error("Error searching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  // Delete category
  const deleteCategory = async (id) => {
    try {
      // Hiển thị loading state
      setLoading(true);

      // Gửi request xóa danh mục
      await axios.delete(`/api/categories/${id}`);

      // Thông báo thành công
      message.success("Xóa danh mục thành công!");

      // Tải lại danh sách danh mục
      await fetchCategories();
    } catch (error) {
      // Log lỗi và hiển thị thông báo lỗi chi tiết hơn
      console.error("Error deleting category:", error);
      message.error(
        error?.response?.data?.message ||
          "Không thể xóa danh mục. Vui lòng thử lại sau!"
      );
    } finally {
      // Đảm bảo tắt loading state ngay cả khi có lỗi
      setLoading(false);
    }
  };

  // View category details
  const viewCategoryDetails = (category) => {
    setSelectedCategory(category);
    setDetailVisible(true);
  };
  // Open form for editing
  const editCategory = (category) => {
    console.log("Editing category:", category); // Log để kiểm tra dữ liệu
    setEditingCategory(category);
    setFormVisible(true);
  };

  // Handle form submission result
  const handleFormSubmit = () => {
    setFormVisible(false);
    setEditingCategory(null);
    fetchCategories();
  };

  // Initial data load
  useEffect(() => {
    fetchCategories();
  }, []);
  // Table columns
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 80,
      render: (thumbnail, record) => (
        <Avatar
          size={50}
          src={getImageUrl(thumbnail)}
          alt={record.name}
          style={{
            backgroundColor: thumbnail ? "transparent" : "#f56a00",
            border: "1px solid #d9d9d9",
          }}
        >
          {!thumbnail && record.name?.charAt(0)?.toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <a onClick={() => viewCategoryDetails(record)}>
            <Text strong>{text}</Text>
          </a>
          {record.description && (
            <div>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {record.description.length > 50
                  ? `${record.description.substring(0, 50)}...`
                  : record.description}
              </Text>
            </div>
          )}{" "}
        </div>
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
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => new Date(createdAt).toLocaleDateString("vi-VN"),
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
            onClick={() => viewCategoryDetails(record)}
          />
          <Button
            type="default"
            icon={<EditOutlined />}
            size="small"
            onClick={() => editCategory(record)}
          />
          <Popconfirm
            title="Bạn chắc chắn muốn xóa danh mục này?"
            onConfirm={() => deleteCategory(record.id)}
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
    <div className="category-list-container">
      <div className="category-list-header" style={{ marginBottom: 16 }}>
        <h1>Quản lý danh mục</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex" }}>
            <Input.Search
              placeholder="Tìm kiếm danh mục..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onSearch={searchCategories}
              style={{ width: 300, marginRight: 16 }}
              enterButton={<SearchOutlined />}
            />
            <Button onClick={fetchCategories}>Tất cả danh mục</Button>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              setFormVisible(true);
            }}
          >
            Thêm danh mục mới
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* Category Form Modal */}
      <Modal
        title={editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
        open={formVisible}
        onCancel={() => setFormVisible(false)}
        footer={null}
        destroyOnClose
      >
        <CategoryForm
          category={editingCategory}
          onSubmitSuccess={handleFormSubmit}
          onCancel={() => setFormVisible(false)}
        />
      </Modal>

      {/* Category Detail Modal */}
      <Modal
        title="Chi tiết danh mục"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>,
        ]}
        destroyOnClose
      >
        {selectedCategory && <CategoryDetail category={selectedCategory} />}
      </Modal>
    </div>
  );
};

export default CategoryList;
