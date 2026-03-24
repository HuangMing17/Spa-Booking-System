import React, { useEffect, useState } from 'react';
import { 
  Layout, 
  List, 
  Avatar, 
  Typography, 
  Badge, 
  Button, 
  Empty, 
  Spin,
  Tag,
  Tooltip,
  Input,
  Space
} from 'antd';
import { 
  MessageOutlined, 
  UserOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  SendOutlined
} from '@ant-design/icons';
import { useChat } from '../../../context/chat/ChatContext';
import { useAdminAuth } from '../../../auth/admin/context/AdminAuthContext';
import MessageView from '../../../components/chat/MessageView';
import chatApiService from '../../../services/chatApiService';
import './AdminChat.css';

const { Content, Sider } = Layout;
const { Title, Text, Paragraph } = Typography;

const AdminChat = () => {
  const { admin } = useAdminAuth();
  const { 
    conversations,
    currentConversation, 
    loadConversations,
    selectConversation, 
    connectWebSocket, 
    isConnected,
    setCurrentUser,
    loading
  } = useChat();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, closed

  useEffect(() => {
    if (admin) {
      setCurrentUser({
        id: admin.id,
        type: 'ADMIN',
        name: admin.fullName || admin.username
      });
      connectWebSocket();
      loadConversations(admin.id, 'ADMIN');
    }
  }, [admin, connectWebSocket, setCurrentUser, loadConversations]);

  const filteredConversations = (conversations || []).filter(conv => {
    if (!conv) return false;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = (conv.customerName?.toLowerCase() || '').includes(searchLower) || 
                          (conv.subject?.toLowerCase() || '').includes(searchLower);
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'active') return matchesSearch && conv.status === 'ACTIVE';
    if (filter === 'closed') return matchesSearch && conv.status === 'CLOSED';
    return matchesSearch;
  });


  const getStatusTag = (status) => {
    switch (status) {
      case 'ACTIVE':
        return <Tag color="green">Đang hoạt động</Tag>;
      case 'CLOSED':
        return <Tag color="default">Đã đóng</Tag>;
      default:
        return <Tag color="blue">{status}</Tag>;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout className="admin-chat-layout" style={{ height: 'calc(100vh - 150px)', background: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
      <Sider width={350} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={4} style={{ margin: 0 }}>Hỗ Trợ</Title>
            <div style={{ fontSize: '12px', color: isConnected ? '#52c41a' : '#ff4d4f' }}>
              {isConnected ? '● Đang kết nối' : '○ Mất kết nối'}
            </div>
          </div>
          <Input 
            placeholder="Tìm kiếm hội thoại..." 
            prefix={<SearchOutlined />} 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ marginBottom: '12px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button size="small" type={filter === 'all' ? 'primary' : 'default'} onClick={() => setFilter('all')}>Tất cả</Button>
            <Button size="small" type={filter === 'active' ? 'primary' : 'default'} onClick={() => setFilter('active')}>Hoạt động</Button>
          </div>
        </div>
        
        <div style={{ overflowY: 'auto', height: 'calc(100% - 130px)' }}>
          {loading && (conversations || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>
          ) : filteredConversations.length === 0 ? (
            <Empty description="Không tìm thấy hội thoại" style={{ marginTop: '40px' }} />
          ) : (
            <List
              dataSource={filteredConversations}
              renderItem={item => (
                <List.Item 
                  className={`conversation-item ${currentConversation?.id === item.id ? 'active' : ''}`}
                  onClick={() => selectConversation(item)}
                  style={{ 
                    padding: '12px 16px', 
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: currentConversation?.id === item.id ? '#e6f7ff' : 'transparent',
                    borderLeft: currentConversation?.id === item.id ? '4px solid #1890ff' : '4px solid transparent'
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge count={item.unreadCount} size="small">
                        <Avatar icon={<UserOutlined />} />
                      </Badge>
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong style={{ maxWidth: '150px' }} ellipsis>{item.customerName || 'Khách hàng'}</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{formatTime(item.lastMessageAt || item.createdAt)}</Text>
                      </div>
                    }
                    description={
                      <div style={{ maxWidth: '250px' }}>
                        <Paragraph ellipsis={{ rows: 1 }} style={{ margin: 0, fontSize: '13px' }}>
                          {item.lastMessageContent || 'Bắt đầu cuộc trò chuyện...'}
                        </Paragraph>
                        <div style={{ marginTop: '4px' }}>
                          {getStatusTag(item.status)}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </div>
      </Sider>
      
      <Content style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#f9f9f9' }}>
        {currentConversation ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ fontSize: '16px' }}>{currentConversation.customerName || 'Khách hàng'}</Text>
                <div style={{ fontSize: '12px', color: isConnected ? '#52c41a' : '#ff4d4f' }}>
                  {isConnected ? '● Đang kết nối' : '○ Mất kết nối'}
                </div>
              </div>
              <Space>
                <Tooltip title="Thông tin khách hàng">
                  <Button icon={<UserOutlined />} shape="circle" />
                </Tooltip>
              </Space>
            </div>
            
            <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
              <MessageView isAdmin={true} />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#bfbfbf' }}>
            <MessageOutlined style={{ fontSize: '64px', marginBottom: '16px' }} />
            <Text type="secondary">Chọn một hội thoại để bắt đầu hỗ trợ khách hàng</Text>
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default AdminChat;
