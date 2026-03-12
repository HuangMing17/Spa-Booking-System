# 📋 Chat Feature - Implementation Checklist

## 🎯 Overview

Checklist này giúp theo dõi tiến độ triển khai tính năng Real-time Chat với đầy đủ features.

**Timeline:** 4-6 tuần (20-34 ngày)  
**Team Size:** 2-3 developers (1 backend, 1 frontend, 1 optional DevOps)

---

## 📚 Documents Created

- ✅ [`CHAT_FEATURE_PLAN.md`](CHAT_FEATURE_PLAN.md) - Kế hoạch chi tiết (60+ pages)
- ✅ [`CHAT_QUICK_REF.md`](CHAT_QUICK_REF.md) - Quick reference guide
- ✅ [`CHAT_DATABASE_MIGRATION.md`](CHAT_DATABASE_MIGRATION.md) - Database migration script
- ✅ [`CHAT_IMPLEMENTATION_CHECKLIST.md`](CHAT_IMPLEMENTATION_CHECKLIST.md) - This file

---

## 🗓️ Sprint Planning

### Sprint 1: Backend Foundation (5-7 days)

#### Day 1-2: Database Setup
- [ ] Backup current database
- [ ] Review database schema document
- [ ] Create migration script file: `docker/mysql/migrations/001_create_chat_tables.sql`
- [ ] Run migration on local database
- [ ] Verify all tables created successfully
- [ ] Test foreign keys and constraints
- [ ] Insert sample quick replies
- [ ] Commit migration script to git

#### Day 3-4: Entity & Repository Layer
- [ ] Create `ChatConversation` entity
  - [ ] Add JPA annotations
  - [ ] Define relationships
  - [ ] Add enums (ConversationStatus)
- [ ] Create `ChatMessage` entity
  - [ ] Add JPA annotations
  - [ ] Define relationships  
  - [ ] Add enums (SenderType, MessageType)
  - [ ] Add transient fields
- [ ] Create `ChatParticipant` entity (optional)
- [ ] Create `ChatTypingIndicator` entity
- [ ] Create `ChatQuickReply` entity
- [ ] Create Repository interfaces
  - [ ] `ChatConversationRepository`
  - [ ] `ChatMessageRepository`
  - [ ] `ChatParticipantRepository`
  - [ ] `ChatTypingIndicatorRepository`
  - [ ] `ChatQuickReplyRepository`
- [ ] Add custom query methods
- [ ] Test repositories with unit tests

#### Day 5-7: WebSocket Configuration
- [ ] Add WebSocket dependencies to `pom.xml`
  - [ ] `spring-boot-starter-websocket`
  - [ ] `spring-messaging`
  - [ ] `sockjs-client` (webjars)
  - [ ] `stomp-websocket` (webjars)
- [ ] Create `WebSocketConfig` class
  - [ ] Configure message broker
  - [ ] Register STOMP endpoints
  - [ ] Configure SockJS
  - [ ] Add JWT authentication interceptor
- [ ] Test WebSocket connection
  - [ ] Use Postman or browser console
  - [ ] Verify connection establishes
  - [ ] Verify JWT validation works
- [ ] Update `SecurityConfig` for WebSocket
  - [ ] Allow WebSocket endpoints
  - [ ] Configure CORS for WebSocket
- [ ] Document WebSocket endpoints

---

### Sprint 2: Backend Features (7-10 days)

#### Day 8-9: DTOs & Mappers
- [ ] Create DTOs
  - [ ] `ChatMessageDTO`
  - [ ] `ConversationDTO`
  - [ ] `TypingIndicatorDTO`
  - [ ] `ReadReceiptDTO`
  - [ ] `FileUploadResponseDTO`
  - [ ] `UnreadCountDTO`
- [ ] Create mapper methods
  - [ ] `toDTO()` methods
  - [ ] `toEntity()` methods
- [ ] Add validation annotations

