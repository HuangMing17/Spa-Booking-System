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
  GiftOutlined,
  TagOutlined,
  PercentageOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import locale from "antd/es/date-picker/locale/vi_VN";
import { getImageUrl, getPlaceholderImage } from "../../utils/imageUtils";
import { createAppointment, applyCoupon as applyOrderCoupon } from "../../admin/pages/orders/orderAPI";
import {
  searchCustomers,
  createCustomer,
} from "../../admin/pages/customers/customerAPI";
import { validateCoupon } from "../../admin/pages/coupons/couponAPI";
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
  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [backendDiscount, setBackendDiscount] = useState(0); // Actual discount from backend
  const [backendFinalTotal, setBackendFinalTotal] = useState(0); // Actual final total from backend
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // Thêm trạng thái chọn hình thức thanh toán
  
  // Get service data from navigation state and add to selected services
  const { service, selectedServices: existingServices, couponCode: initialCouponCode, coupon: initialCoupon } = location.state || {};
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
  // Initialize coupon if provided from navigation
  useEffect(() => {
    if (initialCouponCode) {
      setCouponCode(initialCouponCode);
      if (initialCoupon) {
        setAppliedCoupon(initialCoupon);
        calculateCouponDiscount(initialCoupon);
      }
    }
  }, [initialCouponCode, initialCoupon]);

  // Recalculate coupon discount when total changes
  useEffect(() => {
    if (appliedCoupon) {
      calculateCouponDiscount(appliedCoupon);
    }
  }, [selectedServices, appliedCoupon]);

  // Debug effect to track coupon state changes
  useEffect(() => {
    console.log("Coupon state changed:", {
      appliedCoupon: appliedCoupon?.code,
      couponDiscount,
      backendDiscount,
      showDiscountSection: appliedCoupon && couponDiscount > 0
    });
  }, [appliedCoupon, couponDiscount, backendDiscount]);

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

  // Calculate coupon discount
  const calculateCouponDiscount = (coupon) => {
    if (!coupon) return 0;
    
    const subtotal = calculateTotal();
    let discount = 0;

    console.log("Calculating discount for:", {
      coupon,
      subtotal,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    });

    if (coupon.discountType === "PERCENTAGE") {
      discount = (subtotal * coupon.discountValue) / 100;
      
      // Check different possible field names for max discount
      const maxDiscount = coupon.maxDiscountAmount || coupon.maxDiscount || 0;
      if (maxDiscount > 0) {
        discount = Math.min(discount, maxDiscount);
      }
      
      console.log("Percentage discount calculated:", {
        percentage: coupon.discountValue,
        calculatedDiscount: discount,
        maxDiscount: maxDiscount
      });
    } else if (coupon.discountType === "FIXED") {
      discount = coupon.discountValue;
      console.log("Fixed discount:", discount);
    }

    const finalDiscount = Math.min(discount, subtotal);
    console.log("Final discount amount:", finalDiscount);
    
    setCouponDiscount(finalDiscount);
    return finalDiscount;
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      message.warning("Vui lòng nhập mã giảm giá");
      return;
    }

    setCouponLoading(true);
    try {
      const subtotal = calculateTotal();
      const couponData = await validateCoupon(couponCode, subtotal);
      
      // API trả về trực tiếp coupon object nếu valid
      if (couponData && couponData.id) {
        console.log("Coupon data received:", couponData);
        
        setAppliedCoupon(couponData);
        const calculatedDiscount = calculateCouponDiscount(couponData);
        
        console.log("Calculated discount:", calculatedDiscount);
        console.log("Current subtotal:", calculateTotal());
        console.log("Coupon discount state:", couponDiscount);
        
        message.success(`Áp dụng mã giảm giá thành công! Tiết kiệm ${formatPrice(calculatedDiscount)}`);
      } else {
        message.error("Mã giảm giá không hợp lệ");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      
      // Check if error has response with message
      const errorMessage = error.response?.data?.message || error.message || "Không thể áp dụng mã giảm giá. Vui lòng thử lại!";
      message.error(errorMessage);
    } finally {
      setCouponLoading(false);
    }
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponDiscount(0);
    setBackendDiscount(0);
    setBackendFinalTotal(0);
    message.success("Đã gỡ bỏ mã giảm giá");
  };

  // Calculate final total after discount
  const getFinalTotal = () => {
    return Math.max(0, calculateTotal() - couponDiscount);
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
        // Remove coupon from appointment creation - will apply after
      };

      console.log("Creating appointment with data:", appointmentData);

      // Create appointment via API
      const createdAppointment = await createAppointment(appointmentData);
      console.log("Created appointment:", createdAppointment);
      
      let finalAppointmentData = createdAppointment;
      let actualCouponDiscount = 0;
      let actualFinalTotal = calculateTotal();
      
      // If coupon was applied, apply it to the created order using ORDER API
      if (appliedCoupon && createdAppointment?.id) {
        try {
          console.log("Applying coupon to order:", {
            orderId: createdAppointment.id,
            couponCode: appliedCoupon.code,
            customerId: user.id
          });

          const couponResult = await applyOrderCoupon(createdAppointment.id, appliedCoupon.code);
          console.log("Coupon applied successfully:", couponResult);
          
          // Update appointment data with coupon information from backend
          if (couponResult) {
            finalAppointmentData = couponResult;
            
            // Get actual discount and final total from backend response
            if (couponResult.discountAmount !== undefined) {
              actualCouponDiscount = couponResult.discountAmount;
            }
            if (couponResult.finalAmount !== undefined) {
              actualFinalTotal = couponResult.finalAmount;
            }
            
            // Debug logs
            console.log("Backend coupon result:", {
              discountAmount: couponResult.discountAmount,
              finalAmount: couponResult.finalAmount,
              totalAmount: couponResult.totalAmount
            });
            
            // Update local state to match backend
            setCouponDiscount(actualCouponDiscount);
            setBackendDiscount(actualCouponDiscount);
            setBackendFinalTotal(actualFinalTotal);
          }
          
          message.success(`Mã giảm giá ${appliedCoupon.code} đã được áp dụng! Tiết kiệm ${formatPrice(actualCouponDiscount)}`);
        } catch (couponError) {
          console.error("Error applying coupon to order:", couponError);
          console.error("Coupon error details:", couponError.response?.data || couponError.message);
          
          // Reset coupon state if application failed
          setAppliedCoupon(null);
          setCouponCode("");
          setCouponDiscount(0);
          setBackendDiscount(0);
          setBackendFinalTotal(0);
          
          // Show warning but don't fail the booking
          message.warning(
            `Đặt lịch thành công nhưng không thể áp dụng mã giảm giá: ${
              couponError.response?.data?.message || couponError.message || "Lỗi không xác định"
            }`
          );
        }
      }

      // Xử lý chuyển hướng VNPay
      if (paymentMethod === "VNPAY") {
        message.loading("Đang kết nối tới cổng thanh toán VNPay...", 3);
        try {
          const paymentRes = await axiosInstance.get(`/api/payment/create-url/${createdAppointment.id}`);
          if (paymentRes.data && paymentRes.data.url) {
            window.location.href = paymentRes.data.url;
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
        appliedCoupon: appliedCoupon,
        couponDiscount: actualCouponDiscount,
        originalTotal: calculateTotal(),
        finalTotal: actualFinalTotal,
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
              
              {/* Coupon Section */}
              <Card size="small" style={{ background: "#f6ffed", border: "1px solid #b7eb8f" }}>
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Text strong style={{ color: "#52c41a" }}>
                      <GiftOutlined /> Mã giảm giá
                    </Text>
                    {!appliedCoupon && (
                      <Button 
                        type="link" 
                        size="small"
                        onClick={() => navigate("/khuyen-mai")}
                        style={{ padding: 0, height: "auto" }}
                      >
                        Xem tất cả mã giảm giá
                      </Button>
                    )}
                  </div>
                  
                  {!appliedCoupon ? (
                    <Row gutter={8}>
                      <Col flex="1">
                        <Input
                          placeholder="Nhập mã giảm giá"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          prefix={<TagOutlined />}
                          style={{ textTransform: "uppercase" }}
                        />
                      </Col>
                      <Col>
                        <Button 
                          type="primary" 
                          onClick={handleApplyCoupon}
                          loading={couponLoading}
                          disabled={!couponCode.trim()}
                        >
                          Áp dụng
                        </Button>
                      </Col>
                    </Row>
                  ) : (
                    <div>
                      <Row align="middle" style={{ marginBottom: 8 }}>
                        <Col flex="1">
                          <Space>
                            <Tag color="green" style={{ margin: 0 }}>
                              <GiftOutlined /> {appliedCoupon.code}
                            </Tag>
                            <Text style={{ color: "#52c41a", fontWeight: "500" }}>
                              {appliedCoupon.name}
                            </Text>
                          </Space>
                        </Col>
                        <Col>
                          <Button 
                            type="text" 
                            size="small" 
                            danger
                            icon={<DeleteOutlined />}
                            onClick={handleRemoveCoupon}
                          >
                            Gỡ bỏ
                          </Button>
                        </Col>
                      </Row>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        {appliedCoupon.description}
                      </Text>
                    </div>
                  )}
                </Space>
              </Card>
              
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
                
                {appliedCoupon && couponDiscount > 0 && (
                  <Row style={{ marginBottom: 4 }}>
                    <Col span={12}>
                      <Text style={{ color: "#52c41a" }}>
                        Giảm giá ({appliedCoupon.discountType === "PERCENTAGE" 
                          ? `${appliedCoupon.discountValue}%` 
                          : formatPrice(appliedCoupon.discountValue)}):
                      </Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Text style={{ color: "#52c41a" }}>
                        -{formatPrice(couponDiscount)}
                      </Text>
                    </Col>
                  </Row>
                )}
                
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
            
            {/* Show coupon information if applied */}
            {appointmentResult.appliedCoupon && (
              <div style={{ background: "#f6ffed", padding: "12px", borderRadius: "6px", margin: "12px 0" }}>
                <Text strong style={{ color: "#52c41a" }}>
                  <GiftOutlined /> Mã giảm giá đã áp dụng:
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color="green">{appointmentResult.appliedCoupon.code}</Tag>
                  <Text>{appointmentResult.appliedCoupon.name}</Text>
                </div>
                <div style={{ marginTop: 8, fontSize: "12px" }}>
                  <Row>
                    <Col span={12}>Tổng tiền gốc:</Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      {formatPrice(appointmentResult.originalTotal)}
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12} style={{ color: "#52c41a" }}>Giảm giá:</Col>
                    <Col span={12} style={{ textAlign: "right", color: "#52c41a" }}>
                      -{formatPrice(appointmentResult.couponDiscount)}
                    </Col>
                  </Row>
                  <Row style={{ fontWeight: "bold" }}>
                    <Col span={12}>Thành tiền:</Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      {formatPrice(appointmentResult.finalTotal)}
                    </Col>
                  </Row>
                </div>
              </div>
            )}
            
            <p>Chúng tôi sẽ liên hệ với bạn để xác nhận lịch hẹn.</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Booking;
