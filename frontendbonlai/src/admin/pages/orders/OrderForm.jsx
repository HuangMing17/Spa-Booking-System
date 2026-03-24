import React, { useState, useEffect } from "react";
import {
  Card,
  Form,
  Select,
  DatePicker,
  Button,
  Space,
  message,
  Row,
  Col,
  Table,
  InputNumber,
  Modal,
  Input,
  Tag,
  Divider,
  Typography,
  Alert,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  DeleteOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import {
  createAppointment,
  updateAppointment,
  getOrderById,
  addOrderItem,
  updateOrderItem,
  removeOrderItem,
  calculateTotalAmount,
  calculateTotalDuration,
  canEditOrder,
} from "./orderAPI";
import { searchCustomers } from "../customers/customerAPI";
import { fetchServices } from "../services/serviceAPI";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

const AppointmentForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [appointment, setAppointment] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  useEffect(() => {
    fetchCustomers();
    loadServices();
    if (isEditing) {
      fetchAppointment();
    }
  }, [id]);

  const fetchCustomers = async () => {
    try {
      const data = await searchCustomers("");
      setCustomers(data);
    } catch (error) {
      message.error("Không thể tải danh sách khách hàng!");
    }
  };
  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      message.error("Không thể tải danh sách dịch vụ!");
    }
  };

  const fetchAppointment = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setAppointment(data);
      setOrderItems(data.items || []);
      form.setFieldsValue({
        customerId: data.customerId,
        appointmentDate: moment(data.appointmentDate),
        notes: data.notes,
      });
    } catch (error) {
      message.error("Không thể tải thông tin lịch hẹn!");
      navigate("/admin/appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    if (orderItems.length === 0) {
      message.error("Vui lòng thêm ít nhất một dịch vụ!");
      return;
    }

    try {
      setLoading(true);
      const appointmentData = {
        customerId: values.customerId,
        appointmentDate: values.appointmentDate.toISOString(),
        items: orderItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        notes: values.notes,
      };

      if (isEditing) {
        await updateAppointment(id, appointmentData);
        message.success("Cập nhật lịch hẹn thành công!");
      } else {
        await createAppointment(appointmentData);
        message.success("Tạo lịch hẹn thành công!");
      }
      navigate("/admin/appointments");
    } catch (error) {
      message.error(
        isEditing ? "Cập nhật lịch hẹn thất bại!" : "Tạo lịch hẹn thất bại!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = (serviceData) => {
    const newItem = {
      id: Date.now(), // Temporary ID for new items
      productId: serviceData.productId,
      variantId: serviceData.variantId,
      serviceName: serviceData.serviceName,
      variantName: serviceData.variantName,
      price: serviceData.price,
      duration: serviceData.duration,
      quantity: serviceData.quantity || 1,
    };

    setOrderItems([...orderItems, newItem]);
    setServiceModalVisible(false);
  };

  const handleEditService = (index, serviceData) => {
    const updatedItems = [...orderItems];
    updatedItems[index] = {
      ...updatedItems[index],
      ...serviceData,
    };
    setOrderItems(updatedItems);
    setEditingItem(null);
    setServiceModalVisible(false);
  };

  const handleRemoveService = (index) => {
    const updatedItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(updatedItems);
  };

  const serviceColumns = [
    {
      title: "Dịch vụ",
      dataIndex: "serviceName",
      key: "serviceName",
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
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
      width: 120,
      render: (quantity, record, index) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => {
            const updatedItems = [...orderItems];
            updatedItems[index].quantity = value;
            setOrderItems(updatedItems);
          }}
          disabled={isEditing && !canEditOrder(appointment?.status)}
        />
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "duration",
      key: "duration",
      render: (duration, record) => (
        <span>{duration * record.quantity} phút</span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(price),
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(record.price * record.quantity),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_, record, index) => (
        <Space>
          <Button
            size="small"
            onClick={() => {
              setEditingItem({ ...record, index });
              setServiceModalVisible(true);
            }}
            disabled={isEditing && !canEditOrder(appointment?.status)}
          >
            Sửa
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleRemoveService(index)}
            disabled={isEditing && !canEditOrder(appointment?.status)}
          />
        </Space>
      ),
    },
  ];

  const totalAmount = calculateTotalAmount(orderItems);
  const totalDuration = calculateTotalDuration(orderItems);

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Row gutter={24}>
          <Col span={16}>
            <Space align="center" style={{ marginBottom: 24 }}>
              {" "}
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/admin/appointments")}
              >
                Quay lại
              </Button>
              <Title level={3} style={{ margin: 0 }}>
                {isEditing ? "Chỉnh sửa lịch hẹn" : "Tạo lịch hẹn mới"}
              </Title>
            </Space>

            {isEditing && appointment && !canEditOrder(appointment.status) && (
              <Alert
                message="Lịch hẹn này không thể chỉnh sửa"
                description="Lịch hẹn đã hoàn thành, bị hủy hoặc đã hoàn tiền không thể chỉnh sửa."
                type="warning"
                style={{ marginBottom: 24 }}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              disabled={
                isEditing && appointment && !canEditOrder(appointment.status)
              }
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="customerId"
                    label="Khách hàng"
                    rules={[
                      { required: true, message: "Vui lòng chọn khách hàng!" },
                    ]}
                  >
                    <Select
                      placeholder="Chọn khách hàng"
                      showSearch
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                    >
                      {customers.map((customer) => (
                        <Option key={customer.id} value={customer.id}>
                          {customer.fullName} - {customer.phone}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="appointmentDate"
                    label="Ngày và giờ hẹn"
                    rules={[
                      { required: true, message: "Vui lòng chọn ngày hẹn!" },
                    ]}
                  >
                    <DatePicker
                      showTime
                      style={{ width: "100%" }}
                      format="DD/MM/YYYY HH:mm"
                      disabledDate={(current) =>
                        current && current < moment().startOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>{" "}
              <Form.Item name="notes" label="Ghi chú">
                <TextArea rows={3} placeholder="Ghi chú cho lịch hẹn..." />
              </Form.Item>
            </Form>

            {/* Services Section */}
            <Card
              title="Dịch vụ đã chọn"
              extra={
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setServiceModalVisible(true)}
                  disabled={
                    isEditing &&
                    appointment &&
                    !canEditOrder(appointment.status)
                  }
                >
                  Thêm dịch vụ
                </Button>
              }
              style={{ marginTop: 24 }}
            >
              <Table
                columns={serviceColumns}
                dataSource={orderItems}
                rowKey={(record, index) =>
                  `${record.productId}-${record.variantId}-${index}`
                }
                pagination={false}
                locale={{
                  emptyText: "Chưa có dịch vụ nào được chọn",
                }}
              />
            </Card>

          </Col>{" "}
          {/* Order Summary */}
          <Col span={8}>
            <Card
              title="Tóm tắt lịch hẹn"
              style={{ position: "sticky", top: 24 }}
            >
              <div style={{ marginBottom: 16 }}>
                <Row justify="space-between">
                  <Text>Số dịch vụ:</Text>
                  <Text strong>{orderItems.length}</Text>
                </Row>
                <Row justify="space-between">
                  <Text>Tổng thời gian:</Text>
                  <Text strong>{totalDuration} phút</Text>
                </Row>
                <Row justify="space-between">
                  <Text>Tạm tính:</Text>
                  <Text>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(calculateTotalAmount(orderItems, 0))}
                  </Text>
                </Row>
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
                </Row>
              </div>

              <Button
                type="primary"
                block
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => form.submit()}
                disabled={
                  isEditing && appointment && !canEditOrder(appointment.status)
                }
              >
                {isEditing ? "Cập nhật lịch hẹn" : "Tạo lịch hẹn"}
              </Button>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* Service Selection Modal */}
      <ServiceSelectionModal
        visible={serviceModalVisible}
        onCancel={() => {
          setServiceModalVisible(false);
          setEditingItem(null);
        }}
        onConfirm={
          editingItem
            ? (data) => handleEditService(editingItem.index, data)
            : handleAddService
        }
        services={services}
        editingItem={editingItem}
      />
    </div>
  );
};

