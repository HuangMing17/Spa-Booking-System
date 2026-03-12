import React, { useState } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useChat } from '../../context/chat/ChatContext';
import { useCustomerAuth } from '../../auth/customer/context/CustomerAuthContext';

const MessageInput = () => {
  const [text, setText] = useState('');
  const { user } = useCustomerAuth();
  const { sendMessage, sendTypingIndicator, isConnected } = useChat();

  const handleSend = () => {
    if (text.trim() && user && isConnected) {
      const success = sendMessage({
        senderId: user.id,
        senderType: 'CUSTOMER',
        senderName: user.fullName || user.email,
        messageType: 'TEXT',
        content: text.trim()
      });
      
      if (success) {
        setText('');
        sendTypingIndicator(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      // Send typing indicator
      sendTypingIndicator(true);
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
    if (e.target.value.length > 0) {
      sendTypingIndicator(true);
    }
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        p: 2, 
        borderTop: 1, 
        borderColor: 'divider', 
        display: 'flex', 
        gap: 1,
        bgcolor: 'background.paper'
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder={isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."}
        value={text}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
        multiline
        maxRows={3}
        disabled={!isConnected}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 3
          }
        }}
      />
      <IconButton 
        color="primary" 
        onClick={handleSend} 
        disabled={!text.trim() || !isConnected}
        sx={{
          bgcolor: text.trim() ? 'primary.main' : 'action.disabledBackground',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark'
          },
          '&:disabled': {
            bgcolor: 'action.disabledBackground',
            color: 'action.disabled'
          }
        }}
      >
        <SendIcon />
      </IconButton>
    </Paper>
  );
};

export default MessageInput;
