package com.hoangduyminh.exercise201.dto.chat;

import com.hoangduyminh.exercise201.entity.ChatTypingIndicator;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TypingIndicatorMessage {
    
    private UUID conversationId;
    private UUID userId;
    private ChatTypingIndicator.UserType userType;
    private String userName;
    private Boolean isTyping;
    
    public static TypingIndicatorMessage fromEntity(ChatTypingIndicator indicator) {
        return TypingIndicatorMessage.builder()
                .conversationId(indicator.getConversationId())
                .userId(indicator.getUserId())
                .userType(indicator.getUserType())
                .userName(indicator.getUserName())
                .isTyping(indicator.getIsTyping())
                .build();
    }
}
