# 🚀 Hướng Dẫn Tiếp Tục Phát Triển Chat Feature

## 📌 Tình Trạng Hiện Tại

**Backend: ✅ 100% Hoàn Thành**
**Frontend: ⏳ 70% Hoàn Thành (Services & State Management)**
**UI Components: ❌ 0% (Cần làm tiếp)**

---

## 🎯 Bước Tiếp Theo - Tạo UI Components

### Bước 1: Tạo ChatButton Component (Nút Chat Nổi)

```bash
# Tạo folder cho chat components
mkdir frontendbonlai/src/components/chat
```

Tạo file: `frontendbonlai/src/components/chat/ChatButton.jsx`

```jsx
import React, { useState } from 'react';
import { Fab, Badge } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatWindow from './ChatWindow';
import { useChat } from '../../context/chat/ChatContext';

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const { unreadCounts } = useChat();
  
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <Fab 
        color="primary" 
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <Badge badgeContent={totalUnread} color="error">
          <ChatIcon />
        </Badge>
      </Fab>
      
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
};

export default ChatButton;
```

### Bước 2: Tạo ChatWindow Component

Tạo file: `frontendbonlai/src/components/chat/ChatWindow.jsx`

```jsx
import React from 'react';
import { Paper, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ConversationList from './ConversationList';
import MessageView from './MessageView';
import { useChat } from '../../context/chat/ChatContext';

const ChatWindow = ({ onClose }) => {
  const { currentConversation } = useChat();

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 20,
        width: 400,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: 4
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {currentConversation ? 'Chat Support' : 'Cuộc Hội Thoại'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {currentConversation ? <MessageView /> : <ConversationList />}
      </Box>
    </Paper>
  );
};

export default ChatWindow;
```

### Bước 3: Tạo ConversationList Component

Tạo file: `frontendbonlai/src/components/chat/ConversationList.jsx`

```jsx
import React, { useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemButton, Badge, Typography, Button, Box } from '@mui/material';
import { useChat } from '../../context/chat/ChatContext';
import { useCustomerAuth } from '../../auth/customer/context/CustomerAuthContext';

const ConversationList = () => {
  const { user } = useCustomerAuth();
  const { conversations, loadConversations, selectConversation, startConversation, connectWebSocket, setCurrentUser } = useChat();

  useEffect(() => {
    if (user) {
      connectWebSocket();
      setCurrentUser({ id: user.id, type: 'CUSTOMER', name: user.fullName || user.email });
      loadConversations(user.id, 'CUSTOMER');
    }
  }, [user]);

  const handleStartNewChat = async () => {
    if (user) {
      await startConversation(user.id, 'SUPPORT', 'Cần hỗ trợ');
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2 }}>
        <Button variant="contained" fullWidth onClick={handleStartNewChat}>
          Bắt Đầu Chat Mới
        </Button>
      </Box>
      
      {conversations.length === 0 ? (
        <Typography sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          Chưa có cuộc hội thoại nào
        </Typography>
      ) : (
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {conversations.map(conv => (
            <ListItemButton key={conv.id} onClick={() => selectConversation(conv)}>
              <ListItemText
                primary={conv.subject || 'Support Chat'}
                secondary={conv.lastMessageContent || 'Chưa có tin nhắn'}
              />
              {conv.unreadCount > 0 && (
                <Badge badgeContent={conv.unreadCount} color="error" />
              )}
            </ListItemButton>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ConversationList;
```

### Bước 4: Tạo MessageView Component

Tạo file: `frontendbonlai/src/components/chat/MessageView.jsx`

```jsx
import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../../context/chat/ChatContext';

const MessageView = () => {
  const { messages, currentConversation, markAllAsRead } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when conversation is opened
    if (currentConversation) {
      markAllAsRead();
    }
  }, [currentConversation]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </Box>
      
      <TypingIndicator />
      
      <MessageInput />
    </Box>
  );
};

export default MessageView;
```

### Bước 5: Tạo MessageList Component

Tạo file: `frontendbonlai/src/components/chat/MessageList.jsx`

```jsx
import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';

const MessageList = ({ messages }) => {
  return (
    <Box>
      {messages.map(message => {
        const isCustomer = message.senderType === 'CUSTOMER';
        
        return (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: isCustomer ? 'flex-end' : 'flex-start',
              mb: 2
            }}
          >
            <Paper
              sx={{
                p: 1.5,
                maxWidth: '70%',
                bgcolor: isCustomer ? 'primary.main' : 'grey.200',
                color: isCustomer ? 'white' : 'text.primary'
              }}
            >
              {!isCustomer && (
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                  {message.senderName}
                </Typography>
              )}
              <Typography variant="body2">{message.content}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                {format(new Date(message.createdAt), 'HH:mm')}
              </Typography>
            </Paper>
          </Box>
        );
      })}
    </Box>
  );
};

export default MessageList;
```

### Bước 6: Tạo MessageInput Component

Tạo file: `frontendbonlai/src/components/chat/MessageInput.jsx`

```jsx
import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '../../context/chat/ChatContext';
import { useCustomerAuth } from '../../auth/customer/context/CustomerAuthContext';

const MessageInput = () => {
  const [text, setText] = useState('');
  const { user } = useCustomerAuth();
  const { sendMessage, sendTypingIndicator } = useChat();

  const handleSend = () => {
    if (text.trim() && user) {
      sendMessage({
        senderId: user.id,
        senderType: 'CUSTOMER',
        senderName: user.fullName || user.email,
        messageType: 'TEXT',
        content: text.trim()
      });
      setText('');
      sendTypingIndicator(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      sendTypingIndicator(true);
    }
  };

  return (
    <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 1 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Nhập tin nhắn..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        multiline
        maxRows={3}
      />
      <IconButton color="primary" onClick={handleSend} disabled={!text.trim()}>
        <SendIcon />
      </IconButton>
    </Box>
  );
};

export default MessageInput;
```

