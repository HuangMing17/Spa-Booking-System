package com.hoangduyminh.exercise201.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "chat_typing_indicators")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatTypingIndicator {
    
    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;
    
    @Column(name = "conversation_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID conversationId;
    
    @Column(name = "user_id", columnDefinition = "BINARY(16)", nullable = false)
    private UUID userId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false, length = 20)
    private UserType userType;
    
    @Column(name = "user_name", nullable = false, length = 255)
    private String userName;
    
    @Column(name = "is_typing", nullable = false)
    @Builder.Default
    private Boolean isTyping = false;
    
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
    
    @PrePersist
    public void prePersist() {
        if (id == null) {
            id = UUID.randomUUID();
        }
    }
    
    public enum UserType {
        CUSTOMER,
        STAFF,
        ADMIN
    }
}
