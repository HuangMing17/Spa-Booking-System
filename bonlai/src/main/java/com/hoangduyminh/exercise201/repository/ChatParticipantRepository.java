package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.ChatParticipant;
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
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, UUID> {
    
    // Find all participants in a conversation
    List<ChatParticipant> findByConversationId(UUID conversationId);
    
    // Find specific participant in a conversation
    Optional<ChatParticipant> findByConversationIdAndParticipantIdAndParticipantType(
        UUID conversationId, 
        UUID participantId, 
        ChatParticipant.ParticipantType participantType
    );
    
    // Find all conversations for a participant
    List<ChatParticipant> findByParticipantIdAndParticipantTypeOrderByUpdatedAtDesc(
        UUID participantId, 
        ChatParticipant.ParticipantType participantType
    );
    
    // Count unread messages for a participant
    @Query("SELECT SUM(p.unreadCount) FROM ChatParticipant p WHERE p.participantId = :participantId AND p.participantType = :participantType")
    Long countTotalUnreadByParticipant(
        @Param("participantId") UUID participantId, 
        @Param("participantType") ChatParticipant.ParticipantType participantType
    );
    
    // Update last seen timestamp
    @Modifying
    @Query("UPDATE ChatParticipant p SET p.lastSeenAt = :lastSeenAt WHERE p.conversationId = :conversationId AND p.participantId = :participantId AND p.participantType = :participantType")
    void updateLastSeen(
        @Param("conversationId") UUID conversationId,
        @Param("participantId") UUID participantId,
        @Param("participantType") ChatParticipant.ParticipantType participantType,
        @Param("lastSeenAt") LocalDateTime lastSeenAt
    );
    
    // Reset unread count
    @Modifying
    @Query("UPDATE ChatParticipant p SET p.unreadCount = 0 WHERE p.conversationId = :conversationId AND p.participantId = :participantId AND p.participantType = :participantType")
    void resetUnreadCount(
        @Param("conversationId") UUID conversationId,
        @Param("participantId") UUID participantId,
        @Param("participantType") ChatParticipant.ParticipantType participantType
    );
    
    // Increment unread count for all participants except sender
    @Modifying
    @Query("UPDATE ChatParticipant p SET p.unreadCount = p.unreadCount + 1 WHERE p.conversationId = :conversationId AND NOT (p.participantId = :senderId AND p.participantType = :senderType)")
    void incrementUnreadCountExceptSender(
        @Param("conversationId") UUID conversationId,
        @Param("senderId") UUID senderId,
        @Param("senderType") ChatParticipant.ParticipantType senderType
    );
}
