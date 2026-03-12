import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../../context/chat/ChatContext';

const MessageView = () => {
  const { messages, currentConversation, markAllAsRead } = useChat();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Scroll to bottom when new message arrives
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Mark messages as read when conversation is opened
    if (currentConversation) {
      const timer = setTimeout(() => {
        markAllAsRead();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentConversation, markAllAsRead]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#f5f5f5' }}>
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </Box>
      
      <TypingIndicator />
      
      <MessageInput />
    </Box>
  );
};

export default MessageView;
