# 💬 Chat Feature - Quick Reference

## 📊 Tóm Tắt Nhanh

### Timeline
**4-6 tuần** (20-34 ngày làm việc)

### Tech Stack
- **Backend:** Spring Boot WebSocket + STOMP + MySQL
- **Frontend:** React + STOMP.js + Material-UI
- **Protocol:** WebSocket với SockJS fallback

---

## 🗄️ Database Tables (4 tables mới)

1. **chat_conversations** - Lưu cuộc hội thoại
2. **chat_messages** - Lưu tin nhắn
3. **chat_typing_indicators** - Trạng thái đang gõ
4. **chat_participants** - Người tham gia (optional)

---

## 🔧 Backend Tasks

### Dependencies Cần Thêm
```xml
- spring-boot-starter-websocket
- spring-messaging
- sockjs-client
- stomp-websocket
- spring-boot-starter-data-redis (optional)
```

### Files Cần Tạo
```
backend/
├── entity/
│   ├── ChatConversation.java
│   ├── ChatMessage.java
│   └── ChatParticipant.java
├── repository/
│   ├── ChatConversationRepository.java
│   ├── ChatMessageRepository.java
│   └── ChatParticipantRepository.java
├── service/
│   ├── ChatService.java
│   └── ChatServiceImpl.java
├── controller/
│   ├── ChatController.java (REST API)
│   └── ChatWebSocketController.java (WebSocket)
├── dto/
│   ├── ChatMessageDTO.java
│   ├── ConversationDTO.java
│   ├── TypingIndicatorDTO.java
│   └── ReadReceiptDTO.java
└── config/
    └── WebSocketConfig.java
```

---

## 💻 Frontend Tasks

### Dependencies Cần Thêm
```json
- sockjs-client: ^1.6.1
- @stomp/stompjs: ^7.0.0
- emoji-picker-react: ^4.5.0
- react-dropzone: ^14.2.3
- dayjs: ^1.11.10
```

### Files Cần Tạo
```
frontend/
├── services/
│   └── ChatWebSocketService.js
├── context/
│   └── ChatContext.jsx
├── api/
│   └── chatAPI.js
└── components/chat/
    ├── ChatWidget.jsx          # Floating button
    ├── ChatWindow.jsx          # Chat window
    ├── MessageList.jsx         # Message list
    ├── MessageItem.jsx         # Single message
    ├── MessageInput.jsx        # Input với emoji
    ├── TypingIndicator.jsx     # "Đang gõ..."
    ├── FileUpload.jsx          # Upload file
    ├── EmojiPicker.jsx         # Emoji picker
    └── ChatNotification.jsx    # Badge
```

---

## 🚀 Implementation Steps

### Phase 1: Backend (Sprint 1-2)
1. ✅ Tạo database schema
2. ✅ Tạo Entity & Repository
3. ✅ Setup WebSocket config
4. ✅ Tạo WebSocket controller
5. ✅ Tạo REST API endpoints
6. ✅ Implement messaging logic
7. ✅ Test WebSocket connection

### Phase 2: Frontend (Sprint 3-4)
1. ✅ Setup WebSocket service
2. ✅ Create Chat Context
3. ✅ Build chat components
4. ✅ Implement real-time messaging
5. ✅ Add typing indicator
6. ✅ Add read receipts
7. ✅ Add file upload
8. ✅ Add emoji picker

### Phase 3: Polish (Sprint 5)
1. ✅ Testing
2. ✅ Bug fixes
3. ✅ UI/UX improvements
4. ✅ Documentation
5. ✅ Deployment

---

## 🔌 WebSocket Endpoints

### Connect
```
ws://localhost:8080/ws
```

### Subscribe
```
/topic/conversation/{conversationId}         # Messages
/topic/conversation/{conversationId}/typing  # Typing
/topic/conversation/{conversationId}/read    # Read receipts
```

### Publish
```
/app/chat/send    # Send message
/app/chat/typing  # Typing indicator
/app/chat/read    # Mark as read
```