// Service Selection Modal Component
const ServiceSelectionModal = ({
  visible,
  onCancel,
  onConfirm,
  services,
  editingItem,
}) => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (editingItem) {
      const service = services.find((s) => s.id === editingItem.productId);
      setSelectedService(service);
      setSelectedVariant(editingItem.variantId);
      setQuantity(editingItem.quantity);
    } else {
      setSelectedService(null);
      setSelectedVariant(null);
      setQuantity(1);
    }
  }, [editingItem, services]);

  const handleConfirm = () => {
    if (!selectedService || !selectedVariant) {
      message.error("Vui lòng chọn dịch vụ và gói!");
      return;
    }

    const variant = selectedService.variants?.find(
      (v) => v.id === selectedVariant
    );
    const serviceData = {
      productId: selectedService.id,
      variantId: selectedVariant,
      serviceName: selectedService.name,
      variantName: variant?.name,
      price: variant?.price,
      duration: variant?.duration,
      quantity: quantity,
    };

    onConfirm(serviceData);
  };

  return (
    <Modal
      title={editingItem ? "Chỉnh sửa dịch vụ" : "Chọn dịch vụ"}
      open={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={600}
    >
      <Row gutter={16}>
        <Col span={24}>
          <div style={{ marginBottom: 16 }}>
            <Text strong>Chọn dịch vụ:</Text>
            <Select
              style={{ width: "100%", marginTop: 8 }}
              placeholder="Chọn dịch vụ"
              value={selectedService?.id}
              onChange={(value) => {
                const service = services.find((s) => s.id === value);
                setSelectedService(service);
                setSelectedVariant(null);
              }}
            >
              {services.map((service) => (
                <Option key={service.id} value={service.id}>
                  {service.name}
                </Option>
              ))}
            </Select>
          </div>
        </Col>

        {selectedService?.variants && (
          <Col span={24}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Chọn gói:</Text>
              <Select
                style={{ width: "100%", marginTop: 8 }}
                placeholder="Chọn gói dịch vụ"
                value={selectedVariant}
                onChange={setSelectedVariant}
              >
                {selectedService.variants.map((variant) => (
                  <Option key={variant.id} value={variant.id}>
                    <div>
                      <div>{variant.name}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(variant.price)}{" "}
                        - {variant.duration} phút
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </div>
          </Col>
        )}

        <Col span={24}>
          <div>
            <Text strong>Số lượng:</Text>
            <InputNumber
              min={1}
              value={quantity}
              onChange={setQuantity}
              style={{ width: "100%", marginTop: 8 }}
            />
          </div>
        </Col>
      </Row>
    </Modal>
  );
};

export default AppointmentForm;
