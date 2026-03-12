package com.hoangduyminh.exercise201.dto.chat;

import com.hoangduyminh.exercise201.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    
    @NotNull(message = "Conversation ID is required")
    private UUID conversationId;
    
    @NotNull(message = "Sender ID is required")
    private UUID senderId;
    
    @NotNull(message = "Sender type is required")
    private ChatMessage.SenderType senderType;
    
    @NotBlank(message = "Sender name is required")
    private String senderName;
    
    @NotNull(message = "Message type is required")
    private ChatMessage.MessageType messageType;
    
    private String content;
    
    private String attachmentUrl;
    
    private String attachmentType;
}
