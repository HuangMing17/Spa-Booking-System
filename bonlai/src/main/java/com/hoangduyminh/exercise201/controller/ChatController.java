package com.hoangduyminh.exercise201.controller;

import com.hoangduyminh.exercise201.dto.chat.ChatConversationResponse;
import com.hoangduyminh.exercise201.dto.chat.ChatMessageResponse;
import com.hoangduyminh.exercise201.dto.chat.CreateConversationRequest;
import com.hoangduyminh.exercise201.entity.ChatParticipant;
import com.hoangduyminh.exercise201.entity.ChatQuickReply;
import com.hoangduyminh.exercise201.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;

    /**
     * Create a new conversation
     * POST /api/chat/conversations
     */
    @PostMapping("/conversations")
    public ResponseEntity<ChatConversationResponse> createConversation(
            @Valid @RequestBody CreateConversationRequest request) {
        log.info("Creating conversation for customer: {}", request.getCustomerId());
        ChatConversationResponse response = chatService.createConversation(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all conversations for a customer
     * GET /api/chat/conversations/customer/{customerId}
     */
    @GetMapping("/conversations/customer/{customerId}")
    public ResponseEntity<List<ChatConversationResponse>> getCustomerConversations(
            @PathVariable UUID customerId) {
        log.info("Fetching conversations for customer: {}", customerId);
        List<ChatConversationResponse> conversations = chatService.getCustomerConversations(customerId);
        return ResponseEntity.ok(conversations);
    }

    /**
     * Get all conversations for a staff member
     * GET /api/chat/conversations/staff/{staffId}
     */
    @GetMapping("/conversations/staff/{staffId}")
    public ResponseEntity<List<ChatConversationResponse>> getStaffConversations(
            @PathVariable UUID staffId) {
        log.info("Fetching conversations for staff: {}", staffId);
        List<ChatConversationResponse> conversations = chatService.getStaffConversations(staffId);
        return ResponseEntity.ok(conversations);
    }

    /**
     * Get unassigned active conversations
     * GET /api/chat/conversations/unassigned
     */
    @GetMapping("/conversations/unassigned")
    public ResponseEntity<List<ChatConversationResponse>> getUnassignedConversations() {
        log.info("Fetching unassigned conversations");
        List<ChatConversationResponse> conversations = chatService.getUnassignedConversations();
        return ResponseEntity.ok(conversations);
    }

    /**
     * Assign conversation to staff
     * PUT /api/chat/conversations/{conversationId}/assign/{staffId}
     */
    @PutMapping("/conversations/{conversationId}/assign/{staffId}")
    public ResponseEntity<ChatConversationResponse> assignConversation(
            @PathVariable UUID conversationId,
            @PathVariable UUID staffId) {
        log.info("Assigning conversation {} to staff {}", conversationId, staffId);
        ChatConversationResponse response = chatService.assignConversation(conversationId, staffId);
        return ResponseEntity.ok(response);
    }

    /**
     * Close a conversation
     * PUT /api/chat/conversations/{conversationId}/close
     */
    @PutMapping("/conversations/{conversationId}/close")
    public ResponseEntity<ChatConversationResponse> closeConversation(
            @PathVariable UUID conversationId,
            @RequestParam UUID closedBy) {
        log.info("Closing conversation {} by user {}", conversationId, closedBy);
        ChatConversationResponse response = chatService.closeConversation(conversationId, closedBy);
        return ResponseEntity.ok(response);
    }

    /**
     * Get messages in a conversation (paginated)
     * GET /api/chat/conversations/{conversationId}/messages
     */
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<Page<ChatMessageResponse>> getMessages(
            @PathVariable UUID conversationId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        log.info("Fetching messages for conversation: {} (page: {}, size: {})", conversationId, page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<ChatMessageResponse> messages = chatService.getMessages(conversationId, pageable);
        return ResponseEntity.ok(messages);
    }

    /**
     * Get all messages in a conversation
     * GET /api/chat/conversations/{conversationId}/messages/all
     */
    @GetMapping("/conversations/{conversationId}/messages/all")
    public ResponseEntity<List<ChatMessageResponse>> getAllMessages(
            @PathVariable UUID conversationId) {
        log.info("Fetching all messages for conversation: {}", conversationId);
        List<ChatMessageResponse> messages = chatService.getAllMessages(conversationId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Mark message as read
     * PUT /api/chat/messages/{messageId}/read
     */
    @PutMapping("/messages/{messageId}/read")
    public ResponseEntity<Void> markMessageAsRead(@PathVariable UUID messageId) {
        log.info("Marking message {} as read", messageId);
        chatService.markMessageAsRead(messageId);
        return ResponseEntity.ok().build();
    }

    /**
     * Mark all messages in conversation as read
     * PUT /api/chat/conversations/{conversationId}/read-all
     */
    @PutMapping("/conversations/{conversationId}/read-all")
    public ResponseEntity<Void> markAllMessagesAsRead(
            @PathVariable UUID conversationId,
            @RequestParam UUID userId,
            @RequestParam ChatParticipant.ParticipantType userType) {
        log.info("Marking all messages as read in conversation {} for user {}", conversationId, userId);
        chatService.markAllMessagesAsRead(conversationId, userId, userType);
        return ResponseEntity.ok().build();
    }

    /**
     * Get quick replies
     * GET /api/chat/quick-replies
     */
    @GetMapping("/quick-replies")
    public ResponseEntity<List<ChatQuickReply>> getQuickReplies(
            @RequestParam(required = false) String category) {
        log.info("Fetching quick replies for category: {}", category);
        List<ChatQuickReply> quickReplies = chatService.getQuickReplies(category);
        return ResponseEntity.ok(quickReplies);
    }

    /**
     * Use quick reply (increment usage count)
     * POST /api/chat/quick-replies/{quickReplyId}/use
     */
    @PostMapping("/quick-replies/{quickReplyId}/use")
    public ResponseEntity<Void> useQuickReply(@PathVariable UUID quickReplyId) {
        log.info("Using quick reply: {}", quickReplyId);
        chatService.useQuickReply(quickReplyId);
        return ResponseEntity.ok().build();
    }
}
