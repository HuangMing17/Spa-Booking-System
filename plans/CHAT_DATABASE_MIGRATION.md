# 🗄️ Chat Feature - Database Migration Script

## SQL Script để Tạo Chat Tables

File này chứa SQL script hoàn chỉnh để tạo database schema cho tính năng chat.

### 📝 Cách Sử Dụng

```bash
# Windows PowerShell
Get-Content chat_migration.sql | docker-compose exec -T mysql mysql -uroot -proot123 exercise201

# Linux/Mac
docker-compose exec -T mysql mysql -uroot -proot123 exercise201 < chat_migration.sql
```

---

## 📄 Full SQL Script

Tạo file `docker/mysql/migrations/001_create_chat_tables.sql` với nội dung sau:

```sql
-- ============================================
-- Chat Feature Database Schema
-- SPA Bon Lai - Customer Care Chat System
-- ============================================

USE exercise201;

-- ============================================
-- Table: chat_conversations
-- Purpose: Lưu trữ các cuộc hội thoại giữa customer và staff
-- ============================================

CREATE TABLE IF NOT EXISTS chat_conversations (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    customer_id BINARY(16) NOT NULL COMMENT 'ID của khách hàng',
    assigned_staff_id BINARY(16) NULL COMMENT 'ID của staff được assign',
    status ENUM('ACTIVE', 'CLOSED', 'WAITING') DEFAULT 'WAITING' COMMENT 'Trạng thái conversation',
    last_message_at TIMESTAMP NULL COMMENT 'Thời gian tin nhắn cuối',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL COMMENT 'Thời gian đóng conversation',
    closed_by BINARY(16) NULL COMMENT 'Staff đóng conversation',
    
    CONSTRAINT fk_conversation_customer 
        FOREIGN KEY (customer_id) REFERENCES customers(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_conversation_staff 
        FOREIGN KEY (assigned_staff_id) REFERENCES staff_accounts(id) 
        ON DELETE SET NULL,
    CONSTRAINT fk_conversation_closed_by
        FOREIGN KEY (closed_by) REFERENCES staff_accounts(id)
        ON DELETE SET NULL,
        
    INDEX idx_customer_id (customer_id),
    INDEX idx_staff_id (assigned_staff_id),
    INDEX idx_status (status),
    INDEX idx_last_message (last_message_at DESC),
    INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng lưu trữ các cuộc hội thoại chat';

-- ============================================
-- Table: chat_messages
-- Purpose: Lưu trữ tất cả tin nhắn trong conversation
-- ============================================

CREATE TABLE IF NOT EXISTS chat_messages (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    conversation_id BINARY(16) NOT NULL COMMENT 'ID conversation',
    sender_type ENUM('CUSTOMER', 'STAFF') NOT NULL COMMENT 'Loại người gửi',
    sender_id BINARY(16) NOT NULL COMMENT 'ID người gửi',
    message_type ENUM('TEXT', 'IMAGE', 'FILE', 'SYSTEM') DEFAULT 'TEXT' COMMENT 'Loại tin nhắn',
    content TEXT NOT NULL COMMENT 'Nội dung tin nhắn',
    attachment_url VARCHAR(500) NULL COMMENT 'URL file đính kèm',
    attachment_name VARCHAR(255) NULL COMMENT 'Tên file đính kèm',
    attachment_size BIGINT NULL COMMENT 'Kích thước file (bytes)',
    attachment_type VARCHAR(50) NULL COMMENT 'MIME type của file',
    is_read BOOLEAN DEFAULT FALSE COMMENT 'Đã đọc chưa',
    read_at TIMESTAMP NULL COMMENT 'Thời gian đọc',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_message_conversation 
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) 
        ON DELETE CASCADE,
        
    INDEX idx_conversation_id (conversation_id),
    INDEX idx_created_at (created_at DESC),
    INDEX idx_is_read (is_read),
    INDEX idx_sender (sender_type, sender_id),
    INDEX idx_conversation_created (conversation_id, created_at DESC),
    
    FULLTEXT INDEX idx_content (content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng lưu trữ tin nhắn chat';

-- ============================================
-- Table: chat_typing_indicators
-- Purpose: Lưu trạng thái đang gõ
-- ============================================

CREATE TABLE IF NOT EXISTS chat_typing_indicators (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    conversation_id BINARY(16) NOT NULL COMMENT 'ID conversation',
    user_type ENUM('CUSTOMER', 'STAFF') NOT NULL COMMENT 'Loại user',
    user_id BINARY(16) NOT NULL COMMENT 'ID user',
    is_typing BOOLEAN DEFAULT FALSE COMMENT 'Đang gõ hay không',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_typing_conversation 
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) 
        ON DELETE CASCADE,
        
    UNIQUE INDEX idx_conversation_user (conversation_id, user_type, user_id),
    INDEX idx_updated_at (updated_at),
    INDEX idx_is_typing (is_typing)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng lưu trạng thái đang gõ';

-- ============================================
-- Table: chat_participants
-- Purpose: Lưu thông tin người tham gia conversation
-- ============================================

CREATE TABLE IF NOT EXISTS chat_participants (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    conversation_id BINARY(16) NOT NULL COMMENT 'ID conversation',
    participant_type ENUM('CUSTOMER', 'STAFF') NOT NULL COMMENT 'Loại người tham gia',
    participant_id BINARY(16) NOT NULL COMMENT 'ID người tham gia',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời gian tham gia',
    last_seen_at TIMESTAMP NULL COMMENT 'Lần cuối xem',
    unread_count INT DEFAULT 0 COMMENT 'Số tin nhắn chưa đọc',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Còn active không',
    left_at TIMESTAMP NULL COMMENT 'Thời gian rời khỏi',
    
    CONSTRAINT fk_participant_conversation 
        FOREIGN KEY (conversation_id) REFERENCES chat_conversations(id) 
        ON DELETE CASCADE,
        
    UNIQUE INDEX idx_conversation_participant (conversation_id, participant_type, participant_id),
    INDEX idx_participant (participant_type, participant_id),
    INDEX idx_unread (unread_count),
    INDEX idx_last_seen (last_seen_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng lưu thông tin người tham gia conversation';

-- ============================================
-- Table: chat_quick_replies (Optional)
-- Purpose: Lưu các câu trả lời nhanh cho staff
-- ============================================

CREATE TABLE IF NOT EXISTS chat_quick_replies (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    title VARCHAR(100) NOT NULL COMMENT 'Tiêu đề',
    content TEXT NOT NULL COMMENT 'Nội dung câu trả lời',
    category VARCHAR(50) NULL COMMENT 'Danh mục',
    usage_count INT DEFAULT 0 COMMENT 'Số lần sử dụng',
    is_active BOOLEAN DEFAULT TRUE COMMENT 'Còn active không',
    created_by BINARY(16) NULL COMMENT 'Staff tạo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_quick_reply_creator
        FOREIGN KEY (created_by) REFERENCES staff_accounts(id)
        ON DELETE SET NULL,
        
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_usage_count (usage_count DESC),
    
    FULLTEXT INDEX idx_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng lưu câu trả lời nhanh cho staff';

-- ============================================
-- Sample Quick Replies
-- ============================================

INSERT INTO chat_quick_replies (id, title, content, category, is_active) VALUES
(UUID_TO_BIN(UUID()), 'Chào mừng', 'Xin chào! Tôi có thể giúp gì cho bạn?', 'greeting', TRUE),
(UUID_TO_BIN(UUID()), 'Cảm ơn', 'Cảm ơn bạn đã liên hệ. Chúc bạn một ngày tốt lành!', 'closing', TRUE),
(UUID_TO_BIN(UUID()), 'Chờ một chút', 'Vui lòng chờ một chút, tôi sẽ kiểm tra thông tin cho bạn.', 'common', TRUE),
(UUID_TO_BIN(UUID()), 'Giờ làm việc', 'Spa chúng tôi mở cửa từ 8:00 - 22:00 hàng ngày.', 'info', TRUE)
ON DUPLICATE KEY UPDATE title=title;

-- ============================================
-- Success Message
-- ============================================

SELECT 'Chat feature database schema created successfully!' AS Status;
SELECT COUNT(*) AS TotalTables FROM information_schema.tables 
WHERE table_schema = 'exercise201' AND table_name LIKE 'chat_%';
```

