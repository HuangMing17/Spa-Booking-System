import React, { useState, useEffect } from "react";
import {
  Steps,
  Card,
  Typography,
  Button,
  Form,
  Input,
  DatePicker,
  TimePicker,
  Space,
  Row,
  Col,
  message,
  Result,
  Image,
  Tag,
  Divider,
  Alert,
  Tooltip,
  Progress,
  Modal,
  Spin,
  Radio,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined,
  HomeOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  LoadingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/vi_VN";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageUtils";
import { createAppointment } from "../../admin/pages/orders/orderAPI";
import {
  searchCustomers,
  createCustomer,
} from "../../admin/pages/customers/customerAPI";
import { useCustomerAuth } from "../../auth/customer/context/CustomerAuthContext";
import axiosInstance from "../../utils/axios";

const { Title, Text } = Typography;

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useCustomerAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [bookingData, setBookingData] = useState({});
  const [loading, setLoading] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [appointmentResult, setAppointmentResult] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // Thêm trạng thái chọn hình thức thanh toán
  
  // Get service data from navigation state and add to selected services
  const { service, selectedServices: existingServices } = location.state || {};
  const selectedVariant = service?.selectedVariant;

  // Check if user is logged in
  useEffect(() => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để đặt lịch dịch vụ");
      navigate("/dang-nhap", {
        state: {
          redirectPath: location.pathname,
          redirectState: location.state,
        },
      });
      return;
    }
  }, [isLoggedIn, navigate, location]);
  // Initialize selectedServices when component mounts
  useEffect(() => {
    if (existingServices && existingServices.length > 0) {
      // Use existing services if provided (from adding to booking)
      setSelectedServices(existingServices);
    } else if (service && selectedVariant) {
      // Create new service item if coming from service detail
      setSelectedServices([
        {
          id: Date.now(), // unique ID for this booking item
          service: service,
          variant: selectedVariant,
          quantity: 1,
        },
      ]);
    }
  }, [service, selectedVariant, existingServices]);

  // Initialize booking data with user information
  useEffect(() => {
    if (user) {
      setBookingData((prevData) => ({
        ...prevData,
        fullName: user.fullName || user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      }));

      // Set form initial values
      form.setFieldsValue({
        fullName: user.fullName || user.name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user, form]);

  // Format price function
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price || 0);
  };  // Calculate total
  const calculateTotal = () => {
    return selectedServices.reduce((sum, item) => {
      const basePrice = item.variant?.price || 0;
      return sum + basePrice * item.quantity;
    }, 0);
  };

  const getFinalTotal = () => {
    return calculateTotal();
  };

  // Add service to booking
  const addServiceToBooking = (newService, newVariant) => {
    const newItem = {
      id: Date.now(),
      service: newService,
      variant: newVariant,
      quantity: 1,
    };
    setSelectedServices([...selectedServices, newItem]);
  };

  // Remove service from booking
  const removeServiceFromBooking = (itemId) => {
    setSelectedServices(selectedServices.filter((item) => item.id !== itemId));
  };

  // Update service quantity
  const updateServiceQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setSelectedServices(
      selectedServices.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  if (!isLoggedIn || !user) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Đang kiểm tra thông tin đăng nhập...</Text>
        </div>
      </div>
    );
  }

  if (selectedServices.length === 0) {
    return (
      <Result
        status="error"
        title="Không tìm thấy thông tin dịch vụ"
        subTitle="Vui lòng quay lại trang dịch vụ và thử lại"
        extra={[
          <Button type="primary" onClick={() => navigate("/dich-vu")}>
            Quay lại danh sách dịch vụ
          </Button>,
        ]}
      />
    );
  }

  const steps = [
    {
      title: "Chọn thời gian",
      icon: <CalendarOutlined />,
    },
    {
      title: "Thông tin cá nhân",
      icon: <UserOutlined />,
    },
    {
      title: "Xác nhận",
      icon: <CheckCircleOutlined />,
    },
  ];

  // This formatPrice function is already declared above
  const handleNext = async () => {
    try {
      if (currentStep === 1) {
        // For personal info step, only validate the note field
        const values = await form.validateFields(["note"]);
        setBookingData({
          ...bookingData,
          ...values,
          // Ensure user data is preserved
          fullName: user.fullName || user.name,
          phone: user.phone,
          email: user.email,
        });
      } else {
        // For other steps, validate all fields
        const values = await form.validateFields();
        setBookingData({ ...bookingData, ...values });
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const values = await form.validateFields();
      const finalBookingData = {
        ...bookingData,
        ...values,
        // Ensure we use the logged-in user's information
        fullName: user.fullName || user.name,
        phone: user.phone,
        email: user.email,
      };

      // Use the logged-in user's ID directly
      const customerId = user.id;

      // Combine date and time into appointmentDate
      const appointmentDateTime = dayjs(finalBookingData.date)
        .hour(finalBookingData.time.hour())
        .minute(finalBookingData.time.minute())
        .second(0);      
        
      // Create appointment data structure with multiple items
      const appointmentData = {
        customerId: customerId,
        appointmentDate: appointmentDateTime.toISOString(),
        items: selectedServices.map((item) => ({
          productId: item.service.id,
          variantId: item.variant.id,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod,
        // Optional: add notes if provided
        ...(finalBookingData.note && { notes: finalBookingData.note }),
      };

      console.log("Creating appointment with data:", appointmentData);

      // Create appointment via API
      const createdAppointment = await createAppointment(appointmentData);
      console.log("Created appointment:", createdAppointment);
      
      const finalAppointmentData = createdAppointment;

      // Xử lý chuyển hướng VNPay
      if (paymentMethod === "VNPAY") {
        message.loading("Đang kết nối tới cổng thanh toán VNPay...", 3);
        try {
          const paymentRes = await axiosInstance.get(`/api/payment/create-url/${createdAppointment.id}`);
          // axiosInstance interceptor đã trả về thẳng response.data, nên paymentRes.url mới là biến chính xác.
          const vnpayUrl = paymentRes?.url || paymentRes?.data?.url;
          if (vnpayUrl) {
            window.location.href = vnpayUrl;
            return; // Ngắt luồng ở đây để nó không văng Box popup thành công nữa
          }
        } catch (paymentErr) {
          console.error("Lỗi tạo link VNPay:", paymentErr);
          message.error("Hệ thống quá tải, không thể gọi cổng thanh toán lúc này. Quý khách vui lòng thanh toán tại Spa.");
        }
      }

      message.success(
        "Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất."
      );
      
      // Store appointment result and show custom success modal
      setAppointmentResult({
        appointment: finalAppointmentData,
        dateTime: appointmentDateTime,
        services: selectedServices,
        originalTotal: calculateTotal(),
        finalTotal: calculateTotal(),
      });
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("Submit failed:", error);
      message.error("Đã có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };
  
  const renderTimeSelection = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        date: bookingData.date,
        time: bookingData.time,
      }}
    >
      <Alert
        message="Lưu ý về thời gian đặt lịch"
        description="Vui lòng chọn thời gian ít nhất 2 giờ trước khi sử dụng dịch vụ. Chúng tôi hoạt động từ 8:00 - 20:00 hàng ngày."
        type="info"
        style={{ marginBottom: 16 }}
      />
      <Form.Item
        name="date"
        label="Ngày đặt lịch"
        rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
      >
        <DatePicker
          locale={locale}
          format="DD/MM/YYYY"
          disabledDate={(current) =>
            current && current < dayjs().startOf("day")
          }
          style={{ width: "100%" }}
          placeholder="Chọn ngày"
        />
      </Form.Item>
      <Form.Item
        name="time"
        label="Giờ đặt lịch"
        rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
      >
        <TimePicker
          locale={locale}
          format="HH:mm"
          minuteStep={30}
          style={{ width: "100%" }}
          placeholder="Chọn giờ"
          disabledHours={() => {
            const hours = [];
            for (let i = 0; i < 8; i++) hours.push(i); // Before 8:00
            for (let i = 21; i < 24; i++) hours.push(i); // After 20:30
            return hours;
          }}
          disabledMinutes={(hour) => {
            if (hour === 20) {
              return [30, 45]; // No appointments after 20:00
            }
            return [];
          }}
        />
      </Form.Item>{" "}
      <Card
        size="small"
        style={{ backgroundColor: "#f6ffed", border: "1px solid #b7eb8f" }}
      >
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <Text strong style={{ color: "#389e0d" }}>
            <InfoCircleOutlined /> Danh sách dịch vụ đã chọn:
          </Text>
          {selectedServices.map((item, index) => (
            <Card
              key={item.id}
              size="small"
              style={{ marginBottom: 8, backgroundColor: "#fff" }}
            >
              <Row gutter={[16, 8]} align="middle">
                <Col flex="auto">
                  <div>
                    <Text strong>{item.service.name}</Text>
                    <br />
                    <Text type="secondary">{item.variant.name}</Text>
                  </div>
                  <div>
                    <Space>
                      <Text>
                        <ClockCircleOutlined /> {item.variant.duration} phút
                      </Text>
                      <Text type="danger">
                        <DollarOutlined /> {formatPrice(item.variant.price)}
                      </Text>
                    </Space>
                  </div>
                </Col>
                <Col>
                  <Space>
                    <Button
                      size="small"
                      onClick={() =>
                        updateServiceQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <Text strong>{item.quantity}</Text>
                    <Button
                      size="small"
                      onClick={() =>
                        updateServiceQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                    <Button
                      size="small"
                      danger
                      type="text"
                      onClick={() => removeServiceFromBooking(item.id)}
                      disabled={selectedServices.length <= 1}
                    >
                      Xóa
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          ))}
          <Divider style={{ margin: "8px 0" }} />{" "}
          <div>
            <Text strong>Tổng tiền:</Text>{" "}
            <Text strong style={{ color: "#1890ff", fontSize: "16px" }}>
              {formatPrice(calculateTotal())}
            </Text>
          </div>
          <Button
            type="dashed"
            onClick={() =>
              navigate("/dich-vu", {
                state: { returnToBooking: true, selectedServices },
              })
            }
            style={{ width: "100%", marginTop: 8 }}
          >
            + Thêm dịch vụ khác
          </Button>
        </Space>
      </Card>
    </Form>
  );
  const renderPersonalInfo = () => (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        fullName: user?.fullName || user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
        note: bookingData.note,
      }}
    >
      <Alert
        message="Thông tin tài khoản đã đăng nhập"
        description="Thông tin cá nhân được lấy từ tài khoản đã đăng nhập và không thể chỉnh sửa. Chỉ có thể thêm ghi chú cho đơn đặt lịch."
        type="info"
        style={{ marginBottom: 16 }}
      />

      <Form.Item name="fullName" label="Họ và tên">
        <Input
          prefix={<UserOutlined />}
          value={user?.fullName || user?.name || ""}
          disabled
          size="large"
          suffix={<LockOutlined style={{ color: "#d9d9d9" }} />}
        />
      </Form.Item>

      <Form.Item name="phone" label="Số điện thoại">
        <Input
          prefix={<PhoneOutlined />}
          value={user?.phone || ""}
          disabled
          size="large"
          suffix={<LockOutlined style={{ color: "#d9d9d9" }} />}
        />
      </Form.Item>

      <Form.Item name="email" label="Email">
        <Input
          prefix={<MailOutlined />}
          value={user?.email || ""}
          disabled
          size="large"
          suffix={<LockOutlined style={{ color: "#d9d9d9" }} />}
        />
      </Form.Item>

      <Form.Item name="note" label="Ghi chú (không bắt buộc)">
        <Input.TextArea
          rows={4}
          placeholder="Nhập ghi chú về yêu cầu đặc biệt, tình trạng sức khỏe, hay thông tin cần lưu ý khác..."
          showCount
          maxLength={500}
        />
      </Form.Item>

      <Card
        size="small"
        style={{ backgroundColor: "#fff7e6", border: "1px solid #ffd591" }}
      >
        <Space direction="vertical" size="small">
          <Text strong style={{ color: "#d46b08" }}>
            <InfoCircleOutlined /> Lưu ý quan trọng:
          </Text>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Vui lòng đến đúng giờ hẹn để đảm bảo chất lượng dịch vụ</li>
            <li>
              Nếu cần thay đổi lịch hẹn, vui lòng liên hệ trước ít nhất 2 giờ
            </li>
            <li>Thông tin cá nhân của bạn sẽ được bảo mật tuyệt đối</li>
            <li>
              Để cập nhật thông tin cá nhân, vui lòng truy cập trang hồ sơ
            </li>
          </ul>
        </Space>
      </Card>
    </Form>
  );
  const renderConfirmation = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Alert
        message="Xác nhận thông tin đặt lịch"
        description="Vui lòng kiểm tra kỹ thông tin trước khi xác nhận. Sau khi đặt lịch thành công, chúng tôi sẽ liên hệ với bạn để xác nhận."
        type="warning"
      />{" "}
      <Card
        title={
          <>
            <CreditCardOutlined /> Thông tin dịch vụ
          </>
        }
        size="small"
      >
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {selectedServices.map((item, index) => (
                <Card
                  key={item.id}
                  size="small"
                  style={{ backgroundColor: "#fafafa", marginBottom: 8 }}
                >
                  <Row gutter={[8, 4]}>
                    <Col span={24}>
                      <Text strong>
                        {item.service.name} - {item.variant.name}
                      </Text>
                      {item.quantity > 1 && (
                        <Tag color="blue" style={{ marginLeft: 8 }}>
                          x{item.quantity}
                        </Tag>
                      )}
                    </Col>
                    <Col span={12}>
                      <Text type="secondary">
                        <ClockCircleOutlined /> {item.variant.duration} phút
                      </Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Text>
                        {formatPrice(item.variant.price)}
                        {item.quantity > 1 && ` x ${item.quantity}`}
                      </Text>
                    </Col>
                  </Row>
                </Card>
              ))}              <Divider style={{ margin: "8px 0" }} />
              
              {/* Pricing Summary */}
              <div style={{ background: "#fafafa", padding: "12px", borderRadius: "6px" }}>
                <Row style={{ marginBottom: 4 }}>
                  <Col span={12}>
                    <Text>Tổng tiền dịch vụ:</Text>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Text>{formatPrice(calculateTotal())}</Text>
                  </Col>
                </Row>
                
                <Divider style={{ margin: "8px 0" }} />
                <Row>
                  <Col span={12}>
                    <Text strong style={{ fontSize: "16px" }}>
                      Thành tiền:
                    </Text>
                  </Col>
                  <Col span={12} style={{ textAlign: "right" }}>
                    <Text strong style={{ color: "#1890ff", fontSize: "18px" }}>
                      {formatPrice(getFinalTotal())}
                    </Text>
                  </Col>
                </Row>
                
                <Divider style={{ margin: "16px 0" }} />
                <div style={{ marginTop: 16 }}>
                  <Text strong style={{ fontSize: "16px", display: "block", marginBottom: 8 }}>
                    Phương thức thanh toán:
                  </Text>
                  <Radio.Group 
                    value={paymentMethod} 
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ width: "100%" }}
                  >
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <Radio value="CASH">
                        <Space>
                          <DollarOutlined style={{ color: "#52c41a" }} />
                          <Text>Thanh toán tại Spa (Tiền mặt / Quẹt thẻ)</Text>
                        </Space>
                      </Radio>
                      <Radio value="VNPAY">
                        <Space>
                          <CreditCardOutlined style={{ color: "#1890ff" }} />
                          <Text>Thanh toán trực tuyến (VNPay / Thẻ ATM / QR Pay)</Text>
                        </Space>
                      </Radio>
                    </Space>
                  </Radio.Group>
                </div>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card
        title={
          <>
            <CalendarOutlined /> Thời gian đặt lịch
          </>
        }
        size="small"
      >
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <div>
              <Text strong>Ngày:</Text>{" "}
              <Text>{bookingData.date?.format("DD/MM/YYYY")}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Text strong>Giờ:</Text>{" "}
              <Text>{bookingData.time?.format("HH:mm")}</Text>
            </div>
          </Col>{" "}
          <Col span={24} style={{ marginTop: 8 }}>
            <div>
              <Text strong>Thời gian hoàn thành dự kiến:</Text>{" "}
              <Text>
                {bookingData.time
                  ?.add(
                    selectedServices.reduce(
                      (total, item) =>
                        total + item.variant.duration * item.quantity,
                      0
                    ),
                    "minute"
                  )
                  .format("HH:mm")}
              </Text>
            </div>
          </Col>
        </Row>
      </Card>
      <Card
        title={
          <>
            <UserOutlined /> Thông tin cá nhân
          </>
        }
        size="small"
      >
        {" "}
        <Row gutter={[16, 8]}>
          <Col span={24}>
            <div>
              <Text strong>Họ tên:</Text>{" "}
              <Text>{user?.fullName || user?.name}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Text strong>Số điện thoại:</Text> <Text>{user?.phone}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div>
              <Text strong>Email:</Text> <Text>{user?.email}</Text>
            </div>
          </Col>
          {bookingData.note && (
            <Col span={24} style={{ marginTop: 8 }}>
              <div>
                <Text strong>Ghi chú:</Text> <Text>{bookingData.note}</Text>
              </div>
            </Col>
          )}
        </Row>
      </Card>
      <Card
        size="small"
        style={{ backgroundColor: "#e6f7ff", border: "1px solid #91d5ff" }}
      >
        <Space direction="vertical" size="small">
          <Text strong style={{ color: "#1890ff" }}>
            <SafetyOutlined /> Cam kết chất lượng dịch vụ:
          </Text>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            <li>Đội ngũ chuyên viên có kinh nghiệm và chuyên nghiệp</li>
            <li>Sử dụng thiết bị và sản phẩm chất lượng cao</li>
            <li>Đảm bảo vệ sinh và an toàn tuyệt đối</li>
            <li>Hỗ trợ khách hàng 24/7</li>
          </ul>
        </Space>
      </Card>
    </Space>
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderTimeSelection();
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderConfirmation();
      default:
        return null;
    }
  };
  return (
    <div>
      <Row justify="center">
        <Col span={24}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <Title level={2} style={{ color: "#1890ff", marginBottom: 8 }}>
                Đặt lịch dịch vụ
              </Title>
              <Text type="secondary">
                Hoàn thành các bước bên dưới để đặt lịch sử dụng dịch vụ
              </Text>
            </div>
            <Steps
              current={currentStep}
              items={steps}
              style={{ marginBottom: 32 }}
            />
            <Spin
              spinning={loading}
              tip="Đang xử lý đặt lịch..."
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            >
              <div style={{ marginBottom: 24, minHeight: "400px" }}>
                {getStepContent()}
              </div>
            </Spin>
            <Divider />
            <div style={{ textAlign: "center" }}>
              <Space size="middle">
                {currentStep > 0 && (
                  <Button
                    size="large"
                    onClick={handlePrevious}
                    disabled={loading}
                  >
                    Quay lại
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleNext}
                    disabled={loading}
                  >
                    Tiếp tục
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={loading}
                    style={{
                      background: "linear-gradient(45deg, #1890ff, #722ed1)",
                      border: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Xác nhận đặt lịch
                  </Button>
                )}
              </Space>
            </div>
            {/* Help Information */}
            <Card
              size="small"
              style={{
                marginTop: 24,
                backgroundColor: "#f6ffed",
                border: "1px solid #b7eb8f",
              }}
            >
              <Space>
                <PhoneOutlined style={{ color: "#52c41a" }} />
                <Text strong>Cần hỗ trợ?</Text>
                <Text>Hotline: 1900-xxxx hoặc email: support@bonlai.com</Text>
              </Space>
            </Card>{" "}
          </Card>
        </Col>
      </Row>

      {/* Custom Success Modal */}
      <Modal
        title="Đặt lịch thành công!"
        open={successModalVisible}
        onOk={() => {
          console.log("Custom modal OK clicked, navigating to /lich-hen");
          setSuccessModalVisible(false);
          navigate("/lich-hen");
        }}
        onCancel={() => {
          console.log("Custom modal cancelled, navigating to /lich-hen");
          setSuccessModalVisible(false);
          navigate("/lich-hen");
        }}
        okText="Xem lịch hẹn của tôi"
        cancelText="Đóng"
        centered
        afterClose={() => {
          console.log("Custom modal closed");
          if (successModalVisible) {
            navigate("/lich-hen");
          }
        }}
      >
        {appointmentResult && (
          <div>
            <p>
              <CheckCircleOutlined
                style={{ color: "#52c41a", marginRight: 8 }}
              />
              Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất. Hãy
              theo dõi Email của bạn để nhận thông tin chi tiết.
            </p>
            <p>
              Mã đặt lịch:{" "}
              <strong>
                #{appointmentResult.appointment?.id?.slice(-8) || "N/A"}
              </strong>
            </p>
            <p>
              Thời gian:{" "}
              <strong>
                {appointmentResult.dateTime?.format("DD/MM/YYYY HH:mm")}
              </strong>
            </p>            <div>
              <Text strong>Các dịch vụ đã đặt:</Text>
              <ul style={{ marginTop: 8 }}>
                {appointmentResult.services?.map((item, index) => (
                  <li key={index}>
                    <strong>
                      {item.service.name} - {item.variant.name}
                    </strong>
                    {item.quantity > 1 && ` (x${item.quantity})`}
                  </li>
                ))}
              </ul>
            </div>
            
            <p>Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
