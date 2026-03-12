import React from 'react';
import { Box, Typography } from '@mui/material';
import { useChat } from '../../context/chat/ChatContext';

const TypingIndicator = () => {
  const { typingUsers } = useChat();

  if (typingUsers.length === 0) return null;

  const typingNames = typingUsers.map(u => u.userName).join(', ');

  return (
    <Box 
      sx={{ 
        px: 2, 
        py: 1, 
        bgcolor: 'grey.100',
        borderTop: 1,
        borderColor: 'divider'
      }}
    >
      <Typography 
        variant="caption" 
        sx={{ 
          fontStyle: 'italic', 
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            gap: 0.5
          }}
        >
          <Box
            component="span"
            className="typing-dot"
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              animation: 'typing 1.4s infinite',
              animationDelay: '0s',
              '@keyframes typing': {
                '0%, 60%, 100%': {
                  opacity: 0.3
                },
                '30%': {
                  opacity: 1
                }
              }
            }}
          />
          <Box
            component="span"
            className="typing-dot"
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              animation: 'typing 1.4s infinite',
              animationDelay: '0.2s',
              '@keyframes typing': {
                '0%, 60%, 100%': {
                  opacity: 0.3
                },
                '30%': {
                  opacity: 1
                }
              }
            }}
          />
          <Box
            component="span"
            className="typing-dot"
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              bgcolor: 'text.secondary',
              animation: 'typing 1.4s infinite',
              animationDelay: '0.4s',
              '@keyframes typing': {
                '0%, 60%, 100%': {
                  opacity: 0.3
                },
                '30%': {
                  opacity: 1
                }
              }
            }}
          />
        </Box>
        {typingNames} đang gõ...
      </Typography>
    </Box>
  );
};

export default TypingIndicator;
