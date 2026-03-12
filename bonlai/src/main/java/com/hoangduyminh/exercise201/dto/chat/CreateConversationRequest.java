package com.hoangduyminh.exercise201.dto.chat;

import com.hoangduyminh.exercise201.entity.ChatConversation;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateConversationRequest {
    
    @NotNull(message = "Customer ID is required")
    private UUID customerId;
    
    @NotNull(message = "Room type is required")
    private ChatConversation.RoomType roomType;
    
    private String subject;
    
    private UUID assignedStaffId;
}