#### Day 10-12: Service Layer
- [ ] Create `ChatService` interface
- [ ] Create `ChatServiceImpl`
  - [ ] `startConversation()`
  - [ ] `assignToStaff()`
  - [ ] `sendMessage()`
  - [ ] `getMessages()`
  - [ ] `markAsRead()`
  - [ ] `closeConversation()`
  - [ ] `getConversations()`
  - [ ] `getUnreadCount()`
  - [ ] `uploadFile()`
- [ ] Implement business logic
  - [ ] Validate permissions
  - [ ] Handle edge cases
  - [ ] Error handling
- [ ] Add logging
- [ ] Write unit tests

#### Day 13-15: WebSocket Controller
- [ ] Create `ChatWebSocketController`
  - [ ] `@MessageMapping("/chat/send")`
  - [ ] `@MessageMapping("/chat/typing")`
  - [ ] `@MessageMapping("/chat/read")`
- [ ] Implement message broadcasting
  - [ ] Broadcast to conversation participants
  - [ ] Handle typing indicators
  - [ ] Handle read receipts
- [ ] Test WebSocket messaging
  - [ ] Send message test
  - [ ] Receive message test
  - [ ] Typing indicator test
  - [ ] Read receipt test

#### Day 16-17: REST API Controller  
- [ ] Create `ChatController`
  - [ ] `POST /api/chat/conversations/start`
  - [ ] `GET /api/chat/conversations`
  - [ ] `GET /api/chat/conversations/{id}`
  - [ ] `GET /api/chat/conversations/{id}/messages`
  - [ ] `POST /api/chat/messages` (fallback)
  - [ ] `POST /api/chat/upload`
  - [ ] `PUT /api/chat/conversations/{id}/assign`
  - [ ] `PUT /api/chat/conversations/{id}/close`
  - [ ] `GET /api/chat/unread-count`
- [ ] Add request/response validation
- [ ] Add authorization checks
- [ ] Test all endpoints with Postman
- [ ] Document API with Swagger

#### Day 18: File Upload
- [ ] Configure file upload settings
  - [ ] Max file size
  - [ ] Allowed file types
  - [ ] Upload directory
- [ ] Implement file upload logic
  - [ ] Validate file
  - [ ] Generate unique filename
  - [ ] Save to disk/S3
  - [ ] Create thumbnail for images
- [ ] Return file URL
- [ ] Test file upload

---

### Sprint 3: Frontend Foundation (5-7 days)

#### Day 19-20: Setup & Dependencies
- [ ] Add frontend dependencies to `package.json`
  - [ ] `sockjs-client: ^1.6.1`
  - [ ] `@stomp/stompjs: ^7.0.0`
  - [ ] `emoji-picker-react: ^4.5.0`
  - [ ] `react-dropzone: ^14.2.3`
  - [ ] `dayjs: ^1.11.10`
- [ ] Run `npm install`
- [ ] Create folder structure
  ```
  src/
  ├── services/
  │   └── ChatWebSocketService.js
  ├── context/
  │   └── ChatContext.jsx
  ├── api/
  │   └── chatAPI.js
  └── components/chat/
      ├── ChatWidget.jsx
      ├── ChatWindow.jsx
      ├── MessageList.jsx
      ├── MessageItem.jsx
      ├── MessageInput.jsx
      ├── TypingIndicator.jsx
      ├── FileUpload.jsx
      ├── EmojiPicker.jsx
      └── ChatNotification.jsx
  ```

#### Day 21-22: WebSocket Service
- [ ] Create `ChatWebSocketService.js`
  - [ ] Connection management
  - [ ] Subscribe/Unsubscribe methods
  - [ ] Send message method
  - [ ] Send typing indicator method
  - [ ] Mark as read method
  - [ ] Auto-reconnect logic
  - [ ] Error handling
- [ ] Test WebSocket connection
  - [ ] Connect to backend
  - [ ] Subscribe to topics
  - [ ] Send/receive messages
  - [ ] Handle disconnection

