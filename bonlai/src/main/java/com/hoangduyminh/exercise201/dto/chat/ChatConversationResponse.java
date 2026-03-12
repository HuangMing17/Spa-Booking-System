package com.hoangduyminh.exercise201.dto.chat;

import com.hoangduyminh.exercise201.entity.ChatConversation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatConversationResponse {
    
    private UUID id;
    private ChatConversation.RoomType roomType;
    private UUID customerId;
    private String customerName;
    private UUID assignedStaffId;
    private String assignedStaffName;
    private ChatConversation.ConversationStatus status;
    private String subject;
    private LocalDateTime lastMessageAt;
    private String lastMessageContent;
    private Integer unreadCount;
    private UUID closedBy;
    private LocalDateTime closedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static ChatConversationResponse fromEntity(ChatConversation conversation) {
        return ChatConversationResponse.builder()
                .id(conversation.getId())
                .roomType(conversation.getRoomType())
                .customerId(conversation.getCustomerId())
                .assignedStaffId(conversation.getAssignedStaffId())
                .status(conversation.getStatus())
                .subject(conversation.getSubject())
                .lastMessageAt(conversation.getLastMessageAt())
                .closedBy(conversation.getClosedBy())
                .closedAt(conversation.getClosedAt())
                .createdAt(conversation.getCreatedAt())
                .updatedAt(conversation.getUpdatedAt())
                .build();
    }
}
