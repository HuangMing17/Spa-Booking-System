import React, { useEffect } from 'react';
import { List, ListItemButton, ListItemText, Badge, Typography, Button, Box, CircularProgress } from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { useChat } from '../../context/chat/ChatContext';
import { useCustomerAuth } from '../../auth/customer/context/CustomerAuthContext';

const ConversationList = () => {
  const { user } = useCustomerAuth();
  const { 
    conversations, 
    loadConversations, 
    selectConversation, 
    startConversation, 
    connectWebSocket, 
    setCurrentUser,
    loading,
    isConnected
  } = useChat();

  useEffect(() => {
    if (user) {
      connectWebSocket();
      setCurrentUser({ 
        id: user.id, 
        type: 'CUSTOMER', 
        name: user.fullName || user.email 
      });
      loadConversations(user.id, 'CUSTOMER');
    }
  }, [user, connectWebSocket, setCurrentUser, loadConversations]);

  const handleStartNewChat = async () => {
    if (user) {
      try {
        const conv = await startConversation(user.id, 'SUPPORT', 'Cần hỗ trợ');
        if (conv) {
          await selectConversation(conv);
        }
      } catch (err) {
        console.error('Failed to start or select conversation:', err);
      }
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    // Less than 24 hours
    if (diff < 86400000) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
    // Less than 7 days
    if (diff < 604800000) {
      return date.toLocaleDateString('vi-VN', { weekday: 'short' });
    }
    // Older
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Connection Status */}
      {!user ? (
        <Box sx={{ bgcolor: 'info.light', p: 2, textAlign: 'center' }}>
          <Typography variant="body2">Vui lòng đăng nhập để sử dụng chức năng chat hỗ trợ.</Typography>
        </Box>
      ) : !isConnected && (
        <Box sx={{ bgcolor: 'warning.light', p: 1, textAlign: 'center' }}>
          <Typography variant="caption">Đang kết nối...</Typography>
        </Box>
      )}

      {/* New Chat Button */}
      <Box sx={{ p: 2 }}>
        <Button 
          variant="contained" 
          fullWidth 
          onClick={handleStartNewChat}
          startIcon={<AddCommentIcon />}
          disabled={loading || !isConnected}
        >
          Bắt Đầu Chat Mới
        </Button>
      </Box>
      
      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <CircularProgress />
        </Box>
      ) : conversations.length === 0 ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Chưa có cuộc hội thoại nào
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Nhấn nút bên trên để bắt đầu chat với nhân viên hỗ trợ
          </Typography>
        </Box>
      ) : (
        <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
          {conversations.filter(conv => conv != null).map(conv => (
            <ListItemButton 
              key={conv.id} 
              onClick={() => selectConversation(conv)}
              sx={{
                borderBottom: 1,
                borderColor: 'divider',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: (conv?.unreadCount ?? 0) > 0 ? 'bold' : 'normal' }}>
                      {conv?.subject || 'Chat Hỗ Trợ'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(conv?.lastMessageAt || conv?.createdAt)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1,
                        fontWeight: (conv?.unreadCount ?? 0) > 0 ? 500 : 400
                      }}
                    >
                      {conv?.lastMessageContent || 'Chưa có tin nhắn'}
                    </Typography>
                    {(conv?.unreadCount ?? 0) > 0 && (
                      <Badge 
                        badgeContent={conv.unreadCount} 
                        color="error"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Box>
                }
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ConversationList;
