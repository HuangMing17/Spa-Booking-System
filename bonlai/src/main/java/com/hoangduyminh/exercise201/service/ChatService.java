package com.hoangduyminh.exercise201.service;

import com.hoangduyminh.exercise201.dto.chat.*;
import com.hoangduyminh.exercise201.entity.*;
import com.hoangduyminh.exercise201.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatConversationRepository conversationRepository;
    private final ChatParticipantRepository participantRepository;
    private final ChatMessageRepository messageRepository;
    private final ChatQuickReplyRepository quickReplyRepository;
    private final ChatTypingIndicatorRepository typingIndicatorRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Create a new conversation
     */
    @Transactional
    public ChatConversationResponse createConversation(CreateConversationRequest request) {
        // Check if customer already has an active conversation
        var existingConversation = conversationRepository
                .findByCustomerIdAndStatus(request.getCustomerId(), ChatConversation.ConversationStatus.ACTIVE);
        
        if (existingConversation.isPresent()) {
            return ChatConversationResponse.fromEntity(existingConversation.get());
        }

        // Create new conversation
        ChatConversation conversation = ChatConversation.builder()
                .customerId(request.getCustomerId())
                .roomType(request.getRoomType())
                .subject(request.getSubject())
                .assignedStaffId(request.getAssignedStaffId())
                .status(ChatConversation.ConversationStatus.ACTIVE)
                .build();

        conversation = conversationRepository.save(conversation);
        
        log.info("Created new conversation: {}", conversation.getId());
        return ChatConversationResponse.fromEntity(conversation);
    }

    /**
     * Get all conversations for a customer
     */
    public List<ChatConversationResponse> getCustomerConversations(UUID customerId) {
        return conversationRepository.findByCustomerIdOrderByLastMessageAtDesc(customerId)
                .stream()
                .map(ChatConversationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all conversations for a staff member
     */
    public List<ChatConversationResponse> getStaffConversations(UUID staffId) {
        return conversationRepository.findByAssignedStaffIdOrderByLastMessageAtDesc(staffId)
                .stream()
                .map(ChatConversationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get unassigned active conversations
     */
    public List<ChatConversationResponse> getUnassignedConversations() {
        return conversationRepository.findUnassignedActiveConversations()
                .stream()
                .map(ChatConversationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Assign conversation to staff
     */
    @Transactional
    public ChatConversationResponse assignConversation(UUID conversationId, UUID staffId) {
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        conversation.setAssignedStaffId(staffId);
        conversation = conversationRepository.save(conversation);
        
        log.info("Assigned conversation {} to staff {}", conversationId, staffId);
        return ChatConversationResponse.fromEntity(conversation);
    }

    /**
     * Send a message via WebSocket
     */
    @Transactional
    public ChatMessageResponse sendMessage(SendMessageRequest request) {
        // Create message entity
        ChatMessage message = ChatMessage.builder()
                .conversationId(request.getConversationId())
                .senderId(request.getSenderId())
                .senderType(request.getSenderType())
                .senderName(request.getSenderName())
                .messageType(request.getMessageType())
                .content(request.getContent())
                .attachmentUrl(request.getAttachmentUrl())
                .attachmentType(request.getAttachmentType())
                .build();

        message = messageRepository.save(message);

        // Update conversation's last message timestamp
        conversationRepository.findById(request.getConversationId()).ifPresent(conv -> {
            conv.setLastMessageAt(LocalDateTime.now());
            conversationRepository.save(conv);
        });

        // Update unread count for other participants
        ChatParticipant.ParticipantType participantType = mapSenderTypeToParticipantType(request.getSenderType());
        participantRepository.incrementUnreadCountExceptSender(
                request.getConversationId(),
                request.getSenderId(),
                participantType
        );

        ChatMessageResponse response = ChatMessageResponse.fromEntity(message);

        // Broadcast message via WebSocket
        messagingTemplate.convertAndSend(
                "/topic/conversation/" + request.getConversationId(),
                response
        );

        log.info("Sent message {} in conversation {}", message.getId(), request.getConversationId());
        return response;
    }

    /**
     * Get messages in a conversation (paginated)
     */
    public Page<ChatMessageResponse> getMessages(UUID conversationId, Pageable pageable) {
        return messageRepository.findByConversationIdAndIsDeletedFalseOrderByCreatedAtAsc(conversationId, pageable)
                .map(ChatMessageResponse::fromEntity);
    }

    /**
     * Get all messages in a conversation
     */
    public List<ChatMessageResponse> getAllMessages(UUID conversationId) {
        return messageRepository.findByConversationIdAndIsDeletedFalseOrderByCreatedAtAsc(conversationId)
                .stream()
                .map(ChatMessageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Mark message as read
     */
    @Transactional
    public void markMessageAsRead(UUID messageId) {
        messageRepository.markAsRead(messageId);
        log.info("Marked message {} as read", messageId);
    }

    /**
     * Mark all messages in conversation as read
     */
    @Transactional
    public void markAllMessagesAsRead(UUID conversationId, UUID userId, ChatParticipant.ParticipantType userType) {
        messageRepository.markAllAsReadInConversation(conversationId);
        participantRepository.resetUnreadCount(conversationId, userId, userType);
        participantRepository.updateLastSeen(conversationId, userId, userType, LocalDateTime.now());
        
        log.info("Marked all messages as read in conversation {} for user {}", conversationId, userId);
    }

    /**
     * Handle typing indicator
     */
    @Transactional
    public void handleTypingIndicator(TypingIndicatorMessage message) {
        var indicator = typingIndicatorRepository
                .findByConversationIdAndUserIdAndUserType(
                        message.getConversationId(),
                        message.getUserId(),
                        message.getUserType()
                );

        if (indicator.isPresent()) {
            ChatTypingIndicator existing = indicator.get();
            existing.setIsTyping(message.getIsTyping());
            existing.setUpdatedAt(LocalDateTime.now());
            typingIndicatorRepository.save(existing);
        } else {
            ChatTypingIndicator newIndicator = ChatTypingIndicator.builder()
                    .conversationId(message.getConversationId())
                    .userId(message.getUserId())
                    .userType(message.getUserType())
                    .userName(message.getUserName())
                    .isTyping(message.getIsTyping())
                    .build();
            typingIndicatorRepository.save(newIndicator);
        }

        // Broadcast typing indicator via WebSocket
        messagingTemplate.convertAndSend(
                "/topic/conversation/" + message.getConversationId() + "/typing",
                message
        );

        log.debug("Updated typing indicator for user {} in conversation {}", 
                message.getUserId(), message.getConversationId());
    }

    /**
     * Get active typing indicators in a conversation
     */
    public List<TypingIndicatorMessage> getTypingIndicators(UUID conversationId) {
        return typingIndicatorRepository.findByConversationIdAndIsTypingTrue(conversationId)
                .stream()
                .map(TypingIndicatorMessage::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Close a conversation
     */
    @Transactional
    public ChatConversationResponse closeConversation(UUID conversationId, UUID closedBy) {
        ChatConversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
        
        conversation.setStatus(ChatConversation.ConversationStatus.CLOSED);
        conversation.setClosedBy(closedBy);
        conversation.setClosedAt(LocalDateTime.now());
        
        conversation = conversationRepository.save(conversation);
        
        log.info("Closed conversation {} by user {}", conversationId, closedBy);
        return ChatConversationResponse.fromEntity(conversation);
    }

    /**
     * Get quick replies
     */
    public List<ChatQuickReply> getQuickReplies(String category) {
        if (category != null && !category.isEmpty()) {
            return quickReplyRepository.findByCategoryAndIsActiveTrueOrderByUsageCountDesc(category);
        }
        return quickReplyRepository.findByIsActiveTrueOrderByUsageCountDesc();
    }

    /**
     * Use quick reply (increment usage count)
     */
    @Transactional
    public void useQuickReply(UUID quickReplyId) {
        quickReplyRepository.incrementUsageCount(quickReplyId);
    }

    /**
     * Helper method to map SenderType to ParticipantType
     */
    private ChatParticipant.ParticipantType mapSenderTypeToParticipantType(ChatMessage.SenderType senderType) {
        return ChatParticipant.ParticipantType.valueOf(senderType.name());
    }
}
