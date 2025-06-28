import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  Chip,
  Badge
} from '@mui/material';
import { 
  Send, 
  AttachFile, 
  EmojiEmotions, 
  VideoCall,
  Phone,
  MoreVert,
  Search
} from '@mui/icons-material';

const Chat = () => {
  const [message, setMessage] = React.useState("");
  const [selectedChat, setSelectedChat] = React.useState(0);

  // Mock data for demonstration
  const chats = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "SJ",
      lastMessage: "Great! Let's schedule our next session.",
      time: "2:30 PM",
      unread: 2,
      isOnline: true
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "MC",
      lastMessage: "The Python concepts are clear now.",
      time: "1:15 PM",
      unread: 0,
      isOnline: false
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "ED",
      lastMessage: "Can you help me with React hooks?",
      time: "11:45 AM",
      unread: 1,
      isOnline: true
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      avatar: "SJ",
      content: "Hi! I'm excited to learn React from you!",
      time: "2:15 PM",
      isOwn: false
    },
    {
      id: 2,
      sender: "You",
      avatar: "ME",
      content: "Hello Sarah! I'm glad to help you with React. What would you like to start with?",
      time: "2:17 PM",
      isOwn: true
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      avatar: "SJ",
      content: "I've been trying to understand hooks, especially useState and useEffect. They're a bit confusing.",
      time: "2:20 PM",
      isOwn: false
    },
    {
      id: 4,
      sender: "You",
      avatar: "ME",
      content: "No worries! Hooks can be tricky at first. Let me explain them step by step. useState is for managing state in functional components...",
      time: "2:25 PM",
      isOwn: true
    },
    {
      id: 5,
      sender: "Sarah Johnson",
      avatar: "SJ",
      content: "Great! Let's schedule our next session.",
      time: "2:30 PM",
      isOwn: false
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Send message to backend
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: { xs: 2, md: 3 },
      px: { xs: 1, md: 0 }
    }}>
      <Container maxWidth="lg" sx={{ height: '90vh' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            borderRadius: 4, 
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          {/* Chat List Sidebar */}
          <Box sx={{ 
            width: { xs: '100%', md: 320 }, 
            borderRight: { xs: 0, md: 1 }, 
            borderColor: 'divider',
            display: { xs: selectedChat === null ? 'block' : 'none', md: 'block' }
          }}>
            <Box sx={{ 
              p: { xs: 2, md: 3 }, 
              borderBottom: 1, 
              borderColor: 'divider',
              bgcolor: 'rgba(102, 126, 234, 0.05)'
            }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  color: 'primary.main'
                }}
              >
                Conversations
              </Typography>
            </Box>
            
            <List sx={{ p: 0, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
              {chats.map((chat, index) => (
                <ListItem 
                  key={chat.id}
                  button
                  selected={selectedChat === index}
                  onClick={() => setSelectedChat(index)}
                  sx={{ 
                    borderBottom: 1, 
                    borderColor: 'divider',
                    '&.Mui-selected': { 
                      bgcolor: 'rgba(102, 126, 234, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.12)'
                      }
                    },
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        mb: 0.5
                      }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '0.9rem', md: '1rem' }
                          }}
                        >
                          {chat.name}
                        </Typography>
                        {chat.unread > 0 && (
                          <Chip 
                            label={chat.unread} 
                            size="small" 
                            color="primary"
                            sx={{ 
                              height: 20, 
                              fontSize: '0.75rem',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          noWrap
                          sx={{ 
                            fontSize: { xs: '0.8rem', md: '0.85rem' },
                            mb: 0.5
                          }}
                        >
                          {chat.lastMessage}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: { xs: '0.7rem', md: '0.75rem' },
                            fontWeight: 500
                          }}
                        >
                          {chat.time}
                        </Typography>
                      </Box>
                    }
                  />
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: chat.isOnline ? 'success.main' : 'grey.400',
                          border: '2px solid white'
                        }}
                      />
                    }
                  >
                    <Avatar 
                      sx={{ 
                        width: { xs: 44, md: 48 }, 
                        height: { xs: 44, md: 48 }, 
                        bgcolor: 'primary.main',
                        fontSize: { xs: '1rem', md: '1.1rem' },
                        fontWeight: 'bold'
                      }}
                    >
                      {chat.avatar}
                    </Avatar>
                  </Badge>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Chat Messages */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            display: { xs: selectedChat !== null ? 'flex' : 'none', md: 'flex' }
          }}>
            {/* Chat Header */}
            <Box sx={{ 
              p: { xs: 2, md: 3 }, 
              borderBottom: 1, 
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: 'rgba(255, 255, 255, 0.8)'
            }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      bgcolor: chats[selectedChat]?.isOnline ? 'success.main' : 'grey.400',
                      border: '2px solid white'
                    }}
                  />
                }
              >
                <Avatar 
                  sx={{ 
                    bgcolor: 'primary.main',
                    width: { xs: 48, md: 56 },
                    height: { xs: 48, md: 56 },
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    fontWeight: 'bold'
                  }}
                >
                  {chats[selectedChat]?.avatar}
                </Avatar>
              </Badge>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                  }}
                >
                  {chats[selectedChat]?.name}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    fontSize: { xs: '0.85rem', md: '0.9rem' }
                  }}
                >
                  {chats[selectedChat]?.isOnline ? 'Online' : 'Offline'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                  }}
                >
                  <VideoCall />
                </IconButton>
                <IconButton 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                  }}
                >
                  <Phone />
                </IconButton>
                <IconButton 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                  }}
                >
                  <MoreVert />
                </IconButton>
              </Box>
            </Box>

            {/* Messages Area */}
            <Box sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: { xs: 2, md: 3 },
              bgcolor: 'rgba(248, 249, 250, 0.8)',
              backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%)'
            }}>
              {messages.map((msg) => (
                <Box 
                  key={msg.id}
                  sx={{ 
                    display: 'flex', 
                    justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                    mb: 3
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-end',
                    gap: 1,
                    maxWidth: '70%'
                  }}>
                    {!msg.isOwn && (
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: 'primary.main',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {msg.avatar}
                      </Avatar>
                    )}
                    <Box>
                      <Paper 
                        elevation={1}
                        sx={{ 
                          p: { xs: 2, md: 2.5 },
                          bgcolor: msg.isOwn ? 'primary.main' : 'white',
                          color: msg.isOwn ? 'white' : 'text.primary',
                          borderRadius: 3,
                          maxWidth: '100%',
                          boxShadow: msg.isOwn 
                            ? '0 4px 20px rgba(102, 126, 234, 0.2)' 
                            : '0 2px 12px rgba(0,0,0,0.08)'
                        }}
                      >
                        <Typography 
                          variant="body2"
                          sx={{ 
                            lineHeight: 1.5,
                            fontSize: { xs: '0.9rem', md: '1rem' }
                          }}
                        >
                          {msg.content}
                        </Typography>
                      </Paper>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ 
                          ml: 1, 
                          mt: 0.5, 
                          display: 'block',
                          fontSize: { xs: '0.7rem', md: '0.75rem' },
                          fontWeight: 500
                        }}
                      >
                        {msg.time}
                      </Typography>
                    </Box>
                    {msg.isOwn && (
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          bgcolor: 'secondary.main',
                          fontSize: '0.9rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {msg.avatar}
                      </Avatar>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Message Input */}
            <Box sx={{ 
              p: { xs: 2, md: 3 }, 
              borderTop: 1, 
              borderColor: 'divider',
              bgcolor: 'rgba(255, 255, 255, 0.9)'
            }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                alignItems: 'flex-end' 
              }}>
                <IconButton 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                  }}
                >
                  <AttachFile />
                </IconButton>
                <IconButton 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(102, 126, 234, 0.1)',
                    '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' }
                  }}
                >
                  <EmojiEmotions />
                </IconButton>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    '& .MuiOutlinedInput-root': { 
                      borderRadius: 3,
                      bgcolor: 'white',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
                <IconButton 
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  sx={{ 
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { 
                      bgcolor: 'primary.dark',
                      transform: 'scale(1.05)'
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'grey.300',
                      color: 'grey.500'
                    }
                  }}
                >
                  <Send />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Chat; 