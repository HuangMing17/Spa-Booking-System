import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { format, isToday, isYesterday } from 'date-fns';
import { vi } from 'date-fns/locale';

const MessageList = ({ messages }) => {
  const formatMessageTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    if (isToday(date)) {
      return format(date, 'HH:mm', { locale: vi });
    } else if (isYesterday(date)) {
      return 'Hôm qua ' + format(date, 'HH:mm', { locale: vi });
    } else {
      return format(date, 'dd/MM HH:mm', { locale: vi });
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Box>
      {(messages || []).map((message, index) => {
        const isCustomer = message.senderType === 'CUSTOMER';
        const showAvatar = true; // Show avatar for everyone now
        
        return (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              flexDirection: isCustomer ? 'row-reverse' : 'row', // Reverse for customer
              justifyContent: 'flex-start',
              mb: 2,
              gap: 1
            }}
          >
            {/* Avatar for all */}
            {showAvatar && (
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32, 
                  bgcolor: isCustomer ? 'secondary.main' : 'primary.main', // Different color for customer
                  fontSize: '0.875rem'
                }}
              >
                {getInitials(message.senderName)}
              </Avatar>
            )}
            
            <Box sx={{ maxWidth: '70%', display: 'flex', flexDirection: 'column', alignItems: isCustomer ? 'flex-end' : 'flex-start' }}>
              {/* Sender name for all */}
              <Typography 
                variant="caption" 
                sx={{ 
                  fontWeight: 'bold', 
                  display: 'block',
                  mb: 0.5,
                  mx: 0.5,
                  color: isCustomer ? 'secondary.main' : 'primary.main'
                }}
              >
                {message.senderName || (isCustomer ? 'Khách hàng' : 'Nhân viên')}
              </Typography>
              
              <Paper
                sx={{
                  p: 1.5,
                  bgcolor: isCustomer ? 'primary.main' : 'white',
                  color: isCustomer ? 'white' : 'text.primary',
                  borderRadius: 2,
                  borderTopLeftRadius: !isCustomer ? 0 : 2,
                  borderTopRightRadius: isCustomer ? 0 : 2,
                  boxShadow: 1
                }}
              >
                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                  {message.content}
                </Typography>
                
                {message.editedAt && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      opacity: 0.7, 
                      display: 'block', 
                      mt: 0.5,
                      fontStyle: 'italic'
                    }}
                  >
                    (đã chỉnh sửa)
                  </Typography>
                )}
                
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.7, 
                    display: 'block', 
                    mt: 0.5,
                    textAlign: 'right'
                  }}
                >
                  {formatMessageTime(message.createdAt)}
                </Typography>
              </Paper>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default MessageList;
