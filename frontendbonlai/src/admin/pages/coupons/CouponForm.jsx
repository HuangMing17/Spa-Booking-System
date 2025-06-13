import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  message,
  Typography,
  Space,
  Divider,
  Alert,
  Switch
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  GiftOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { couponAPI } from './couponAPI';
import { formatCurrency } from '../../../utils/formatters';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { TextArea } = Input;

const CouponForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [discountType, setDiscountType] = useState('PERCENTAGE');
  const [previewData, setPreviewData] = useState(null);
  
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  // Lấy thông tin mã giảm giá khi chỉnh sửa
  useEffect(() => {
    if (isEdit) {
      fetchCoupon();
    }
  }, [id]);

  const fetchCoupon = async () => {
    try {
      setLoading(true);
      const coupon = await couponAPI.getCouponById(id);
      
      // Set form values
      form.setFieldsValue({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumOrderAmount: coupon.minimumOrderAmount,
        maxUsage: coupon.maxUsage,
        dateRange: [moment(coupon.startDate), moment(coupon.endDate)],
        description: coupon.description || '',
        isActive: coupon.isActive !== false
      });
      
      setDiscountType(coupon.discountType);
    } catch (error) {
      message.error('Lỗi khi tải thông tin mã giảm giá');
      navigate('/admin/coupons');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (values) => {
    try {
      setSubmitting(true);
      
      const submitData = {
        code: values.code.toUpperCase(),
        discountType: values.discountType,
        discountValue: values.discountValue,
        minimumOrderAmount: values.minimumOrderAmount || 0,
        maxUsage: values.maxUsage,
        startDate: values.dateRange[0].startOf('day').toISOString(),
        endDate: values.dateRange[1].endOf('day').toISOString(),
        description: values.description || '',
        isActive: values.isActive !== false
      };

      if (isEdit) {
        await couponAPI.updateCoupon(id, submitData);
        message.success('Cập nhật mã giảm giá thành công');
      } else {
        await couponAPI.createCoupon(submitData);
        message.success('Tạo mã giảm giá thành công');
      }
      
      navigate('/admin/coupons');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
        (isEdit ? 'Lỗi khi cập nhật mã giảm giá' : 'Lỗi khi tạo mã giảm giá');
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Tự động tạo mã khi thay đổi form
  const handleFormChange = () => {
    const values = form.getFieldsValue();
    if (values.discountType && values.discountValue && values.dateRange && values.dateRange[0]) {
      setPreviewData(values);
    }
  };

  // Tạo mã tự động
  const generateCouponCode = () => {
    const values = form.getFieldsValue();
    let code = '';
    
    if (values.discountType === 'PERCENTAGE') {
      code = `SALE${values.discountValue || ''}`;
    } else {
      code = `CASH${Math.floor((values.discountValue || 0) / 1000)}K`;
    }
    
    if (values.dateRange && values.dateRange[0]) {
      const month = values.dateRange[0].format('MM');
      const year = values.dateRange[0].format('YYYY');
      code += `${month}${year}`;
    }
    
    form.setFieldValue('code', code);
  };

  // Render preview
  const renderPreview = () => {
    if (!previewData || !previewData.discountType || !previewData.discountValue) {
      return null;
    }

    const discountText = previewData.discountType === 'PERCENTAGE' 
      ? `${previewData.discountValue}%`
      : formatCurrency(previewData.discountValue);

    return (
      <Alert
        type="info"
        showIcon
        icon={<GiftOutlined />}
        message="Xem trước mã giảm giá"
        description={
          <div>
            <Text strong>Giảm {discountText}</Text>
            {previewData.minimumOrderAmount > 0 && (
              <Text> cho đơn hàng từ {formatCurrency(previewData.minimumOrderAmount)}</Text>
            )}
            {previewData.dateRange && previewData.dateRange[0] && previewData.dateRange[1] && (
              <Text block style={{ marginTop: 4 }}>
                Có hiệu lực từ {previewData.dateRange[0].format('DD/MM/YYYY')} 
                đến {previewData.dateRange[1].format('DD/MM/YYYY')}
              </Text>
            )}
          </div>
        }
        style={{ marginBottom: 16 }}
      />
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
        <Col>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/admin/coupons')}
            >
              Quay lại
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              <GiftOutlined /> {isEdit ? 'Chỉnh sửa mã giảm giá' : 'Tạo mã giảm giá mới'}
            </Title>
          </Space>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={16}>
          <Card loading={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              onValuesChange={handleFormChange}
              initialValues={{
                discountType: 'PERCENTAGE',
                isActive: true
              }}
            >
              {/* Mã giảm giá */}
              <Row gutter={16}>
                <Col span={18}>
                  <Form.Item
                    label="Mã giảm giá"
                    name="code"
                    rules={[
                      { required: true, message: 'Vui lòng nhập mã giảm giá' },
                      { min: 3, message: 'Mã phải có ít nhất 3 ký tự' },
                      { max: 20, message: 'Mã không được quá 20 ký tự' },
                      { pattern: /^[A-Z0-9]+$/, message: 'Mã chỉ được chứa chữ cái viết hoa và số' }
                    ]}
                  >
                    <Input 
                      placeholder="VD: SUMMER2024"
                      style={{ textTransform: 'uppercase' }}
                    />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label=" ">
                    <Button onClick={generateCouponCode} style={{ width: '100%' }}>
                      Tự động tạo
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Thông tin giảm giá</Divider>

              {/* Loại và giá trị giảm giá */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Loại giảm giá"
                    name="discountType"
                    rules={[{ required: true, message: 'Vui lòng chọn loại giảm giá' }]}
                  >
                    <Select 
                      placeholder="Chọn loại giảm giá"
                      onChange={setDiscountType}
                    >
                      <Option value="PERCENTAGE">Phần trăm (%)</Option>
                      <Option value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={discountType === 'PERCENTAGE' ? 'Phần trăm giảm' : 'Số tiền giảm'}
                    name="discountValue"
                    rules={[
                      { required: true, message: 'Vui lòng nhập giá trị giảm giá' },
                      { 
                        type: 'number', 
                        min: discountType === 'PERCENTAGE' ? 1 : 1000,
                        max: discountType === 'PERCENTAGE' ? 100 : 10000000,
                        message: discountType === 'PERCENTAGE' 
                          ? 'Phần trăm phải từ 1% đến 100%'
                          : 'Số tiền phải từ 1,000 VNĐ đến 10,000,000 VNĐ'
                      }
                    ]}
                  >
                    <InputNumber
                      placeholder={discountType === 'PERCENTAGE' ? 'VD: 20' : 'VD: 50000'}
                      style={{ width: '100%' }}
                      formatter={value => 
                        discountType === 'PERCENTAGE' 
                          ? `${value}%`
                          : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      }
                      parser={value => value.replace(/\$\s?|(,*)/g, '').replace('%', '')}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Điều kiện áp dụng */}
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Giá trị đơn hàng tối thiểu"
                    name="minimumOrderAmount"
                  >
                    <InputNumber
                      placeholder="VD: 500000"
                      style={{ width: '100%' }}
                      min={0}
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value.replace(/\$\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Số lượt sử dụng tối đa"
                    name="maxUsage"
                    rules={[
                      { required: true, message: 'Vui lòng nhập số lượt sử dụng' },
                      { type: 'number', min: 1, message: 'Số lượt sử dụng phải lớn hơn 0' }
                    ]}
                  >
                    <InputNumber
                      placeholder="VD: 100"
                      style={{ width: '100%' }}
                      min={1}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Divider>Thời gian áp dụng</Divider>

              {/* Thời gian hiệu lực */}
              <Form.Item
                label="Thời gian hiệu lực"
                name="dateRange"
                rules={[{ required: true, message: 'Vui lòng chọn thời gian hiệu lực' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                  format="DD/MM/YYYY"
                  disabledDate={(current) => current && current < moment().startOf('day')}
                />
              </Form.Item>

              {/* Mô tả */}
              <Form.Item
                label="Mô tả (tùy chọn)"
                name="description"
              >
                <TextArea
                  rows={3}
                  placeholder="Mô tả chi tiết về mã giảm giá..."
                />
              </Form.Item>

              {/* Trạng thái */}
              <Form.Item
                label="Trạng thái"
                name="isActive"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Kích hoạt"
                  unCheckedChildren="Tạm dừng"
                />
              </Form.Item>

              {/* Buttons */}
              <Form.Item style={{ marginTop: '32px' }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    icon={<SaveOutlined />}
                  >
                    {isEdit ? 'Cập nhật' : 'Tạo mã giảm giá'}
                  </Button>
                  <Button onClick={() => navigate('/admin/coupons')}>
                    Hủy
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={8}>
          <div style={{ position: 'sticky', top: '24px' }}>
            {/* Preview */}
            {renderPreview()}
            
            {/* Hướng dẫn */}
            <Card
              title={<><InfoCircleOutlined /> Hướng dẫn</>}
              size="small"
            >
              <Space direction="vertical" size="small">
                <Text type="secondary">
                  • Mã giảm giá chỉ chứa chữ cái viết hoa và số
                </Text>
                <Text type="secondary">
                  • Giảm theo phần trăm: từ 1% đến 100%
                </Text>
                <Text type="secondary">
                  • Giảm theo số tiền: tối thiểu 1,000 VNĐ
                </Text>
                <Text type="secondary">
                  • Có thể đặt điều kiện đơn hàng tối thiểu
                </Text>
                <Text type="secondary">
                  • Giới hạn số lượt sử dụng để tránh lạm dụng
                </Text>
              </Space>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CouponForm;
