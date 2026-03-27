import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import chatWebSocketService from '../../services/chatWebSocketService';
import chatApiService from '../../services/chatApiService';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [quickReplies, setQuickReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const typingTimeoutRef = useRef(null);
  const currentUserRef = useRef(null);

  /**
   * Initialize WebSocket connection
   */
  const connectWebSocket = useCallback(() => {
    chatWebSocketService.connect(
      (frame) => {
        console.log('WebSocket connected:', frame);
        setIsConnected(true);
        setError(null);
      },
      (error) => {
        console.error('WebSocket connection error:', error);
        setIsConnected(false);
        setError('Unable to connect to chat server. Retrying...');
      }
    );
  }, []);

  /**
   * Disconnect WebSocket
   */
  const disconnectWebSocket = useCallback(() => {
    chatWebSocketService.disconnect();
    setIsConnected(false);
  }, []);

  /**
   * Load conversations for current user
   */
  const loadConversations = useCallback(async (userId, userType) => {
    try {
      setLoading(true);
      let data = [];
      
      if (userType === 'CUSTOMER') {
        data = await chatApiService.getCustomerConversations(userId);
      } else if (userType === 'STAFF' || userType === 'ADMIN') {
        // Load both assigned and unassigned for admin/staff
        const [assigned, unassigned] = await Promise.allSettled([
          chatApiService.getStaffConversations(userId),
          chatApiService.getUnassignedConversations()
        ]);
        
        const assignedList = assigned.status === 'fulfilled' ? assigned.value : [];
        const unassignedList = unassigned.status === 'fulfilled' ? unassigned.value : [];
        
        // Merge and deduplicate by id
        const merged = [...unassignedList, ...assignedList].filter(c => c != null);
        data = merged.filter((c, i, arr) => arr.findIndex(x => x && x.id === c.id) === i);
      }
      
      setConversations(data.filter(c => c != null));
      setError(null);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Create or get conversation for customer
   */
  const startConversation = useCallback(async (customerId, roomType = 'SUPPORT', subject = null) => {
    try {
      setLoading(true);
      const data = await chatApiService.createConversation({
        customerId,
        roomType,
        subject,
        assignedStaffId: null
      });
      
      // Accept any response from the server as long as it's an object
      if (!data) {
        throw new Error('No data returned from server');
      }

      setCurrentConversation(data);
      setConversations(prev => {
        const exists = prev.find(c => c && c.id === data.id);
        return exists ? prev : [data, ...prev.filter(c => c != null)];
      });
      
      return data;
    } catch (err) {
      console.error('Error starting conversation:', err);
      setError('Failed to start conversation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Select a conversation and load its messages
   */
  const selectConversation = useCallback(async (conversation) => {
    try {
      setLoading(true);
      setCurrentConversation(conversation);
      
      // Unsubscribe from previous conversation
      if (currentConversation) {
        chatWebSocketService.unsubscribeFromConversation(currentConversation.id);
      }
      
      // Load messages
      const messagesData = await chatApiService.getAllMessages(conversation.id);
      setMessages(messagesData || []);
      
      // Subscribe to new conversation
      chatWebSocketService.subscribeToConversation(conversation.id, (newMessage) => {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
        
        // Update conversation's last message in the list
        setConversations(prevConvs => {
          const updated = prevConvs.map(c => 
            c.id === conversation.id 
              ? { ...c, lastMessageAt: newMessage.createdAt, lastMessageContent: newMessage.content }
              : c
          );
          
          // If the conversation isn't in the list (e.g. newly created unassigned), add it
          if (!updated.find(c => c.id === conversation.id)) {
            return [{ ...conversation, lastMessageAt: newMessage.createdAt, lastMessageContent: newMessage.content }, ...updated];
          }
          return updated;
        });
      });
      
      // Subscribe to typing indicators
      chatWebSocketService.subscribeToTypingIndicators(conversation.id, (typingData) => {
        if (typingData.isTyping) {
          setTypingUsers(prev => {
            const exists = prev.find(u => u.userId === typingData.userId);
            return exists ? prev : [...prev, typingData];
          });
        } else {
          setTypingUsers(prev => prev.filter(u => u.userId !== typingData.userId));
        }
      });
      
      // Join conversation
      chatWebSocketService.joinConversation(conversation.id);
      
      setError(null);
    } catch (err) {
      console.error('Error selecting conversation:', err);
      setError('Failed to load conversation');
    } finally {
      setLoading(false);
    }
  }, [currentConversation]);

  /**
   * Send a message
   */
  const sendMessage = useCallback((messageData) => {
    if (!isConnected || !currentConversation) {
      console.error('Cannot send message: Not connected or no conversation selected');
      return false;
    }

    const fullMessageData = {
      conversationId: currentConversation.id,
      senderId: messageData.senderId || currentUser?.id,
      senderType: messageData.senderType || currentUser?.type || 'CUSTOMER',
      senderName: messageData.senderName || currentUser?.name || 'User',
      messageType: messageData.messageType || 'TEXT',
      ...messageData
    };

    const sent = chatWebSocketService.sendMessage(fullMessageData);
    
    // Stop typing indicator when message is sent
    if (sent) {
      sendTypingIndicator(false);
    }
    
    return sent;
  }, [isConnected, currentConversation]);

  /**
   * Send typing indicator
   */
  const sendTypingIndicator = useCallback((isTyping) => {
    if (!isConnected || !currentConversation || !currentUserRef.current) {
      return false;
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const typingData = {
      conversationId: currentConversation.id,
      userId: currentUserRef.current.id,
      userType: currentUserRef.current.type,
      userName: currentUserRef.current.name,
      isTyping
    };

    const sent = chatWebSocketService.sendTypingIndicator(typingData);

    // Auto-clear typing indicator after 3 seconds
    if (isTyping && sent) {
      typingTimeoutRef.current = setTimeout(() => {
        sendTypingIndicator(false);
      }, 3000);
    }

    return sent;
  }, [isConnected, currentConversation]);

  /**
   * Mark all messages as read
   */
  const markAllAsRead = useCallback(async () => {
    if (!currentConversation || !currentUserRef.current) return;

    try {
      await chatApiService.markAllMessagesAsRead(
        currentConversation.id,
        currentUserRef.current.id,
        currentUserRef.current.type
      );
      
      // Update unread count
      setUnreadCounts(prev => ({
        ...prev,
        [currentConversation.id]: 0
      }));
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  }, [currentConversation]);

  /**
   * Load quick replies
   */
  const loadQuickReplies = useCallback(async (category = null) => {
    try {
      const data = await chatApiService.getQuickReplies(category);
      setQuickReplies(data || []);
    } catch (err) {
      console.error('Error loading quick replies:', err);
    }
  }, []);

  /**
   * Use a quick reply
   */
  const useQuickReply = useCallback(async (quickReply) => {
    try {
      await chatApiService.useQuickReply(quickReply.id);
      
      // Send message with quick reply content
      return sendMessage({
        senderId: currentUserRef.current.id,
        senderType: currentUserRef.current.type,
        senderName: currentUserRef.current.name,
        messageType: 'TEXT',
        content: quickReply.content
      });
    } catch (err) {
      console.error('Error using quick reply:', err);
      return false;
    }
  }, [sendMessage]);

  /**
   * Close conversation
   */
  const closeConversation = useCallback(async (conversationId, closedBy) => {
    try {
      await chatApiService.closeConversation(conversationId, closedBy);
      
      // Update conversation status
      setConversations(prev => 
        prev.map(c => 
          c.id === conversationId 
            ? { ...c, status: 'CLOSED', closedBy, closedAt: new Date().toISOString() }
            : c
        )
      );
      
      // If current conversation is closed, unsubscribe
      if (currentConversation?.id === conversationId) {
        chatWebSocketService.unsubscribeFromConversation(conversationId);
        chatWebSocketService.leaveConversation(conversationId);
      }
    } catch (err) {
      console.error('Error closing conversation:', err);
      throw err;
    }
  }, [currentConversation]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      disconnectWebSocket();
    };
  }, [disconnectWebSocket]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  // Sync currentConversation with the version in the conversations list if it updates
  useEffect(() => {
    if (currentConversation) {
      const updated = conversations.find(c => c.id === currentConversation.id);
      if (updated && updated.lastMessageAt !== currentConversation.lastMessageAt) {
        setCurrentConversation(updated);
      }
    }
  }, [conversations, currentConversation]);

  const value = {
    // Connection state
    isConnected,
    connectWebSocket,
    disconnectWebSocket,
    
    // Conversations
    conversations,
    currentConversation,
    loadConversations,
    startConversation,
    selectConversation,
    closeConversation,
    
    // Messages
    messages,
    sendMessage,
    markAllAsRead,
    
    // Typing indicators
    typingUsers,
    sendTypingIndicator,
    
    // Quick replies
    quickReplies,
    loadQuickReplies,
    useQuickReply,
    
    // Unread counts
    unreadCounts,
    
    // User
    currentUser,
    setCurrentUser,
    
    // UI state
    loading,
    error
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
