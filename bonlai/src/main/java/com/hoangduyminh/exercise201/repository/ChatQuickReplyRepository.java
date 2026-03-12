package com.hoangduyminh.exercise201.repository;

import com.hoangduyminh.exercise201.entity.ChatQuickReply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatQuickReplyRepository extends JpaRepository<ChatQuickReply, UUID> {
    
    // Find all active quick replies
    List<ChatQuickReply> findByIsActiveTrueOrderByUsageCountDesc();
    
    // Find quick replies by category
    List<ChatQuickReply> findByCategoryAndIsActiveTrueOrderByUsageCountDesc(String category);
    
    // Find quick replies created by a staff member
    List<ChatQuickReply> findByCreatedByOrderByCreatedAtDesc(UUID createdBy);
    
    // Search quick replies by title or content
    @Query("SELECT q FROM ChatQuickReply q WHERE q.isActive = true AND (q.title LIKE %:keyword% OR q.content LIKE %:keyword%) ORDER BY q.usageCount DESC")
    List<ChatQuickReply> searchQuickReplies(@Param("keyword") String keyword);
    
    // Increment usage count
    @Modifying
    @Query("UPDATE ChatQuickReply q SET q.usageCount = q.usageCount + 1 WHERE q.id = :id")
    void incrementUsageCount(@Param("id") UUID id);
    
    // Get most used quick replies
    List<ChatQuickReply> findTop10ByIsActiveTrueOrderByUsageCountDesc();
    
    // Get all categories
    @Query("SELECT DISTINCT q.category FROM ChatQuickReply q WHERE q.isActive = true ORDER BY q.category")
    List<String> findAllCategories();
}