### Bước 7: Tạo TypingIndicator Component

Tạo file: `frontendbonlai/src/components/chat/TypingIndicator.jsx`

```jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import { useChat } from '../../context/chat/ChatContext';

const TypingIndicator = () => {
  const { typingUsers } = useChat();

  if (typingUsers.length === 0) return null;

  return (
    <Box sx={{ px: 2, py: 1, bgcolor: 'grey.100' }}>
      <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
        {typingUsers[0].userName} đang gõ...
      </Typography>
    </Box>
  );
};

export default TypingIndicator;
```

---

## 🔧 Bước 8: Tích Hợp vào App

### Cập nhật `frontendbonlai/src/App.js`

```jsx
import { ChatProvider } from './context/chat/ChatContext';

function App() {
  return (
    <CustomerAuthProvider>
      <AdminAuthProvider>
        <ChatProvider>  {/* Thêm ChatProvider ở đây */}
          {/* Existing routes */}
        </ChatProvider>
      </AdminAuthProvider>
    </CustomerAuthProvider>
  );
}
```

### Cập nhật `frontendbonlai/src/user/layouts/UserLayout.jsx`

```jsx
import ChatButton from '../../components/chat/ChatButton';

const UserLayout = () => {
  return (
    <div>
      {/* Existing layout */}
      <ChatButton />  {/* Thêm ChatButton */}
    </div>
  );
};
```

### Tương tự cho Admin Layout

```jsx
// frontendbonlai/src/admin/layouts/AdminLayout.jsx
import ChatButton from '../../components/chat/ChatButton';

const AdminLayout = () => {
  return (
    <div>
      {/* Existing layout */}
      <ChatButton />  {/* Thêm ChatButton */}
    </div>
  );
};
```

---

## 📦 Cài Đặt Material-UI (nếu chưa có)

```bash
cd frontendbonlai
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install date-fns  # For date formatting
```

---

## 🧪 Testing

### 1. Test Backend API
Sử dụng Postman hoặc Thunder Client:

```bash
# Tạo conversation
POST http://localhost:8080/api/chat/conversations
Content-Type: application/json
Authorization: Bearer {JWT_TOKEN}

{
  "customerId": "uuid-here",
  "roomType": "SUPPORT",
  "subject": "Test chat"
}

# Lấy messages
GET http://localhost:8080/api/chat/conversations/{conversationId}/messages/all
Authorization: Bearer {JWT_TOKEN}
```

### 2. Test WebSocket Connection
Mở browser console:

```javascript
// Test trong component
const { isConnected } = useChat();
console.log('WebSocket connected:', isConnected);
```

### 3. Test Chat Functionality
1. Đăng nhập với customer account
2. Click vào nút chat
3. Bắt đầu chat mới
4. Gửi tin nhắn
5. Check typing indicator
6. Mở tab mới, đăng nhập staff, check nhận tin nhắn

---

## 🎨 Customization

### Thay đổi màu sắc
```jsx
// Trong ChatWindow.jsx
<Paper sx={{ bgcolor: '#f5f5f5' }}>

// Trong MessageList.jsx
bgcolor: isCustomer ? '#1976d2' : '#e0e0e0'
```

### Responsive Mobile
```jsx
// Trong ChatWindow.jsx
sx={{
  width: { xs: '100%', sm: 400 },
  height: { xs: '100vh', sm: 600 },
  right: { xs: 0, sm: 20 }
}}
```

---

## 🐛 Troubleshooting

### WebSocket không kết nối được
1. Check backend đang chạy: `docker-compose ps`
2. Check URL trong chatWebSocketService.js: `http://localhost:8080/ws/chat`
3. Check CORS trong WebSocketConfig.java

### Không nhận được tin nhắn
1. Check subscribe đúng conversationId chưa
2. Check console log xem có error không
3. Verify backend broadcast message đúng topic

### Typing indicator không hiện
1. Check sendTypingIndicator được gọi đúng chưa
2. Check timeout 3 giây
3. Verify subscription `/topic/conversation/{id}/typing`

---

## 📝 TODO Checklist

- [ ] Install @mui/material và date-fns
- [ ] Tạo 7 component files
- [ ] Integrate ChatProvider vào App.js
- [ ] Thêm ChatButton vào UserLayout
- [ ] Thêm ChatButton vào AdminLayout (optional)
- [ ] Test chat giữa customer và staff
- [ ] Test typing indicators
- [ ] Test read receipts
- [ ] Responsive mobile testing
- [ ] Style customization theo theme

---

## 🚀 Lệnh Nhanh

```bash
# Start backend
docker-compose up -d

# Start frontend
cd frontendbonlai
npm start

# View logs
docker-compose logs -f backend

# Rebuild backend sau khi sửa code
docker-compose build backend
docker-compose up -d backend
```

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề, check:
1. `plans/FINAL_CHAT_SUMMARY.md` - Tổng kết đầy đủ
2. `plans/CHAT_IMPLEMENTATION_STATUS.md` - Status chi tiết
3. `plans/CHAT_FEATURE_PLAN.md` - Kế hoạch ban đầu

**Good luck! 🎉**
