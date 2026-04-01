import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

class ChatWebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = {};
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  /**
   * Connect to WebSocket server
   */
  connect(onConnected, onError) {
    if (this.connected) {
      console.log('Already connected to WebSocket');
      return;
    }

    try {
      const wsBase = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const socket = new SockJS(`${wsBase}/ws/chat`);
      this.stompClient = Stomp.over(socket);

      // Disable debug logging in production
      this.stompClient.debug = (str) => {
        if (import.meta.env.DEV) {
          console.log('STOMP: ' + str);
        }
      };

      this.stompClient.connect(
        {},
        (frame) => {
          this.connected = true;
          this.reconnectAttempts = 0;
          console.log('Connected to WebSocket:', frame);
          if (onConnected) onConnected(frame);
        },
        (error) => {
          this.connected = false;
          console.error('WebSocket connection error:', error);
          if (onError) onError(error);
          this.handleReconnect(onConnected, onError);
        }
      );
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      if (onError) onError(error);
    }
  }

  /**
   * Handle reconnection logic
   */
  handleReconnect(onConnected, onError) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect(onConnected, onError);
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached. Please refresh the page.');
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.stompClient && this.connected) {
      this.stompClient.disconnect(() => {
        this.connected = false;
        this.subscriptions = {};
        console.log('Disconnected from WebSocket');
      });
    }
  }

  /**
   * Subscribe to a conversation's messages
   */
  subscribeToConversation(conversationId, onMessageReceived) {
    if (!this.stompClient || !this.connected) {
      console.error('Not connected to WebSocket');
      return null;
    }

    const subscriptionId = `/topic/conversation/${conversationId}`;
    
    if (this.subscriptions[subscriptionId]) {
      console.log('Already subscribed to conversation:', conversationId);
      return this.subscriptions[subscriptionId];
    }

    const subscription = this.stompClient.subscribe(subscriptionId, (message) => {
      const messageData = JSON.parse(message.body);
      console.log('Received message:', messageData);
      if (onMessageReceived) onMessageReceived(messageData);
    });

    this.subscriptions[subscriptionId] = subscription;
    console.log('Subscribed to conversation:', conversationId);
    return subscription;
  }

  /**
   * Subscribe to typing indicators in a conversation
   */
  subscribeToTypingIndicators(conversationId, onTypingUpdate) {
    if (!this.stompClient || !this.connected) {
      console.error('Not connected to WebSocket');
      return null;
    }

    const subscriptionId = `/topic/conversation/${conversationId}/typing`;
    
    if (this.subscriptions[subscriptionId]) {
      console.log('Already subscribed to typing indicators:', conversationId);
      return this.subscriptions[subscriptionId];
    }

    const subscription = this.stompClient.subscribe(subscriptionId, (message) => {
      const typingData = JSON.parse(message.body);
      console.log('Typing indicator update:', typingData);
      if (onTypingUpdate) onTypingUpdate(typingData);
    });

    this.subscriptions[subscriptionId] = subscription;
    console.log('Subscribed to typing indicators:', conversationId);
    return subscription;
  }

  /**
   * Unsubscribe from a conversation
   */
  unsubscribeFromConversation(conversationId) {
    const messageSubscriptionId = `/topic/conversation/${conversationId}`;
    const typingSubscriptionId = `/topic/conversation/${conversationId}/typing`;

    if (this.subscriptions[messageSubscriptionId]) {
      this.subscriptions[messageSubscriptionId].unsubscribe();
      delete this.subscriptions[messageSubscriptionId];
      console.log('Unsubscribed from conversation messages:', conversationId);
    }

    if (this.subscriptions[typingSubscriptionId]) {
      this.subscriptions[typingSubscriptionId].unsubscribe();
      delete this.subscriptions[typingSubscriptionId];
      console.log('Unsubscribed from typing indicators:', conversationId);
    }
  }

  /**
   * Send a message to a conversation
   */
  sendMessage(messageData) {
    if (!this.stompClient || !this.connected) {
      console.error('Not connected to WebSocket');
      return false;
    }

    try {
      this.stompClient.send('/app/chat.send', {}, JSON.stringify(messageData));
      console.log('Message sent:', messageData);
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  /**
   * Send typing indicator
   */
  sendTypingIndicator(typingData) {
    if (!this.stompClient || !this.connected) {
      console.error('Not connected to WebSocket');
      return false;
    }

    try {
      this.stompClient.send('/app/chat.typing', {}, JSON.stringify(typingData));
      return true;
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
      return false;
    }
  }

  /**
   * Join a conversation
   */
  joinConversation(conversationId) {
    if (!this.stompClient || !this.connected) {
      console.error('Not connected to WebSocket');
      return false;
    }

    try {
      this.stompClient.send('/app/chat.join', {}, conversationId);
      console.log('Joined conversation:', conversationId);
      return true;
    } catch (error) {
      console.error('Failed to join conversation:', error);
      return false;
    }
  }

  /**
   * Leave a conversation
   */
  leaveConversation(conversationId) {
    if (!this.stompClient || !this.connected) {
      console.error('Not connected to WebSocket');
      return false;
    }

    try {
      this.stompClient.send('/app/chat.leave', {}, conversationId);
      console.log('Left conversation:', conversationId);
      return true;
    } catch (error) {
      console.error('Failed to leave conversation:', error);
      return false;
    }
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.connected;
  }
}

// Create singleton instance
const chatWebSocketService = new ChatWebSocketService();

export default chatWebSocketService;
