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
  Badge,
  Fade,
  Grow,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Send, 
  AttachFile, 
  EmojiEmotions, 
  VideoCall,
  Phone,
  MoreVert,
  Search,
  ArrowBack,
  OnlinePrediction,
  Schedule
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useRef, useState } from 'react';

const Chat = () => {
  const [message, setMessage] = React.useState("");
  const [selectedChat, setSelectedChat] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  // Mock data for demonstration
  const chats = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "SJ",
      lastMessage: "Great! Let's schedule our next session.",
      time: "2:30 PM",
      unread: 2,
      isOnline: true,
      lastActive: "2 min ago"
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "MC",
      lastMessage: "The Python concepts are clear now.",
      time: "1:15 PM",
      unread: 0,
      isOnline: false,
      lastActive: "1 hour ago"
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "ED",
      lastMessage: "Can you help me with React hooks?",
      time: "11:45 AM",
      unread: 1,
      isOnline: true,
      lastActive: "5 min ago"
    }
  ];

  const [messagesByChat, setMessagesByChat] = useState({
    1: [
      { id: 1, sender: "Sarah Johnson", avatar: "SJ", content: "Hi! I'm excited to learn React from you!", time: "2:15 PM", isOwn: false },
      { id: 2, sender: "You", avatar: "ME", content: "Hello Sarah! I'm glad to help you with React. What would you like to start with?", time: "2:17 PM", isOwn: true },
      { id: 3, sender: "Sarah Johnson", avatar: "SJ", content: "I've been trying to understand hooks, especially useState and useEffect. They're a bit confusing.", time: "2:20 PM", isOwn: false },
      { id: 4, sender: "You", avatar: "ME", content: "No worries! Hooks can be tricky at first. Let me explain them step by step. useState is for managing state in functional components...", time: "2:25 PM", isOwn: true },
      { id: 5, sender: "Sarah Johnson", avatar: "SJ", content: "Great! Let's schedule our next session.", time: "2:30 PM", isOwn: false }
    ],
    2: [
      { id: 1, sender: "Mike Chen", avatar: "MC", content: "The Python concepts are clear now.", time: "1:15 PM", isOwn: false },
      { id: 2, sender: "You", avatar: "ME", content: "Glad to hear! Do you want to try a coding challenge?", time: "1:16 PM", isOwn: true }
    ],
    3: [
      { id: 1, sender: "Emma Davis", avatar: "ED", content: "Can you help me with React hooks?", time: "11:45 AM", isOwn: false }
    ]
  });
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef();
  const messagesEndRef = useRef();
  const [chatFadeKey, setChatFadeKey] = useState(0);

  React.useEffect(() => {
    if (userId) {
      const chatIndex = chats.findIndex(chat => chat.id === Number(userId));
      if (chatIndex !== -1) setSelectedChat(chatIndex);
    }
  }, [userId]);

  // Fade transition when switching chats
  React.useEffect(() => {
    setChatFadeKey(prev => prev + 1);
  }, [selectedChat]);

  // Scroll to bottom on chat switch or new message
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, messagesByChat]);

  const handleSendMessage = () => {
    if (message.trim() || attachment) {
      const chatId = chats[selectedChat].id;
      const newMsg = {
        id: (messagesByChat[chatId]?.length || 0) + 1,
        sender: "You",
        avatar: "ME",
        content: message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        attachment: attachment ? { name: attachment.name, url: URL.createObjectURL(attachment), type: attachment.type } : null
      };
      setMessagesByChat(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMsg]
      }));
      setMessage("");
      setAttachment(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setAttachment(file);
  };

  const chatId = chats[selectedChat]?.id;
  const messages = messagesByChat[chatId] || [];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: { xs: 2, md: 3 },
      px: { xs: 1, md: 0 }
    }}>
      <Container maxWidth="lg" sx={{ height: '90vh' }}>
        <Fade in={true} timeout={600}>
          <Paper 
            elevation={0} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              borderRadius: 4, 
              overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
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
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    color: 'primary.main'
                  }}
                >
                  Conversations
                </Typography>
              </Box>
              
              <List sx={{ p: 0, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                {chats.map((chat, index) => (
                  <Grow key={chat.id} in={true} timeout={400 + index * 100}>
                    <ListItem 
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
                              variant="subtitle1" 
                              sx={{ 
                                fontWeight: 600,
                                fontSize: { xs: '0.9rem', md: '1rem' },
                                color: 'text.primary'
                              }}
                            >
                              {chat.name}
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 0.5,
                              ml: 'auto'
                            }}>
                              {chat.isOnline ? (
                                <OnlinePrediction sx={{ fontSize: 16, color: 'success.main' }} />
                              ) : (
                                <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                              )}
                              <Typography variant="caption" color="text.secondary">
                                {chat.lastActive}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                fontWeight: 500,
                                fontSize: '0.85rem',
                                lineHeight: 1.4
                              }}
                            >
                              {chat.lastMessage}
                            </Typography>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              mt: 0.5
                            }}>
                              <Typography variant="caption" color="text.secondary">
                                {chat.time}
                              </Typography>
                              {chat.unread > 0 && (
                                <Badge 
                                  badgeContent={chat.unread} 
                                  color="primary"
                                  sx={{
                                    '& .MuiBadge-badge': {
                                      fontSize: '0.7rem',
                                      fontWeight: 600
                                    }
                                  }}
                                />
                              )}
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  </Grow>
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
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2
                }}>
                  {isMobile && (
                    <IconButton 
                      onClick={() => setSelectedChat(null)}
                      sx={{ 
                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.12)'
                        }
                      }}
                    >
                      <ArrowBack />
                    </IconButton>
                  )}
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          bgcolor: chats[selectedChat]?.isOnline ? 'success.main' : 'grey.400',
                          border: '3px solid white',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                      />
                    }
                  >
                    <Avatar 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        bgcolor: 'primary.main',
                        fontSize: '1.25rem',
                        fontWeight: 700
                      }}
                    >
                      {chats[selectedChat]?.avatar}
                    </Avatar>
                  </Badge>
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '1rem', md: '1.25rem' },
                        color: 'text.primary'
                      }}
                    >
                      {chats[selectedChat]?.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 0.5,
                        fontSize: '0.85rem'
                      }}
                    >
                      {chats[selectedChat]?.isOnline ? (
                        <>
                          <OnlinePrediction sx={{ fontSize: 14, color: 'success.main' }} />
                          Online
                        </>
                      ) : (
                        <>
                          <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                          {chats[selectedChat]?.lastActive}
                        </>
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton 
                      sx={{ 
                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.12)'
                        }
                      }}
                    >
                      <Phone color="primary" />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.12)'
                        }
                      }}
                    >
                      <VideoCall color="primary" />
                    </IconButton>
                    <IconButton 
                      sx={{ 
                        bgcolor: 'rgba(102, 126, 234, 0.08)',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.12)'
                        }
                      }}
                    >
                      <MoreVert color="primary" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>

              {/* Messages Area */}
              <Box sx={{ 
                flex: 1, 
                p: { xs: 2, md: 3 }, 
                overflow: 'auto',
                bgcolor: 'rgba(248, 250, 252, 0.5)'
              }}>
                <Fade key={chatFadeKey} in={true} timeout={900}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {messages.map((msg, index) => (
                      <Grow key={msg.id} in={true} timeout={300 + index * 100}>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'flex-end',
                            gap: 1,
                            maxWidth: '70%'
                          }}>
                            {!msg.isOwn && (
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  bgcolor: 'primary.main',
                                  fontSize: '0.9rem',
                                  fontWeight: 600
                                }}
                              >
                                {msg.avatar}
                              </Avatar>
                            )}
                            <Box>
                              <Paper 
                                elevation={0}
                                sx={{ 
                                  p: 2,
                                  borderRadius: 3,
                                  bgcolor: msg.isOwn 
                                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                    : 'rgba(255, 255, 255, 0.9)',
                                  color: 'text.primary',
                                  boxShadow: msg.isOwn 
                                    ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                                    : '0 2px 8px rgba(0,0,0,0.08)',
                                  border: msg.isOwn 
                                    ? 'none'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                  backdropFilter: 'blur(10px)'
                                }}
                              >
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    lineHeight: 1.5,
                                    fontSize: '0.95rem',
                                    fontWeight: msg.isOwn ? 500 : 400
                                  }}
                                >
                                  {msg.content}
                                </Typography>
                              </Paper>
                              {msg.attachment && (
                                <Box sx={{ mt: 1 }}>
                                  {msg.attachment.type.startsWith('image/') ? (
                                    <img src={msg.attachment.url} alt={msg.attachment.name} style={{ maxWidth: 180, borderRadius: 8 }} />
                                  ) : (
                                    <a href={msg.attachment.url} target="_blank" rel="noopener noreferrer">{msg.attachment.name}</a>
                                  )}
                                </Box>
                              )}
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  color: 'text.secondary',
                                  fontSize: '0.75rem',
                                  mt: 0.5,
                                  display: 'block',
                                  textAlign: msg.isOwn ? 'right' : 'left'
                                }}
                              >
                                {msg.time}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grow>
                    ))}
                  </Box>
                </Fade>
              </Box>

              {/* Message Input */}
              <Box sx={{ 
                p: { xs: 2, md: 3 }, 
                borderTop: 1, 
                borderColor: 'divider',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  gap: 1
                }}>
                  <IconButton 
                    onClick={handleAttachClick}
                    sx={{ bgcolor: 'rgba(102, 126, 234, 0.08)', '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.12)' } }}
                  >
                    <AttachFile color="primary" />
                    <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
                  </IconButton>
                  {attachment && (
                    <Chip
                      label={attachment.name}
                      onDelete={() => setAttachment(null)}
                      sx={{ ml: 1, maxWidth: 180 }}
                    />
                  )}
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton 
                            sx={{ 
                              bgcolor: 'rgba(102, 126, 234, 0.08)',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.12)'
                              }
                            }}
                          >
                            <EmojiEmotions color="primary" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'primary.main',
                        }
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    sx={{
                      borderRadius: 3,
                      minWidth: 48,
                      height: 48,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                        transform: 'translateY(-1px)'
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    <Send />
                  </Button>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Chat; 