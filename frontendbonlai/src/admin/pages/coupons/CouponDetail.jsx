import React from 'react';
import {
  Descriptions,
  Tag,
  Typography,
  Space,
  Row,
  Col,
  Progress,
  Card,
  Statistic,
  Alert
} from 'antd';
import {
  GiftOutlined,
  CalendarOutlined,
  UserOutlined,
  ShoppingOutlined,
  PercentageOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  StopOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { formatCurrency } from '../../../utils/formatters';
import moment from 'moment';

const { Title, Text } = Typography;

const CouponDetail = ({ coupon, onClose }) => {
  // Xác định trạng thái mã giảm giá
  const getCouponStatus = () => {
    const now = moment();
    const startDate = moment(coupon.startDate);
    const endDate = moment(coupon.endDate);
    
    if (now.isBefore(startDate)) {
      return {
        status: 'upcoming',
        color: 'blue',
        text: 'Sắp diễn ra',
        icon: <ClockCircleOutlined />
      };
    } else if (now.isAfter(endDate)) {
      return {
        status: 'expired',
        color: 'red',
        text: 'Đã hết hạn',
        icon: <StopOutlined />
      };
    } else if (endDate.diff(now, 'days') <= 7) {
      return {
        status: 'expiring',
        color: 'orange',
        text: 'Sắp hết hạn',
        icon: <ExclamationCircleOutlined />
      };
    } else {
      return {
        status: 'active',
        color: 'green',
        text: 'Đang hoạt động',
        icon: <CheckCircleOutlined />
      };
    }
  };

  // Tính phần trăm sử dụng
  const getUsagePercentage = () => {
    const used = coupon.usedCount || 0;
    const max = coupon.maxUsage || 1;
    return Math.round((used / max) * 100);
  };

  // Tính số ngày còn lại
  const getDaysRemaining = () => {
    const now = moment();
    const endDate = moment(coupon.endDate);
    const days = endDate.diff(now, 'days');
    return Math.max(0, days);
  };

  const statusInfo = getCouponStatus();
  const usagePercentage = getUsagePercentage();
  const daysRemaining = getDaysRemaining();

  return (
    <div>
      {/* Thông tin tổng quan */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Mã giảm giá"
              value={coupon.code}
              prefix={<GiftOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Giá trị giảm"
              value={
                coupon.discountType === 'PERCENTAGE'
                  ? `${coupon.discountValue}%`
                  : formatCurrency(coupon.discountValue)
              }
              prefix={
                coupon.discountType === 'PERCENTAGE' 
                  ? <PercentageOutlined style={{ color: '#52c41a' }} />
                  : <DollarOutlined style={{ color: '#52c41a' }} />
              }
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Lượt sử dụng"
              value={`${coupon.usedCount || 0}/${coupon.maxUsage}`}
              prefix={<UserOutlined style={{ color: '#faad14' }} />}
              suffix={
                <Progress
                  percent={usagePercentage}
                  size="small"
                  showInfo={false}
                  strokeColor={usagePercentage >= 80 ? '#ff4d4f' : '#1890ff'}
                />
              }
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Ngày còn lại"
              value={daysRemaining}
              prefix={<CalendarOutlined style={{ color: '#722ed1' }} />}
              suffix="ngày"
              valueStyle={{ 
                color: daysRemaining <= 7 ? '#ff4d4f' : '#722ed1' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Cảnh báo trạng thái */}
      {statusInfo.status === 'expiring' && (
        <Alert
          type="warning"
          message="Mã giảm giá sắp hết hạn"
          description={`Mã này sẽ hết hạn trong ${daysRemaining} ngày nữa.`}
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {statusInfo.status === 'expired' && (
        <Alert
          type="error"
          message="Mã giảm giá đã hết hạn"
          description="Mã này không thể sử dụng được nữa."
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {usagePercentage >= 90 && (
        <Alert
          type="warning"
          message="Sắp đạt giới hạn sử dụng"
          description={`Mã này đã được sử dụng ${usagePercentage}% lượt cho phép.`}
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}

      {/* Thông tin chi tiết */}
      <Descriptions
        title="Thông tin chi tiết"
        bordered
        column={2}
        size="middle"
      >
        <Descriptions.Item label="Mã giảm giá" span={2}>
          <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
            {coupon.code}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label="Loại giảm giá">
          <Tag color={coupon.discountType === 'PERCENTAGE' ? 'blue' : 'green'}>
            {coupon.discountType === 'PERCENTAGE' ? 'Phần trăm' : 'Số tiền cố định'}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Giá trị">
          <Text strong>
            {coupon.discountType === 'PERCENTAGE'
              ? `${coupon.discountValue}%`
              : formatCurrency(coupon.discountValue)
            }
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label="Đơn hàng tối thiểu">
          {coupon.minimumOrderAmount > 0 
            ? formatCurrency(coupon.minimumOrderAmount)
            : 'Không có'
          }
        </Descriptions.Item>

        <Descriptions.Item label="Số lượt tối đa">
          {coupon.maxUsage?.toLocaleString()}
        </Descriptions.Item>

        <Descriptions.Item label="Đã sử dụng">
          <Space>
            <Text>{(coupon.usedCount || 0).toLocaleString()}</Text>
            <Progress
              percent={usagePercentage}
              size="small"
              style={{ width: '100px' }}
              strokeColor={usagePercentage >= 80 ? '#ff4d4f' : '#1890ff'}
            />
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Còn lại">
          <Text strong>
            {(coupon.maxUsage - (coupon.usedCount || 0)).toLocaleString()}
          </Text>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày bắt đầu">
          <Space>
            <CalendarOutlined />
            {moment(coupon.startDate).format('DD/MM/YYYY HH:mm')}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Ngày kết thúc">
          <Space>
            <CalendarOutlined />
            {moment(coupon.endDate).format('DD/MM/YYYY HH:mm')}
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Trạng thái" span={2}>
          <Tag color={statusInfo.color} icon={statusInfo.icon}>
            {statusInfo.text}
          </Tag>
          {statusInfo.status === 'active' && daysRemaining <= 30 && (
            <Text type="secondary" style={{ marginLeft: '8px' }}>
              (Còn {daysRemaining} ngày)
            </Text>
          )}
        </Descriptions.Item>

        {coupon.description && (
          <Descriptions.Item label="Mô tả" span={2}>
            {coupon.description}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Ngày tạo">
          {coupon.createdAt 
            ? moment(coupon.createdAt).format('DD/MM/YYYY HH:mm')
            : 'Không có thông tin'
          }
        </Descriptions.Item>

        <Descriptions.Item label="Cập nhật lần cuối">
          {coupon.updatedAt 
            ? moment(coupon.updatedAt).format('DD/MM/YYYY HH:mm')
            : 'Chưa cập nhật'
          }
        </Descriptions.Item>
      </Descriptions>

      {/* Thống kê sử dụng */}
      <div style={{ marginTop: '24px' }}>
        <Title level={5}>Thống kê sử dụng</Title>
        <Row gutter={16}>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tỷ lệ sử dụng"
                value={usagePercentage}
                suffix="%"
                valueStyle={{
                  color: usagePercentage >= 80 
                    ? '#ff4d4f' 
                    : usagePercentage >= 50 
                      ? '#faad14' 
                      : '#52c41a'
                }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Hiệu quả"
                value={
                  coupon.maxUsage > 0 
                    ? Math.round(((coupon.usedCount || 0) / coupon.maxUsage) * 100)
                    : 0
                }
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                title="Tổng tiết kiệm"
                value={
                  coupon.discountType === 'PERCENTAGE'
                    ? 'Không xác định'
                    : formatCurrency((coupon.usedCount || 0) * coupon.discountValue)
                }
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CouponDetail;
