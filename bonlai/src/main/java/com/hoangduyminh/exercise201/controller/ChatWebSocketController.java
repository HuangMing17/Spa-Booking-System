package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.chat.ChatMessageResponse;
import com.hoangduyminh.exercise201.dto.chat.SendMessageRequest;
import com.hoangduyminh.exercise201.dto.chat.TypingIndicatorMessage;
import com.hoangduyminh.exercise201.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

/**
 * WebSocket message handler for real-time chat functionality
 * 
 * Message destinations:
 * - Client sends to: /app/chat.send, /app/chat.typing
 * - Server broadcasts to: /topic/conversation/{conversationId}, /topic/conversation/{conversationId}/typing
 */
@Controller
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatWebSocketController {

    private final ChatService chatService;

    /**
     * Handle incoming chat messages
     * Client sends to: /app/chat.send
     * Server broadcasts to: /topic/conversation/{conversationId}
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload SendMessageRequest request, SimpMessageHeaderAccessor headerAccessor) {
        try {
            log.info("Received message from {} in conversation {}", 
                    request.getSenderName(), request.getConversationId());
            
            // Process and broadcast the message
            ChatMessageResponse response = chatService.sendMessage(request);
            
            log.info("Successfully processed message {}", response.getId());
        } catch (Exception e) {
            log.error("Error processing message: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle typing indicators
     * Client sends to: /app/chat.typing
     * Server broadcasts to: /topic/conversation/{conversationId}/typing
     */
    @MessageMapping("/chat.typing")
    public void handleTypingIndicator(@Payload TypingIndicatorMessage message) {
        try {
            log.debug("Received typing indicator from {} in conversation {}: {}", 
                    message.getUserName(), message.getConversationId(), message.getIsTyping());
            
            chatService.handleTypingIndicator(message);
        } catch (Exception e) {
            log.error("Error handling typing indicator: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle user joining a conversation
     * Client sends to: /app/chat.join
     */
    @MessageMapping("/chat.join")
    public void handleJoinConversation(@Payload String conversationId, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String sessionId = headerAccessor.getSessionId();
            log.info("User joined conversation {} with session {}", conversationId, sessionId);
            
            // Store session info if needed
            headerAccessor.getSessionAttributes().put("conversationId", conversationId);
        } catch (Exception e) {
            log.error("Error handling join conversation: {}", e.getMessage(), e);
        }
    }

    /**
     * Handle user leaving a conversation
     * Client sends to: /app/chat.leave
     */
    @MessageMapping("/chat.leave")
    public void handleLeaveConversation(@Payload String conversationId, SimpMessageHeaderAccessor headerAccessor) {
        try {
            String sessionId = headerAccessor.getSessionId();
            log.info("User left conversation {} with session {}", conversationId, sessionId);
            
            // Clean up session info
            headerAccessor.getSessionAttributes().remove("conversationId");
        } catch (Exception e) {
            log.error("Error handling leave conversation: {}", e.getMessage(), e);
        }
    }
}
