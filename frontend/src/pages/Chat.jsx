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
  useMediaQuery,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  Fab
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
  Schedule,
  Mic,
  Stop,
  ThumbUp,
  ThumbDown,
  Favorite,
  Share,
  Download,
  Delete,
  Edit,
  Reply,
  Schedule as ScheduleIcon,
  LocationOn,
  Image,
  Description,
  Videocam,
  AudioFile,
  Close,
  CheckCircle,
  Warning
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';

const Chat = () => {
  const [message, setMessage] = React.useState("");
  const [selectedChat, setSelectedChat] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const navigate = useNavigate();

  // New state for enhanced features
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [callType, setCallType] = useState('');
  const [messageReactions, setMessageReactions] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

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

  // Quick action buttons
  const quickActions = [
    { label: "👍 Great!", icon: <ThumbUp />, action: () => sendQuickMessage("👍 Great!") },
    { label: "👋 Hi there!", icon: <EmojiEmotions />, action: () => sendQuickMessage("👋 Hi there!") },
    { label: "📅 Schedule", icon: <ScheduleIcon />, action: () => sendQuickMessage("Let's schedule a session!") },
    { label: "📍 Location", icon: <LocationOn />, action: () => sendQuickMessage("📍 I'm available for in-person sessions") },
    { label: "✅ Confirmed", icon: <CheckCircle />, action: () => sendQuickMessage("✅ Confirmed!") },
    { label: "❓ Question", icon: <Search />, action: () => sendQuickMessage("❓ Do you have any questions?") }
  ];

  // Emoji reactions
  const emojiReactions = ['👍', '❤️', '😊', '🎉', '👏', '🔥', '💯', '🤔'];

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
        attachment: attachment ? { name: attachment.name, url: URL.createObjectURL(attachment), type: attachment.type } : null,
        replyTo: replyToMessage
      };
      setMessagesByChat(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), newMsg]
      }));
      setMessage("");
      setAttachment(null);
      setReplyToMessage(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  const sendQuickMessage = (content) => {
    const chatId = chats[selectedChat].id;
    const newMsg = {
      id: (messagesByChat[chatId]?.length || 0) + 1,
      sender: "You",
      avatar: "ME",
      content: content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    setMessagesByChat(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), newMsg]
    }));
    setShowQuickActions(false);
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
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setSnackbar({ open: true, message: 'File size too large. Please select a file under 10MB.', severity: 'warning' });
        return;
      }
      setAttachment(file);
      setSnackbar({ open: true, message: `File "${file.name}" attached successfully!`, severity: 'success' });
    }
  };

  const handleCall = (type) => {
    setCallType(type);
    setCallDialogOpen(true);
  };

  const handleCallConfirm = () => {
    setCallDialogOpen(false);
    setSnackbar({ open: true, message: `Initiating ${callType} call with ${chats[selectedChat]?.name}...`, severity: 'info' });
    // Here you would integrate with actual calling service
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setSnackbar({ open: true, message: 'Recording started... Click stop when done.', severity: 'info' });
    } else {
      setIsRecording(false);
      setSnackbar({ open: true, message: 'Voice message recorded and sent!', severity: 'success' });
      // Here you would handle the actual voice recording
    }
  };

  const handleReaction = (messageId, reaction) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: [...(prev[messageId] || []), reaction]
    }));
  };

  const handleReply = (message) => {
    setReplyToMessage(message);
    setSnackbar({ open: true, message: `Replying to: "${message.content.substring(0, 30)}..."`, severity: 'info' });
  };

  const handleMoreMenuOpen = (event) => {
    setMoreMenuAnchor(event.currentTarget);
  };

  const handleMoreMenuClose = () => {
    setMoreMenuAnchor(null);
  };

  const chatId = chats[selectedChat]?.id;
  const messages = messagesByChat[chatId] || [];

  // Add this function to generate a unique room ID
  const startVideoCall = () => {
    const roomId = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const remoteName = chats[selectedChat]?.name || "User";
    const chatId = chats[selectedChat]?.id;
    navigate(`/video-call/${roomId}`, { state: { remoteName, chatId } });
  };

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
                          <Box component="div">
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              component="span"
                              sx={{ fontWeight: 500, fontSize: '0.85rem', lineHeight: 1.4 }}
                            >
                              {chat.lastMessage}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary" component="span">
                                {chat.time}
                              </Typography>
                              {chat.unread > 0 && (
                                <Badge 
                                  badgeContent={chat.unread} 
                                  color="primary"
                                  sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', fontWeight: 600 } }}
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
                    <Tooltip title="Voice Call">
                      <IconButton 
                        onClick={() => handleCall('voice')}
                        sx={{ 
                          bgcolor: 'rgba(102, 126, 234, 0.08)',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.12)'
                          }
                        }}
                      >
                        <Phone color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Video Call (P2P)">
                      <IconButton 
                        onClick={startVideoCall}
                        sx={{ 
                          bgcolor: 'rgba(102, 126, 234, 0.08)',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.12)'
                          }
                        }}
                      >
                        <VideoCall color="primary" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="More Options">
                      <IconButton 
                        onClick={handleMoreMenuOpen}
                        sx={{ 
                          bgcolor: 'rgba(102, 126, 234, 0.08)',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.12)'
                          }
                        }}
                      >
                        <MoreVert color="primary" />
                      </IconButton>
                    </Tooltip>
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
                              {/* Reply to message */}
                              {msg.replyTo && (
                                <Box sx={{ 
                                  mb: 1, 
                                  p: 1, 
                                  bgcolor: 'rgba(0,0,0,0.05)', 
                                  borderRadius: 1,
                                  borderLeft: '3px solid primary.main'
                                }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Replying to: {msg.replyTo.content.substring(0, 30)}...
                                  </Typography>
                                </Box>
                              )}
                              
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
                                  backdropFilter: 'blur(10px)',
                                  position: 'relative',
                                  '&:hover .message-actions': {
                                    opacity: 1
                                  }
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
                                
                                {/* Message actions (appear on hover) */}
                                <Box 
                                  className="message-actions"
                                  sx={{ 
                                    position: 'absolute',
                                    top: -10,
                                    right: msg.isOwn ? -10 : 'auto',
                                    left: msg.isOwn ? 'auto' : -10,
                                    opacity: 0,
                                    transition: 'opacity 0.2s ease-in-out',
                                    display: 'flex',
                                    gap: 0.5,
                                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                                    borderRadius: 2,
                                    p: 0.5,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  <Tooltip title="Reply">
                                    <IconButton size="small" onClick={() => handleReply(msg)}>
                                      <Reply fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="React">
                                    <IconButton size="small">
                                      <EmojiEmotions fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  {msg.attachment && (
                                    <Tooltip title="Download">
                                      <IconButton size="small">
                                        <Download fontSize="small" />
                                      </IconButton>
                                    </Tooltip>
                                  )}
                                </Box>
                              </Paper>
                              
                              {/* Message reactions */}
                              {messageReactions[msg.id] && messageReactions[msg.id].length > 0 && (
                                <Box sx={{ 
                                  display: 'flex', 
                                  gap: 0.5, 
                                  mt: 1,
                                  justifyContent: msg.isOwn ? 'flex-end' : 'flex-start'
                                }}>
                                  {messageReactions[msg.id].map((reaction, idx) => (
                                    <Chip
                                      key={idx}
                                      label={reaction}
                                      size="small"
                                      sx={{ 
                                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                                        fontSize: '0.75rem'
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                              
                              {msg.attachment && (
                                <Box sx={{ mt: 1 }}>
                                  {msg.attachment.type.startsWith('image/') ? (
                                    <img src={msg.attachment.url} alt={msg.attachment.name} style={{ maxWidth: 180, borderRadius: 8 }} />
                                  ) : (
                                    <Paper sx={{ p: 1, bgcolor: 'rgba(255, 255, 255, 0.8)', borderRadius: 2 }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {msg.attachment.type.startsWith('video/') ? <Videocam /> : 
                                         msg.attachment.type.startsWith('audio/') ? <AudioFile /> : 
                                         msg.attachment.type.startsWith('image/') ? <Image /> : <Description />}
                                        <Typography variant="body2">{msg.attachment.name}</Typography>
                                      </Box>
                                    </Paper>
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
                    <div ref={messagesEndRef} />
                  </Box>
                </Fade>
              </Box>

              {/* Quick Actions */}
              {showQuickActions && (
                <Box sx={{ 
                  p: 2, 
                  borderTop: 1, 
                  borderColor: 'divider',
                  bgcolor: 'rgba(255, 255, 255, 0.9)'
                }}>
                  <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Quick Actions</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        size="small"
                        startIcon={action.icon}
                        onClick={action.action}
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600
                        }}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Message Input */}
              <Box sx={{ 
                p: { xs: 2, md: 3 }, 
                borderTop: 1, 
                borderColor: 'divider',
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)'
              }}>
                {/* Reply indicator */}
                {replyToMessage && (
                  <Box sx={{ 
                    mb: 2, 
                    p: 1, 
                    bgcolor: 'rgba(102, 126, 234, 0.1)', 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Typography variant="body2" color="primary.main">
                      Replying to: {replyToMessage.content.substring(0, 30)}...
                    </Typography>
                    <IconButton size="small" onClick={() => setReplyToMessage(null)}>
                      <Close fontSize="small" />
                    </IconButton>
                  </Box>
                )}
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  gap: 1
                }}>
                  <Tooltip title="Attach File">
                    <IconButton 
                      onClick={handleAttachClick}
                      sx={{ bgcolor: 'rgba(102, 126, 234, 0.08)', '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.12)' } }}
                    >
                      <AttachFile color="primary" />
                      <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Voice Message">
                    <IconButton 
                      onClick={handleVoiceRecording}
                      sx={{ 
                        bgcolor: isRecording ? 'error.main' : 'rgba(102, 126, 234, 0.08)',
                        color: isRecording ? 'white' : 'primary.main',
                        '&:hover': { 
                          bgcolor: isRecording ? 'error.dark' : 'rgba(102, 126, 234, 0.12)' 
                        }
                      }}
                    >
                      {isRecording ? <Stop /> : <Mic />}
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Quick Actions">
                    <IconButton 
                      onClick={() => setShowQuickActions(!showQuickActions)}
                      sx={{ 
                        bgcolor: showQuickActions ? 'primary.main' : 'rgba(102, 126, 234, 0.08)',
                        color: showQuickActions ? 'white' : 'primary.main',
                        '&:hover': { 
                          bgcolor: showQuickActions ? 'primary.dark' : 'rgba(102, 126, 234, 0.12)' 
                        }
                      }}
                    >
                      <EmojiEmotions />
                    </IconButton>
                  </Tooltip>
                  
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
                    disabled={!message.trim() && !attachment}
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

      {/* Call Dialog */}
      <Dialog open={callDialogOpen} onClose={() => setCallDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: 'center' }}>
          {callType === 'video' ? <VideoCall sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} /> : 
           <Phone sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />}
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            {callType === 'video' ? 'Video Call' : 'Voice Call'}
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Start a {callType} call with <strong>{chats[selectedChat]?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button onClick={() => setCallDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleCallConfirm} variant="contained" color="primary">
            Start Call
          </Button>
        </DialogActions>
      </Dialog>

      {/* More Options Menu */}
      <Menu
        anchorEl={moreMenuAnchor}
        open={Boolean(moreMenuAnchor)}
        onClose={handleMoreMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <MenuItem onClick={handleMoreMenuClose}>
          <Search sx={{ mr: 2 }} />
          Search Messages
        </MenuItem>
        <MenuItem onClick={handleMoreMenuClose}>
          <Share sx={{ mr: 2 }} />
          Share Chat
        </MenuItem>
        <MenuItem onClick={handleMoreMenuClose}>
          <ScheduleIcon sx={{ mr: 2 }} />
          Schedule Session
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleMoreMenuClose} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 2 }} />
          Clear Chat
        </MenuItem>
      </Menu>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Chat; 