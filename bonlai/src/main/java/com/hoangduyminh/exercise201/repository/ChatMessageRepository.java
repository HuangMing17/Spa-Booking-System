package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.ChatMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    
    // Find all messages in a conversation (paginated)
    Page<ChatMessage> findByConversationIdAndIsDeletedFalseOrderByCreatedAtAsc(
        UUID conversationId, 
        Pageable pageable
    );
    
    // Find all messages in a conversation (list)
    List<ChatMessage> findByConversationIdAndIsDeletedFalseOrderByCreatedAtAsc(UUID conversationId);
    
    // Find unread messages in a conversation
    List<ChatMessage> findByConversationIdAndIsReadFalseAndIsDeletedFalseOrderByCreatedAtAsc(UUID conversationId);
    
    // Count unread messages in a conversation
    Long countByConversationIdAndIsReadFalseAndIsDeletedFalse(UUID conversationId);
    
    // Find latest message in a conversation
    @Query("SELECT m FROM ChatMessage m WHERE m.conversationId = :conversationId AND m.isDeleted = false ORDER BY m.createdAt DESC LIMIT 1")
    ChatMessage findLatestMessageByConversationId(@Param("conversationId") UUID conversationId);
    
    // Search messages by content
    @Query("SELECT m FROM ChatMessage m WHERE m.conversationId = :conversationId AND m.content LIKE %:keyword% AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<ChatMessage> searchMessagesByContent(
        @Param("conversationId") UUID conversationId, 
        @Param("keyword") String keyword
    );
    
    // Mark message as read
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.id = :messageId")
    void markAsRead(@Param("messageId") UUID messageId);
    
    // Mark all messages in conversation as read
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isRead = true WHERE m.conversationId = :conversationId AND m.isRead = false")
    void markAllAsReadInConversation(@Param("conversationId") UUID conversationId);
    
    // Soft delete message
    @Modifying
    @Query("UPDATE ChatMessage m SET m.isDeleted = true WHERE m.id = :messageId")
    void softDelete(@Param("messageId") UUID messageId);
    
    // Update message content (for edit)
    @Modifying
    @Query("UPDATE ChatMessage m SET m.content = :content, m.editedAt = :editedAt WHERE m.id = :messageId")
    void updateMessageContent(
        @Param("messageId") UUID messageId, 
        @Param("content") String content, 
        @Param("editedAt") LocalDateTime editedAt
    );
    
    // Find messages by type in a conversation
    List<ChatMessage> findByConversationIdAndMessageTypeAndIsDeletedFalseOrderByCreatedAtDesc(
        UUID conversationId, 
        ChatMessage.MessageType messageType
    );
    
    // Count messages by sender in a conversation
    Long countByConversationIdAndSenderIdAndSenderType(
        UUID conversationId, 
        UUID senderId, 
        ChatMessage.SenderType senderType
    );
}
