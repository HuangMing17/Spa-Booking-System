import React, { useState } from 'react';
import { Fab, Badge } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import ChatWindow from './ChatWindow';
import { useChat } from '../../context/chat/ChatContext';

const ChatButton = () => {
  const [open, setOpen] = useState(false);
  const { unreadCounts } = useChat();
  
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  return (
    <>
      <Fab 
        color="primary" 
        onClick={() => setOpen(true)}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <Badge badgeContent={totalUnread} color="error">
          <ChatIcon />
        </Badge>
      </Fab>
      
      {open && <ChatWindow onClose={() => setOpen(false)} />}
    </>
  );
};

export default ChatButton;