#### Day 23-24: Chat Context
- [ ] Create `ChatContext.jsx`
  - [ ] State management
    - [ ] `connected`
    - [ ] `conversations`
    - [ ] `currentConversation`
    - [ ] `messages`
    - [ ] `typingUsers`
    - [ ] `unreadCount`
  - [ ] Methods
    - [ ] `startConversation()`
    - [ ] `loadMessages()`
    - [ ] `sendMessage()`
    - [ ] `sendTyping()`
    - [ ] `markAsRead()`
    - [ ] `uploadFile()`
  - [ ] WebSocket integration
  - [ ] API integration
- [ ] Wrap app with `ChatProvider`
- [ ] Test context in components

#### Day 25: REST API Service
- [ ] Create `chatAPI.js`
  - [ ] `startConversation()`
  - [ ] `getConversations(page, size, status)`
  - [ ] `getConversation(id)`
  - [ ] `getMessages(conversationId, page, size)`
  - [ ] `sendMessageREST(message)`
  - [ ] `uploadFile(file, conversationId)`
  - [ ] `assignConversation(id)`
  - [ ] `closeConversation(id)`
  - [ ] `getUnreadCount()`
- [ ] Add error handling
- [ ] Add request/response interceptors
- [ ] Test all API calls

---

### Sprint 4: Frontend Features (7-10 days)

#### Day 26-27: Basic Chat Components
- [ ] Create `MessageItem.jsx`
  - [ ] Display text message
  - [ ] Display sender name & avatar
  - [ ] Display timestamp
  - [ ] Display read status
  - [ ] Left/right alignment based on sender
  - [ ] Style with Material-UI
- [ ] Create `MessageList.jsx`
  - [ ] Display array of messages
  - [ ] Auto-scroll to bottom
  - [ ] Load more (pagination)
  - [ ] Loading indicator
  - [ ] Empty state
- [ ] Create `TypingIndicator.jsx`
  - [ ] Show when user typing
  - [ ] Display user name
  - [ ] Animated dots
- [ ] Test components with mock data

#### Day 28-29: Message Input
- [ ] Create `MessageInput.jsx`
  - [ ] Text input field
  - [ ] Send button
  - [ ] Keyboard shortcuts (Enter to send)
  - [ ] Auto-resize textarea
  - [ ] Character limit (optional)
  - [ ] Disable when not connected
- [ ] Integrate typing indicator
  - [ ] Send typing=true on input
  - [ ] Send typing=false after stop typing (debounce)
- [ ] Integrate emoji picker
- [ ] Integrate file upload
- [ ] Test input functionality

#### Day 30: Emoji & File Upload
- [ ] Create `EmojiPicker.jsx`
  - [ ] Use `emoji-picker-react`
  - [ ] Popup/dropdown UI
  - [ ] Insert emoji at cursor position
  - [ ] Close on emoji select
- [ ] Create `FileUpload.jsx`
  - [ ] Use `react-dropzone`
  - [ ] Drag & drop area
  - [ ] File type validation
  - [ ] File size validation
  - [ ] Upload progress indicator
  - [ ] Preview before send
  - [ ] Cancel upload
- [ ] Integrate with message input
- [ ] Test emoji & file upload

#### Day 31-32: Chat Windows
- [ ] Create `ChatWindow.jsx`
  - [ ] Header with close button
  - [ ] Conversation info (with staff name)
  - [ ] MessageList component
  - [ ] MessageInput component
  - [ ] Loading state
  - [ ] Error state
  - [ ] Responsive design
- [ ] Create `ChatWidget.jsx` (Customer)
  - [ ] Floating FAB button
  - [ ] Unread badge
  - [ ] Open/close chat window
  - [ ] Minimize/maximize
  - [ ] Position: bottom-right
- [ ] Add animations
  - [ ] Slide in/out
  - [ ] Fade effects

#### Day 33-34: Admin/Staff Dashboard
- [ ] Create admin chat pages folder
  ```
  admin/pages/chat/
  ├── ChatDashboard.jsx
  ├── ConversationList.jsx
  ├── ConversationItem.jsx
  └── StaffChatWindow.jsx
  ```
- [ ] Create `ChatDashboard.jsx`
  - [ ] Layout with sidebar & main area
  - [ ] Conversation list on left
  - [ ] Chat window on right
  - [ ] Metrics at top (total, active, waiting)
