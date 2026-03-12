-- ============================================
-- Chat Feature Database Schema
-- SPA Bon Lai - Customer Care Chat System
-- Created: 2026-03-12
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
    INDEX idx_created_at (created_at DESC),
    INDEX idx_conv_status_updated (status, updated_at DESC),
    INDEX idx_conv_staff_status (assigned_staff_id, status)
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
    INDEX idx_msg_conv_unread (conversation_id, is_read, created_at DESC),
    
    FULLTEXT INDEX idx_content (content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Bảng lưu trữ tin nhắn chat';

-- ============================================
-- Table: chat_typing_indicators
-- Purpose: Lưu trạng thái đang gõ
-- Note: Có thể dùng Redis thay cho production
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
-- Note: Optional, dùng cho group chat sau này
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
-- Table: chat_quick_replies
-- Purpose: Lưu các câu trả lời nhanh cho staff
-- ============================================

CREATE TABLE IF NOT EXISTS chat_quick_replies (
    id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    title VARCHAR(100) NOT NULL COMMENT 'Tiêu đề',
    content TEXT NOT NULL COMMENT 'Nội dung câu trả lời',
    category VARCHAR(50) NULL COMMENT 'Danh mục (greeting, closing, etc)',
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
-- Triggers
-- ============================================

DELIMITER //

-- Trigger: Update last_message_at when new message inserted
CREATE TRIGGER trg_update_last_message_at
AFTER INSERT ON chat_messages
FOR EACH ROW
BEGIN
    UPDATE chat_conversations
    SET last_message_at = NEW.created_at,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.conversation_id;
END //

-- Trigger: Update unread count for participants
CREATE TRIGGER trg_update_unread_count
AFTER INSERT ON chat_messages
FOR EACH ROW
BEGIN
    -- Update unread count for receiver
    IF NEW.sender_type = 'CUSTOMER' THEN
        UPDATE chat_participants
        SET unread_count = unread_count + 1
        WHERE conversation_id = NEW.conversation_id
          AND participant_type = 'STAFF'
          AND is_active = TRUE;
    ELSE
        UPDATE chat_participants
        SET unread_count = unread_count + 1
        WHERE conversation_id = NEW.conversation_id
          AND participant_type = 'CUSTOMER'
          AND is_active = TRUE;
    END IF;
END //

DELIMITER ;

-- ============================================
-- Sample Quick Replies
-- ============================================

INSERT INTO chat_quick_replies (id, title, content, category, is_active) VALUES
(UUID_TO_BIN(UUID()), 'Chào mừng', 'Xin chào! Tôi có thể giúp gì cho bạn?', 'greeting', TRUE),
(UUID_TO_BIN(UUID()), 'Cảm ơn', 'Cảm ơn bạn đã liên hệ. Chúc bạn một ngày tốt lành!', 'closing', TRUE),
(UUID_TO_BIN(UUID()), 'Chờ một chút', 'Vui lòng chờ một chút, tôi sẽ kiểm tra thông tin cho bạn.', 'common', TRUE),
(UUID_TO_BIN(UUID()), 'Giờ làm việc', 'Spa chúng tôi mở cửa từ 8:00 - 22:00 hàng ngày.', 'info', TRUE),
(UUID_TO_BIN(UUID()), 'Liên hệ', 'Bạn có thể liên hệ qua số hotline: 1900-xxxx hoặc email: support@spa-bonlai.com', 'info', TRUE)
ON DUPLICATE KEY UPDATE title=title;

-- ============================================
-- Verification Queries
-- ============================================

-- Check tables created
SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'exercise201'
  AND TABLE_NAME LIKE 'chat_%'
ORDER BY TABLE_NAME;

-- Check foreign keys
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'exercise201'
  AND TABLE_NAME LIKE 'chat_%'
  AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Check indexes
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    SEQ_IN_INDEX,
    COLUMN_NAME
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = 'exercise201'
  AND TABLE_NAME LIKE 'chat_%'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- Check quick replies
SELECT 
    BIN_TO_UUID(id) AS id,
    title,
    category,
    is_active
FROM chat_quick_replies
WHERE is_active = TRUE;

-- Success message
SELECT 'Chat feature database schema created successfully!' AS Status,
       (SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_SCHEMA = 'exercise201' AND TABLE_NAME LIKE 'chat_%') AS TablesCreated;