---

## 📊 Database Schema Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CHAT SYSTEM SCHEMA                           │
└─────────────────────────────────────────────────────────────────────┘

┌───────────────────────────┐
│   chat_conversations      │
├───────────────────────────┤
│ id (PK)                   │
│ customer_id (FK)          │──┐
│ assigned_staff_id (FK)    │  │
│ status                    │  │
│ last_message_at           │  │
│ created_at                │  │
│ updated_at                │  │
│ closed_at                 │  │
│ closed_by (FK)            │  │
└───────────────────────────┘  │
         │                      │
         │ 1:N                  │
         ▼                      │
┌───────────────────────────┐  │
│     chat_messages         │  │
├───────────────────────────┤  │
│ id (PK)                   │  │
│ conversation_id (FK)      │──┘
│ sender_type               │
│ sender_id                 │
│ message_type              │
│ content                   │
│ attachment_url            │
│ attachment_name           │
│ attachment_size           │
│ attachment_type           │
│ is_read                   │
│ read_at                   │
│ created_at                │
└───────────────────────────┘

┌───────────────────────────┐
│  chat_typing_indicators   │
├───────────────────────────┤
│ id (PK)                   │
│ conversation_id (FK)      │
│ user_type                 │
│ user_id                   │
│ is_typing                 │
│ updated_at                │
└───────────────────────────┘