- [ ] Create `ConversationList.jsx`
  - [ ] List all conversations
  - [ ] Filter by status (All, Waiting, Active, Closed)
  - [ ] Search conversations
  - [ ] Sort options
  - [ ] Unread indicator per conversation
  - [ ] Click to open conversation
- [ ] Create `ConversationItem.jsx`
  - [ ] Customer name & avatar
  - [ ] Last message preview
  - [ ] Timestamp
  - [ ] Unread badge
  - [ ] Status indicator
- [ ] Create `StaffChatWindow.jsx`
  - [ ] Similar to ChatWindow but with:
  - [ ] Customer info sidebar
  - [ ] Assign button
  - [ ] Close button
  - [ ] Quick replies
  - [ ] Staff name visible to customer
- [ ] Integrate with ChatContext
- [ ] Test admin dashboard

---

### Sprint 5: Testing & Polish (5-7 days)

#### Day 35-36: Integration Testing
- [ ] Test customer flow
  - [ ] Start conversation
  - [ ] Send text message
  - [ ] Send emoji
  - [ ] Upload file
  - [ ] See staff name
  - [ ] See typing indicator
  - [ ] See read status
  - [ ] Notification works
- [ ] Test staff flow
  - [ ] See waiting conversations
  - [ ] Assign conversation
  - [ ] Send message
  - [ ] See customer info
  - [ ] Use quick replies
  - [ ] Close conversation
  - [ ] Filter/search conversations
- [ ] Test real-time features
  - [ ] Messages appear instantly
  - [ ] Typing indicator works both ways
  - [ ] Read receipts work
  - [ ] Online/offline status
  - [ ] Notification badges update

#### Day 37: Bug Fixes
- [ ] Fix UI bugs
  - [ ] Layout issues
  - [ ] Responsive design issues
  - [ ] Animation glitches
- [ ] Fix functional bugs
  - [ ] Message not sending
  - [ ] WebSocket disconnection
  - [ ] File upload errors
  - [ ] Read status not updating
- [ ] Fix performance issues
  - [ ] Slow loading
  - [ ] Memory leaks
  - [ ] Unnecessary re-renders

#### Day 38: UI/UX Polish
- [ ] Improve styling
  - [ ] Consistent colors
  - [ ] Better spacing
  - [ ] Smooth animations
  - [ ] Loading states
  - [ ] Error states
- [ ] Add user feedback
  - [ ] Toast notifications
  - [ ] Loading spinners
  - [ ] Success messages
  - [ ] Error messages
- [ ] Mobile optimization
  - [ ] Touch-friendly
  - [ ] Proper sizing
  - [ ] Keyboard handling
- [ ] Accessibility
  - [ ] ARIA labels
  - [ ] Keyboard navigation
  - [ ] Screen reader support

#### Day 39: Documentation
- [ ] Code documentation
  - [ ] JSDoc for functions
  - [ ] Inline comments
  - [ ] README for chat module
- [ ] API documentation
  - [ ] Swagger/OpenAPI
  - [ ] Endpoint descriptions
  - [ ] Request/response examples
- [ ] User documentation
  - [ ] Staff guide
  - [ ] Customer guide
  - [ ] Admin guide
- [ ] Developer documentation
  - [ ] Setup instructions
  - [ ] Architecture overview
  - [ ] Testing guide

#### Day 40: Deployment Preparation
- [ ] Update Docker configuration
  - [ ] Add WebSocket support to docker-compose
  - [ ] Configure Nginx for WebSocket proxy
  - [ ] Update CORS settings
- [ ] Update .env variables
  - [ ] WebSocket endpoint
  - [ ] Upload directory
  - [ ] File size limits
- [ ] Database migration
  - [ ] Create production migration script
  - [ ] Test on staging
  - [ ] Backup plan ready
- [ ] Security review
  - [ ] XSS protection
  - [ ] File upload validation
  - [ ] Rate limiting
  - [ ] JWT validation
- [ ] Performance testing
  - [ ] Load testing
  - [ ] Stress testing
  - [ ] Memory usage