---

## 📡 REST API Endpoints

```
POST   /api/chat/conversations/start          # Start chat
GET    /api/chat/conversations                # List conversations
GET    /api/chat/conversations/{id}           # Get conversation
GET    /api/chat/conversations/{id}/messages  # Get messages
POST   /api/chat/messages                     # Send (fallback)
POST   /api/chat/upload                       # Upload file
PUT    /api/chat/conversations/{id}/assign    # Assign to staff
PUT    /api/chat/conversations/{id}/close     # Close chat
GET    /api/chat/unread-count                 # Unread count
```

---

## ✨ Key Features

### Customer Side
- ✅ Floating chat button
- ✅ Xem tên staff đang chat
- ✅ Send text messages
- ✅ Send emojis
- ✅ Upload images/files
- ✅ Typing indicator
- ✅ Read status
- ✅ Notification badge
- ✅ Chat history
- ✅ Mobile responsive

### Staff/Admin Side
- ✅ Dashboard với conversation list
- ✅ Assign conversation
- ✅ View customer info
- ✅ Send messages với tên hiển thị
- ✅ Typing indicator from customer
- ✅ Read status
- ✅ Close conversation
- ✅ Filter/Search conversations
- ✅ Unread count
- ✅ Metrics dashboard

---

## 🎯 Success Criteria

- [ ] Customer có thể start conversation và chat real-time
- [ ] Staff nhìn thấy tên của mình khi chat với customer
- [ ] Customer nhìn thấy tên staff đang chat
- [ ] Typing indicator hoạt động 2 chiều
- [ ] Read receipts hoạt động
- [ ] File upload hoạt động
- [ ] Chat history được lưu và load lại
- [ ] Notification badge hiển thị đúng
- [ ] System stable và performant
- [ ] Mobile responsive

---

## 📋 Checklist Trước Khi Bắt Đầu

### Backend
- [ ] Review current database schema
- [ ] Prepare development environment
- [ ] Setup WebSocket testing tools (Postman/SockJS)
- [ ] Review Spring Security config

### Frontend
- [ ] Review current component structure
- [ ] Setup WebSocket debugging tools
- [ ] Prepare test accounts (customer + staff)
- [ ] Review Material-UI components

### DevOps
- [ ] Plan for Redis installation (optional)
- [ ] Review Docker configuration
- [ ] Plan for Nginx WebSocket proxy
- [ ] Plan for SSL/TLS setup

---

## 🆘 Common Issues & Solutions

### Issue: WebSocket connection fails
**Solution:** Check CORS config, JWT authentication, and firewall rules

### Issue: Messages not real-time
**Solution:** Verify WebSocket subscription, check broker config

### Issue: Typing indicator laggy
**Solution:** Debounce typing events, use Redis for state

### Issue: File upload slow
**Solution:** Compress images, use chunked upload, CDN

### Issue: High memory usage
**Solution:** Implement pagination, lazy loading, cleanup old connections

---

## 📚 Resources

- **Full Plan:** [`plans/CHAT_FEATURE_PLAN.md`](CHAT_FEATURE_PLAN.md)
- **Spring WebSocket Docs:** https://spring.io/guides/gs/messaging-stomp-websocket/
- **STOMP.js Docs:** https://stomp-js.github.io/stomp-websocket/
- **SockJS Docs:** https://github.com/sockjs/sockjs-client

---

## 👥 Team Responsibilities

### Backend Developer(s)
- Database schema
- Entity & Repository
- WebSocket config
- Controllers & Services
- API endpoints
- Testing

### Frontend Developer(s)
- WebSocket service
- Chat Context
- Chat components
- UI/UX implementation
- Integration testing

### DevOps
- Redis setup (optional)
- Docker configuration
- Nginx WebSocket proxy
- Monitoring setup
- Deployment

---

**Created:** 2026-03-12  
**Version:** 1.0  
**Status:** Ready for Implementation