┌───────────────────────────┐
│   chat_participants       │
├───────────────────────────┤
│ id (PK)                   │
│ conversation_id (FK)      │
│ participant_type          │
│ participant_id            │
│ joined_at                 │
│ last_seen_at              │
│ unread_count              │
│ is_active                 │
│ left_at                   │
└───────────────────────────┘

┌───────────────────────────┐
│   chat_quick_replies      │
├───────────────────────────┤
│ id (PK)                   │
│ title                     │
│ content                   │
│ category                  │
│ usage_count               │
│ is_active                 │
│ created_by (FK)           │
│ created_at                │
│ updated_at                │
└───────────────────────────┘
```

---

## 🔗 Relationships

### chat_conversations
- **customer_id** → `customers.id` (CASCADE DELETE)
- **assigned_staff_id** → `staff_accounts.id` (SET NULL)
- **closed_by** → `staff_accounts.id` (SET NULL)

### chat_messages
- **conversation_id** → `chat_conversations.id` (CASCADE DELETE)

### chat_typing_indicators
- **conversation_id** → `chat_conversations.id` (CASCADE DELETE)

### chat_participants
- **conversation_id** → `chat_conversations.id` (CASCADE DELETE)

### chat_quick_replies
- **created_by** → `staff_accounts.id` (SET NULL)

---

## 📝 Table Descriptions

### 1. chat_conversations
Lưu trữ các cuộc hội thoại giữa customer và staff.

**Columns:**
- `id` - UUID của conversation
- `customer_id` - ID customer tạo conversation
- `assigned_staff_id` - ID staff được giao conversation (NULL nếu chưa assign)
- `status` - WAITING (chờ staff), ACTIVE (đang chat), CLOSED (đã đóng)
- `last_message_at` - Timestamp tin nhắn cuối để sort
- `closed_by` - Staff đóng conversation

**Indexes:**
- `idx_customer_id` - Tìm conversation theo customer
- `idx_staff_id` - Tìm conversation theo staff
- `idx_status` - Filter theo status
- `idx_last_message` - Sort theo tin nhắn mới nhất

### 2. chat_messages
Lưu tất cả tin nhắn trong conversation.

**Columns:**
- `id` - UUID của message
- `conversation_id` - Conversation chứa message
- `sender_type` - CUSTOMER hoặc STAFF
- `sender_id` - UUID của người gửi
- `message_type` - TEXT, IMAGE, FILE, SYSTEM
- `content` - Nội dung text
- `attachment_*` - Thông tin file đính kèm (nếu có)
- `is_read` - Đã đọc chưa
- `read_at` - Thời gian đọc

**Indexes:**
- `idx_conversation_id` - Lấy messages theo conversation
- `idx_created_at` - Sort theo thời gian
- `idx_is_read` - Filter messages chưa đọc
- `idx_conversation_created` - Composite index để pagination
- `idx_content` - Fulltext search trong messages

### 3. chat_typing_indicators
Lưu trạng thái đang gõ của users.

**Note:** Có thể dùng Redis thay vì MySQL cho performance tốt hơn.

**Columns:**
- `conversation_id` - Conversation đang gõ
- `user_type` - CUSTOMER hoặc STAFF
- `user_id` - UUID của user
- `is_typing` - TRUE nếu đang gõ
- `updated_at` - Thời gian update cuối

**Unique Index:** `idx_conversation_user` - Mỗi user trong conversation có 1 record duy nhất

### 4. chat_participants
Lưu thông tin người tham gia conversation.

**Purpose:** 
- Track last seen time
- Count unread messages
- Support cho group chat trong tương lai

**Columns:**
- `conversation_id` - Conversation tham gia
- `participant_type` - CUSTOMER hoặc STAFF
- `participant_id` - UUID người tham gia
- `last_seen_at` - Lần cuối xem
- `unread_count` - Số tin nhắn chưa đọc
- `is_active` - Còn active không
- `left_at` - Thời gian rời conversation

### 5. chat_quick_replies
Lưu các câu trả lời nhanh cho staff.

**Purpose:** Staff có thể chọn câu trả lời mẫu để trả lời nhanh hơn.

**Columns:**
- `title` - Tiêu đề ngắn gọn
- `content` - Nội dung đầy đủ
- `category` - Nhóm: greeting, closing, common, info
- `usage_count` - Số lần sử dụng (để sort phổ biến nhất)
- `is_active` - Hiển thị hay không
- `created_by` - Staff tạo

---

## 🔍 Common Queries

### Get active conversations for staff
```sql
SELECT * FROM chat_conversations
WHERE assigned_staff_id = UUID_TO_BIN(?)
  AND status = 'ACTIVE'