- [ ] Create deployment checklist

---

## 🎯 Success Criteria

### Functional Requirements
- [ ] Customer có thể start conversation
- [ ] Customer có thể send text messages
- [ ] Customer có thể send emojis
- [ ] Customer có thể upload files (images, documents)
- [ ] Customer nhìn thấy tên staff đang chat với mình
- [ ] Customer nhìn thấy typing indicator từ staff
- [ ] Customer nhìn thấy read status của messages
- [ ] Customer nhận notification khi có tin nhắn mới
- [ ] Staff nhìn thấy danh sách conversations
- [ ] Staff có thể assign conversation về mình
- [ ] Staff có thể send messages (với tên hiển thị)
- [ ] Staff nhìn thấy customer info
- [ ] Staff nhìn thấy typing indicator từ customer
- [ ] Staff có thể close conversation
- [ ] Staff có thể filter/search conversations
- [ ] Chat history được lưu và load lại được
- [ ] Real-time messaging hoạt động (< 1s latency)

### Non-Functional Requirements
- [ ] System stable (no crashes trong 24h)
- [ ] Performance tốt (load messages < 500ms)
- [ ] Mobile responsive
- [ ] Cross-browser compatible (Chrome, Firefox, Safari)
- [ ] Accessible (WCAG 2.1 Level A)
- [ ] Secure (XSS, CSRF protected)
- [ ] Scalable (support 100 concurrent conversations)

---

## 🛠️ Tools & Environment

### Development Tools
- [ ] IntelliJ IDEA / VS Code
- [ ] Postman / Insomnia
- [ ] MySQL Workbench
- [ ] Browser DevTools
- [ ] React DevTools
- [ ] WebSocket testing tool

### Testing Tools
- [ ] JUnit 5 (backend)
- [ ] Jest (frontend)
- [ ] React Testing Library
- [ ] Mockito (backend mocking)
- [ ] Postman (API testing)

### Monitoring Tools (Production)
- [ ] Spring Boot Actuator
- [ ] Prometheus
- [ ] Grafana
- [ ] ELK Stack (logs)

---

## 📊 Progress Tracking

### Overall Progress
- Sprint 1: ☐☐☐☐☐ 0%
- Sprint 2: ☐☐☐☐☐ 0%
- Sprint 3: ☐☐☐☐☐ 0%
- Sprint 4: ☐☐☐☐☐ 0%
- Sprint 5: ☐☐☐☐☐ 0%

**Total Progress: 0% Complete**

### Team Velocity
- Expected: 2-3 tasks/day
- Actual: TBD

### Blockers
- None yet

### Risks
- WebSocket complexity
- Real-time performance
- File upload size limits
- Mobile browser compatibility

---

## 🆘 Support & Resources

### Documentation
- [Spring WebSocket Guide](https://spring.io/guides/gs/messaging-stomp-websocket/)
- [STOMP.js Documentation](https://stomp-js.github.io/)
- [React WebSocket Guide](https://react.dev/)

### Internal Docs
- [`CHAT_FEATURE_PLAN.md`](CHAT_FEATURE_PLAN.md) - Full detailed plan
- [`CHAT_QUICK_REF.md`](CHAT_QUICK_REF.md) - Quick reference
- [`CHAT_DATABASE_MIGRATION.md`](CHAT_DATABASE_MIGRATION.md) - Database schema

### Team Contacts
- Backend Lead: TBD
- Frontend Lead: TBD
- DevOps: TBD
- Product Owner: TBD

---

## 📝 Notes

### Decisions Made
- Using STOMP over raw WebSocket for simplicity
- Using SockJS for fallback support
- MySQL for persistence (not Redis yet)
- Material-UI for UI components

### Future Enhancements
- [ ] Group chat support
- [ ] Video/Audio call integration
- [ ] Chat bot auto-response
- [ ] Sentiment analysis
- [ ] Chat analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Chat transcripts export

---

**Last Updated:** 2026-03-12  
**Version:** 1.0  
**Status:** Ready to Start
