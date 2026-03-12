import React from 'react';
import { Paper, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConversationList from './ConversationList';
import MessageView from './MessageView';
import { useChat } from '../../context/chat/ChatContext';

const ChatWindow = ({ onClose }) => {
  const { currentConversation, setCurrentConversation } = useChat();

  const handleBack = () => {
    setCurrentConversation(null);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: { xs: 0, sm: 80 },
        right: { xs: 0, sm: 20 },
        width: { xs: '100%', sm: 400 },
        height: { xs: '100vh', sm: 600 },
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        boxShadow: 4
      }}
    >
      {/* Header */}
      <Box 
        sx={{ 
          p: 2, 
          borderBottom: 1, 
          borderColor: 'divider', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {currentConversation && (
            <IconButton onClick={handleBack} size="small" sx={{ color: 'white' }}>
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6">
            {currentConversation ? 'Chat Support' : 'Hỗ Trợ Khách Hàng'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'hidden', bgcolor: 'background.default' }}>
        {currentConversation ? <MessageView /> : <ConversationList />}
      </Box>
    </Paper>
  );
};

export default ChatWindow;
