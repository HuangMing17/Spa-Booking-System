package com.hoangduyminh.exercise201.dto.chat;

import com.hoangduyminh.exercise201.entity.ChatMessage;
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
public class ChatMessageResponse {
    
    private UUID id;
    private UUID conversationId;
    private UUID senderId;
    private ChatMessage.SenderType senderType;
    private String senderName;
    private ChatMessage.MessageType messageType;
    private String content;
    private String attachmentUrl;
    private String attachmentType;
    private Boolean isRead;
    private Boolean isDeleted;
    private LocalDateTime editedAt;
    private LocalDateTime createdAt;
    
    public static ChatMessageResponse fromEntity(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversationId())
                .senderId(message.getSenderId())
                .senderType(message.getSenderType())
                .senderName(message.getSenderName())
                .messageType(message.getMessageType())
                .content(message.getContent())
                .attachmentUrl(message.getAttachmentUrl())
                .attachmentType(message.getAttachmentType())
                .isRead(message.getIsRead())
                .isDeleted(message.getIsDeleted())
                .editedAt(message.getEditedAt())
                .createdAt(message.getCreatedAt())
                .build();
    }
}
