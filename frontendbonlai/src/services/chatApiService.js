import axiosInstance from '../utils/axios';

const CHAT_API_BASE = '/api/chat';

/**
 * Chat REST API Service
 * Handles all HTTP requests for chat functionality
 */
class ChatApiService {
  
  /**
   * Create a new conversation
   */
  async createConversation(data) {
    try {
      const response = await axiosInstance.post(`${CHAT_API_BASE}/conversations`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Get all conversations for a customer
   */
  async getCustomerConversations(customerId) {
    try {
      const response = await axiosInstance.get(`${CHAT_API_BASE}/conversations/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer conversations:', error);
      throw error;
    }
  }

  /**
   * Get all conversations for a staff member
   */
  async getStaffConversations(staffId) {
    try {
      const response = await axiosInstance.get(`${CHAT_API_BASE}/conversations/staff/${staffId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching staff conversations:', error);
      throw error;
    }
  }

  /**
   * Get unassigned conversations (admin/staff only)
   */
  async getUnassignedConversations() {
    try {
      const response = await axiosInstance.get(`${CHAT_API_BASE}/conversations/unassigned`);
      return response.data;
    } catch (error) {
      console.error('Error fetching unassigned conversations:', error);
      throw error;
    }
  }

  /**
   * Assign conversation to staff
   */
  async assignConversation(conversationId, staffId) {
    try {
      const response = await axiosInstance.put(
        `${CHAT_API_BASE}/conversations/${conversationId}/assign/${staffId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error assigning conversation:', error);
      throw error;
    }
  }

  /**
   * Close a conversation
   */
  async closeConversation(conversationId, closedBy) {
    try {
      const response = await axiosInstance.put(
        `${CHAT_API_BASE}/conversations/${conversationId}/close`,
        null,
        { params: { closedBy } }
      );
      return response.data;
    } catch (error) {
      console.error('Error closing conversation:', error);
      throw error;
    }
  }

  /**
   * Get messages in a conversation (paginated)
   */
  async getMessages(conversationId, page = 0, size = 50) {
    try {
      const response = await axiosInstance.get(
        `${CHAT_API_BASE}/conversations/${conversationId}/messages`,
        { params: { page, size } }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  /**
   * Get all messages in a conversation
   */
  async getAllMessages(conversationId) {
    try {
      const response = await axiosInstance.get(
        `${CHAT_API_BASE}/conversations/${conversationId}/messages/all`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching all messages:', error);
      throw error;
    }
  }

  /**
   * Mark a message as read
   */
  async markMessageAsRead(messageId) {
    try {
      await axiosInstance.put(`${CHAT_API_BASE}/messages/${messageId}/read`);
    } catch (error) {
      console.error('Error marking message as read:', error);
      throw error;
    }
  }

  /**
   * Mark all messages in conversation as read
   */
  async markAllMessagesAsRead(conversationId, userId, userType) {
    try {
      await axiosInstance.put(
        `${CHAT_API_BASE}/conversations/${conversationId}/read-all`,
        null,
        { params: { userId, userType } }
      );
    } catch (error) {
      console.error('Error marking all messages as read:', error);
      throw error;
    }
  }

  /**
   * Get quick replies
   */
  async getQuickReplies(category = null) {
    try {
      const params = category ? { category } : {};
      const response = await axiosInstance.get(`${CHAT_API_BASE}/quick-replies`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching quick replies:', error);
      throw error;
    }
  }

  /**
   * Use a quick reply (increment usage count)
   */
  async useQuickReply(quickReplyId) {
    try {
      await axiosInstance.post(`${CHAT_API_BASE}/quick-replies/${quickReplyId}/use`);
    } catch (error) {
      console.error('Error using quick reply:', error);
      throw error;
    }
  }
}

// Create singleton instance
const chatApiService = new ChatApiService();

export default chatApiService;