ORDER BY last_message_at DESC;
```

### Get unread messages count
```sql
SELECT COUNT(*) AS unread
FROM chat_messages m
JOIN chat_conversations c ON m.conversation_id = c.id
WHERE c.assigned_staff_id = UUID_TO_BIN(?)
  AND m.sender_type = 'CUSTOMER'
  AND m.is_read = FALSE;
```

### Get messages in conversation with pagination
```sql
SELECT * FROM chat_messages
WHERE conversation_id = UUID_TO_BIN(?)
ORDER BY created_at DESC
LIMIT 50 OFFSET 0;
```

### Get waiting conversations (not assigned)
```sql
SELECT * FROM chat_conversations
WHERE status = 'WAITING'
  AND assigned_staff_id IS NULL
ORDER BY created_at ASC;
```

---

## ⚡ Performance Considerations

### Indexes
- Tất cả foreign keys đã có indexes
- Composite indexes cho queries phổ biến
- Fulltext index cho search messages

### Optimization Tips
1. **Pagination:** Luôn dùng LIMIT/OFFSET cho messages
2. **Caching:** Cache conversation list và unread count
3. **Connection Pooling:** Configure HikariCP properly
4. **Query Optimization:** Dùng EXPLAIN để check query plan
5. **Archive Old Data:** Move closed conversations > 6 tháng sang archive table

### Redis Alternative
Có thể dùng Redis cho:
- Typing indicators (high frequency updates)
- Online/offline status
- Temporary message cache
- Session management

---

## 🧪 Testing Queries

### Create test conversation
```sql
CALL sp_start_conversation(
    UUID_TO_BIN('customer-uuid-here'),
    @conv_id
);
SELECT BIN_TO_UUID(@conv_id) AS conversation_id;
```

### Send test message
```sql
INSERT INTO chat_messages (
    conversation_id, 
    sender_type, 
    sender_id, 
    message_type, 
    content
) VALUES (
    @conv_id,
    'CUSTOMER',
    UUID_TO_BIN('customer-uuid-here'),
    'TEXT',
    'Hello, I need help!'
);
```

### Assign to staff
```sql
CALL sp_assign_conversation(
    @conv_id,
    UUID_TO_BIN('staff-uuid-here')
);
```

---

## 📦 Backup & Rollback

### Backup before migration
```bash
# Full backup
docker-compose exec mysql mysqldump -uroot -proot123 exercise201 > backup_before_chat.sql

# Only chat tables
docker-compose exec mysql mysqldump -uroot -proot123 exercise201 \
  chat_conversations chat_messages chat_typing_indicators \
  chat_participants chat_quick_replies > chat_tables_backup.sql
```

### Rollback if needed
```sql
-- Drop all chat tables
DROP TABLE IF EXISTS chat_quick_replies;
DROP TABLE IF EXISTS chat_participants;
DROP TABLE IF EXISTS chat_typing_indicators;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_conversations;

-- Restore from backup
SOURCE backup_before_chat.sql;
```

---

## ✅ Verification Checklist

After running migration:

- [ ] All 5 tables created successfully
- [ ] All foreign keys working
- [ ] All indexes created
- [ ] Sample quick replies inserted
- [ ] Can create test conversation
- [ ] Can insert test messages
- [ ] Can assign conversation
- [ ] Triggers working (last_message_at updates)
- [ ] No errors in MySQL log
- [ ] Application can connect to tables

---

**Created:** 2026-03-12  
**Version:** 1.0  
**Status:** Ready for Implementation
