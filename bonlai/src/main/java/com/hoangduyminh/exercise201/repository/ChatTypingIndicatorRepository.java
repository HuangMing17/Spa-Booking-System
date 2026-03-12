package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.ChatTypingIndicator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatTypingIndicatorRepository extends JpaRepository<ChatTypingIndicator, UUID> {
    
    // Find typing indicator for a specific user in a conversation
    Optional<ChatTypingIndicator> findByConversationIdAndUserIdAndUserType(
        UUID conversationId, 
        UUID userId, 
        ChatTypingIndicator.UserType userType
    );
    
    // Find all users currently typing in a conversation
    List<ChatTypingIndicator> findByConversationIdAndIsTypingTrue(UUID conversationId);
    
    // Update or create typing indicator
    @Modifying
    @Query("UPDATE ChatTypingIndicator t SET t.isTyping = :isTyping, t.updatedAt = :updatedAt WHERE t.conversationId = :conversationId AND t.userId = :userId AND t.userType = :userType")
    void updateTypingStatus(
        @Param("conversationId") UUID conversationId,
        @Param("userId") UUID userId,
        @Param("userType") ChatTypingIndicator.UserType userType,
        @Param("isTyping") Boolean isTyping,
        @Param("updatedAt") LocalDateTime updatedAt
    );
    
    // Clear old typing indicators (for cleanup - older than 10 seconds)
    @Modifying
    @Query("UPDATE ChatTypingIndicator t SET t.isTyping = false WHERE t.isTyping = true AND t.updatedAt < :threshold")
    void clearStaleTypingIndicators(@Param("threshold") LocalDateTime threshold);
    
    // Delete typing indicator
    void deleteByConversationIdAndUserIdAndUserType(
        UUID conversationId, 
        UUID userId, 
        ChatTypingIndicator.UserType userType
    );
}
