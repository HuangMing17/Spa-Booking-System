package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.ChatConversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatConversationRepository extends JpaRepository<ChatConversation, UUID> {
    
    // Find all conversations by customer ID
    List<ChatConversation> findByCustomerIdOrderByLastMessageAtDesc(UUID customerId);
    
    // Find all conversations by assigned staff ID
    List<ChatConversation> findByAssignedStaffIdOrderByLastMessageAtDesc(UUID staffId);
    
    // Find all conversations by status
    List<ChatConversation> findByStatusOrderByLastMessageAtDesc(ChatConversation.ConversationStatus status);
    
    // Find active conversation for a customer
    Optional<ChatConversation> findByCustomerIdAndStatus(UUID customerId, ChatConversation.ConversationStatus status);
    
    // Find all conversations by status and assigned staff
    List<ChatConversation> findByStatusAndAssignedStaffIdOrderByLastMessageAtDesc(
        ChatConversation.ConversationStatus status, 
        UUID staffId
    );
    
    // Count active conversations for a staff member
    @Query("SELECT COUNT(c) FROM ChatConversation c WHERE c.assignedStaffId = :staffId AND c.status = 'ACTIVE'")
    Long countActiveConversationsByStaffId(@Param("staffId") UUID staffId);
    
    // Find unassigned active conversations
    @Query("SELECT c FROM ChatConversation c WHERE c.assignedStaffId IS NULL AND c.status = 'ACTIVE' ORDER BY c.createdAt ASC")
    List<ChatConversation> findUnassignedActiveConversations();
    
    // Search conversations by subject or customer name
    @Query("SELECT c FROM ChatConversation c WHERE c.subject LIKE %:keyword% ORDER BY c.lastMessageAt DESC")
    List<ChatConversation> searchBySubject(@Param("keyword") String keyword);
}
