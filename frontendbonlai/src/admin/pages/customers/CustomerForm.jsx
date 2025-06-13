import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Typography,
  message,
  Space,
  Row,
  Col,
  Switch,
  Divider,
  Table,
  Modal,
  Select,
} from "antd";
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  createCustomer,
  updateCustomer,
  getCustomerById,
  addCustomerAddress,
  updateCustomerAddress,
  deleteCustomerAddress,
  setDefaultAddress,
} from "./customerAPI";

const { Title, Text } = Typography;
const { Option } = Select;

const CustomerForm = () => {
  const [form] = Form.useForm();
  const [addressForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchCustomer();
    }
  }, [isEditing, id]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const data = await getCustomerById(id);
      setCustomer(data);
      setAddresses(data.addresses || []);
      form.setFieldsValue({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        isActive: data.isActive ?? true,
      });
    } catch (error) {
      message.error("Không thể tải thông tin khách hàng!");
      navigate("/admin/customers");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (isEditing) {
        await updateCustomer(id, values);
        message.success("Cập nhật khách hàng thành công!");
      } else {
        await createCustomer({ ...values, isActive: values.isActive ?? true });
        message.success("Tạo khách hàng thành công!");
      }
      navigate("/admin/customers");
    } catch (error) {
      message.error(
        isEditing ? "Cập nhật thất bại!" : "Tạo khách hàng thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    addressForm.resetFields();
    setIsAddressModalVisible(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    addressForm.setFieldsValue(address);
    setIsAddressModalVisible(true);
  };

  const handleAddressSubmit = async (values) => {
    try {
      if (editingAddress) {
        await updateCustomerAddress(id, editingAddress.id, values);
        message.success("Cập nhật địa chỉ thành công!");
      } else {
        await addCustomerAddress(id, values);
        message.success("Thêm địa chỉ thành công!");
      }
      setIsAddressModalVisible(false);
      fetchCustomer(); // Refresh customer data
    } catch (error) {
      message.error("Thao tác thất bại!");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteCustomerAddress(id, addressId);
      message.success("Xóa địa chỉ thành công!");
      fetchCustomer(); // Refresh customer data
    } catch (error) {
      message.error("Xóa địa chỉ thất bại!");
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await setDefaultAddress(id, addressId);
      message.success("Đặt địa chỉ mặc định thành công!");
      fetchCustomer(); // Refresh customer data
    } catch (error) {
      message.error("Đặt địa chỉ mặc định thất bại!");
    }
  };

  const addressColumns = [
    {
      title: "Loại địa chỉ",
      dataIndex: "type",
      key: "type",
      render: (type) => type || "Chưa xác định",
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
      render: (isDefault, record) => (
        <Switch
          checked={isDefault}
          onChange={() => handleSetDefaultAddress(record.id)}
          size="small"
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEditAddress(record)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa địa chỉ này?",
                onOk: () => handleDeleteAddress(record.id),
              });
            }}
          />
        </Space>
      ),
    },
  ];

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
                {isEditing ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
              </Title>
            </Space>
          </Col>
        </Row>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true }}
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: "Vui lòng nhập họ và tên!" },
                  { min: 2, message: "Họ và tên phải có ít nhất 2 ký tự!" },
                ]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{10,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Trạng thái"
                name="isActive"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Hoạt động"
                  unCheckedChildren="Không hoạt động"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                {isEditing ? "Cập nhật" : "Tạo mới"}
              </Button>
              <Button onClick={() => navigate("/admin/customers")}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>

        {/* Address Management - Only show when editing */}
        {isEditing && (
          <>
            <Divider />
            <Row
              justify="space-between"
              align="middle"
              style={{ marginBottom: 16 }}
            >
              <Col>
                <Title level={4}>Quản lý địa chỉ</Title>
              </Col>
              <Col>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={handleAddAddress}
                >
                  Thêm địa chỉ
                </Button>
              </Col>
            </Row>

            <Table
              columns={addressColumns}
              dataSource={addresses}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: "Chưa có địa chỉ nào" }}
            />
          </>
        )}
      </Card>

      {/* Address Modal */}
      <Modal
        title={editingAddress ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
        open={isAddressModalVisible}
        onCancel={() => setIsAddressModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={addressForm}
          layout="vertical"
          onFinish={handleAddressSubmit}
        >
          <Form.Item
            label="Loại địa chỉ"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại địa chỉ!" }]}
          >
            <Select placeholder="Chọn loại địa chỉ">
              <Option value="home">Nhà riêng</Option>
              <Option value="office">Văn phòng</Option>
              <Option value="other">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Địa chỉ cụ thể"
            name="street"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Số nhà, tên đường" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="Phường/Xã"
                name="ward"
                rules={[
                  { required: true, message: "Vui lòng nhập phường/xã!" },
                ]}
              >
                <Input placeholder="Phường/Xã" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Quận/Huyện"
                name="district"
                rules={[
                  { required: true, message: "Vui lòng nhập quận/huyện!" },
                ]}
              >
                <Input placeholder="Quận/Huyện" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Tỉnh/Thành phố"
                name="city"
                rules={[
                  { required: true, message: "Vui lòng nhập tỉnh/thành phố!" },
                ]}
              >
                <Input placeholder="Tỉnh/Thành phố" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingAddress ? "Cập nhật" : "Thêm"}
              </Button>
              <Button onClick={() => setIsAddressModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerForm;
