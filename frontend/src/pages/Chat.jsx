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
  Fab,
  Tabs,
  Tab,
  CircularProgress
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
  Warning,
  People,
  Add,
  Message
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import chatService from '../services/chatService';
import socketService from '../services/socketService';
import UserDiscovery from '../components/UserDiscovery';

const Chat = () => {
  const [message, setMessage] = React.useState("");
  const [selectedChat, setSelectedChat] = React.useState(0);
  const [activeTab, setActiveTab] = useState(0); // 0: Conversations, 1: Discover
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const { currentUser } = useAuth();

  // Real data state
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  // Enhanced features state
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [callType, setCallType] = useState('');
  const [messageReactions, setMessageReactions] = useState({});
  const [replyToMessage, setReplyToMessage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [moreMenuAnchor, setMoreMenuAnchor] = useState(null);

  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef();
  const messagesEndRef = useRef();
  const [chatFadeKey, setChatFadeKey] = useState(0);
  const typingTimeoutRef = useRef(null);

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

  // Initialize socket connection and load data
  useEffect(() => {
    if (currentUser) {
      initializeChat();
    }
  }, [currentUser]);

  // Initialize chat functionality
  const initializeChat = async () => {
    try {
      setLoading(true);
      setError(null);

      // Set up authentication token
      const token = await currentUser.getIdToken();
      chatService.setToken(token);

      // Connect to Socket.io
      socketService.connect(currentUser.uid);

      // Load conversations
      await loadConversations();

      // Set up socket event listeners
      setupSocketListeners();

    } catch (err) {
      console.error('Error initializing chat:', err);
      setError('Failed to initialize chat. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Set up Socket.io event listeners
  const setupSocketListeners = () => {
    // Listen for new messages
    socketService.onNewMessage(selectedMatchId, handleNewMessage);
    
    // Listen for typing indicators
    socketService.onTyping(selectedMatchId, handleTypingIndicator);
    
    // Listen for online status changes
    socketService.onOnlineStatus('online', handleUserOnline);
    socketService.onOnlineStatus('offline', handleUserOffline);
  };

  // Load conversations from backend
  const loadConversations = async () => {
    try {
      const conversationsData = await chatService.getConversations();
      setConversations(conversationsData);
      
      // Select first conversation if available
      if (conversationsData.length > 0 && !selectedMatchId) {
        setSelectedChat(0);
        setSelectedMatchId(conversationsData[0].match_id);
        await loadMessages(conversationsData[0].match_id);
      }
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError('Failed to load conversations.');
    }
  };

  // Load messages for a specific match
  const loadMessages = async (matchId) => {
    try {
      const messagesData = await chatService.getMatchMessages(matchId);
      
      // Transform messages to match frontend format
      const transformedMessages = messagesData.map(msg => ({
        id: msg.id,
        sender: msg.sender_name,
        avatar: msg.sender_name?.charAt(0)?.toUpperCase() || 'U',
        content: msg.content,
        time: new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: msg.sender_firebase_uid === currentUser.uid,
        timestamp: msg.sent_at
      }));
      
      setMessages(transformedMessages);
      
      // Join the chat room
      socketService.joinChat(matchId);
      
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Failed to load messages.');
    }
  };

  // Handle new message from Socket.io
  const handleNewMessage = (data) => {
    const { matchId, message, senderId, timestamp } = data;
    
    if (matchId === selectedMatchId) {
      const newMessage = {
        id: Date.now(), // Temporary ID
        sender: senderId === currentUser.uid ? 'You' : conversations.find(c => c.other_user_id === senderId)?.display_name || 'Unknown',
        avatar: senderId === currentUser.uid ? 'ME' : (conversations.find(c => c.other_user_id === senderId)?.display_name?.charAt(0)?.toUpperCase() || 'U'),
        content: message,
        time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: senderId === currentUser.uid,
        timestamp: timestamp
      };
      
      setMessages(prev => [...prev, newMessage]);
    }
  };

  // Handle typing indicator
  const handleTypingIndicator = (data) => {
    const { matchId, userId, isTyping } = data;
    
    if (matchId === selectedMatchId) {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (isTyping) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    }
  };

  // Handle user online status
  const handleUserOnline = (userId) => {
    setOnlineUsers(prev => new Set([...prev, userId]));
  };

  const handleUserOffline = (userId) => {
    setOnlineUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  };

  // Handle conversation selection
  const handleConversationSelect = async (index) => {
    setSelectedChat(index);
    const conversation = conversations[index];
    setSelectedMatchId(conversation.match_id);
    
    // Leave previous chat room
    if (selectedMatchId) {
      socketService.leaveChat(selectedMatchId);
    }
    
    // Load messages for new conversation
    await loadMessages(conversation.match_id);
    
    // Update fade key for smooth transition
    setChatFadeKey(prev => prev + 1);
  };

  // Handle match creation from UserDiscovery
  const handleMatchCreated = async (match) => {
    // Refresh conversations
    await loadConversations();
    
    // Find the new conversation and select it
    const newConversationIndex = conversations.findIndex(c => c.match_id === match.id);
    if (newConversationIndex !== -1) {
      handleConversationSelect(newConversationIndex);
    }
    
    setSnackbar({ open: true, message: 'Match created successfully!', severity: 'success' });
  };

  React.useEffect(() => {
    if (userId) {
      const chatIndex = conversations.findIndex(chat => chat.match_id === Number(userId));
      if (chatIndex !== -1) setSelectedChat(chatIndex);
    }
  }, [userId, conversations]);

  // Fade transition when switching chats
  React.useEffect(() => {
    setChatFadeKey(prev => prev + 1);
  }, [selectedChat]);

  // Scroll to bottom on chat switch or new message
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, messages]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedMatchId) {
      try {
        // Send message to backend
        const sentMessage = await chatService.sendMessage(selectedMatchId, message);
        
        // Send message via Socket.io for real-time delivery
        socketService.sendMessage(selectedMatchId, message, currentUser.uid);
        
        // Add message to local state
        const newMsg = {
          id: sentMessage.id,
          sender: "You",
          avatar: "ME",
          content: message,
          time: new Date(sentMessage.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
          timestamp: sentMessage.sent_at
        };
        
        setMessages(prev => [...prev, newMsg]);
        setMessage("");
        setReplyToMessage(null);
        
        // Stop typing indicator
        socketService.stopTyping(selectedMatchId, currentUser.uid);
        
      } catch (err) {
        console.error('Error sending message:', err);
        setSnackbar({ open: true, message: 'Failed to send message. Please try again.', severity: 'error' });
      }
    }
  };

  const sendQuickMessage = async (content) => {
    if (selectedMatchId) {
      try {
        const sentMessage = await chatService.sendMessage(selectedMatchId, content);
        socketService.sendMessage(selectedMatchId, content, currentUser.uid);
        
        const newMsg = {
          id: sentMessage.id,
          sender: "You",
          avatar: "ME",
          content: content,
          time: new Date(sentMessage.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: true,
          timestamp: sentMessage.sent_at
        };
        
        setMessages(prev => [...prev, newMsg]);
        setShowQuickActions(false);
      } catch (err) {
        console.error('Error sending quick message:', err);
        setSnackbar({ open: true, message: 'Failed to send message.', severity: 'error' });
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle typing indicator
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    
    // Start typing indicator
    if (selectedMatchId && e.target.value.length > 0) {
      socketService.startTyping(selectedMatchId, currentUser.uid);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Stop typing indicator after 2 seconds of no typing
      typingTimeoutRef.current = setTimeout(() => {
        socketService.stopTyping(selectedMatchId, currentUser.uid);
      }, 2000);
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
    setSnackbar({ open: true, message: `Initiating ${callType} call with ${conversations[selectedChat]?.name}...`, severity: 'info' });
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

  const chatId = conversations[selectedChat]?.id;
  const messagesByChat = { [chatId]: messages };

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
              {/* Tabs for Conversations and Discover */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={activeTab} 
                  onChange={(e, newValue) => setActiveTab(newValue)}
                  sx={{ 
                    '& .MuiTab-root': { 
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem'
                    }
                  }}
                >
                  <Tab 
                    label="Conversations" 
                    icon={<Message />} 
                    iconPosition="start"
                  />
                  <Tab 
                    label="Discover" 
                    icon={<People />} 
                    iconPosition="start"
                  />
                </Tabs>
              </Box>

              {/* Conversations Tab */}
              {activeTab === 0 && (
                <>
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
                  
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Box sx={{ p: 2 }}>
                      <Alert severity="error" onClose={() => setError(null)}>
                        {error}
                      </Alert>
                    </Box>
                  ) : conversations.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Message sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No conversations yet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Start by discovering people to chat with.
                      </Typography>
                    </Box>
                  ) : (
                    <List sx={{ p: 0, maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }}>
                      {conversations.map((conversation, index) => (
                        <Grow key={conversation.match_id} in={true} timeout={400 + index * 100}>
                          <ListItem 
                            button
                            selected={selectedChat === index}
                            onClick={() => handleConversationSelect(index)}
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
                                    component="span"
                                    sx={{ 
                                      fontWeight: 600,
                                      fontSize: { xs: '0.9rem', md: '1rem' },
                                      color: 'text.primary'
                                    }}
                                  >
                                    {conversation.display_name}
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 0.5,
                                    ml: 'auto'
                                  }}>
                                    {onlineUsers.has(conversation.other_user_id) ? (
                                      <OnlinePrediction sx={{ fontSize: 16, color: 'success.main' }} />
                                    ) : (
                                      <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                                    )}
                                    <Typography variant="caption" color="text.secondary" component="span">
                                      {onlineUsers.has(conversation.other_user_id) ? 'Online' : 'Offline'}
                                    </Typography>
                                  </Box>
                                </Box>
                              }
                              secondary={
                                <Box>
                                  <Typography 
                                    variant="body2" 
                                    color="text.secondary"
                                    component="span"
                                    sx={{ 
                                      fontWeight: 500,
                                      fontSize: '0.85rem',
                                      lineHeight: 1.4,
                                      display: 'block'
                                    }}
                                  >
                                    {conversation.last_message_content || 'No messages yet'}
                                  </Typography>
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mt: 0.5
                                  }}>
                                    <Typography variant="caption" color="text.secondary" component="span">
                                      {conversation.latest_message_time 
                                        ? new Date(conversation.latest_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : new Date(conversation.match_created_at).toLocaleDateString()
                                      }
                                    </Typography>
                                    {conversation.unread_count > 0 && (
                                      <Badge 
                                        badgeContent={conversation.unread_count} 
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
                  )}
                </>
              )}

              {/* Discover Tab */}
              {activeTab === 1 && (
                <UserDiscovery 
                  onUserSelected={(user) => {
                    // Handle user selection for direct chat
                    console.log('User selected:', user);
                  }}
                  onMatchCreated={handleMatchCreated}
                />
              )}
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
                          bgcolor: onlineUsers.has(conversations[selectedChat]?.other_user_id) ? 'success.main' : 'grey.400',
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
                      {conversations[selectedChat]?.display_name?.charAt(0)?.toUpperCase() || 'U'}
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
                      {conversations[selectedChat]?.display_name || 'Select a conversation'}
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
                      {onlineUsers.has(conversations[selectedChat]?.other_user_id) ? (
                        <>
                          <OnlinePrediction sx={{ fontSize: 14, color: 'success.main' }} />
                          Online
                        </>
                      ) : (
                        <>
                          <Schedule sx={{ fontSize: 14, color: 'text.secondary' }} />
                          Offline
                        </>
                      )}
                      {typingUsers.has(conversations[selectedChat]?.other_user_id) && (
                        <Typography variant="caption" color="primary.main" sx={{ ml: 1 }}>
                          typing...
                        </Typography>
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
                    <Tooltip title="Video Call">
                      <IconButton 
                        onClick={() => handleCall('video')}
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
                    onChange={handleMessageChange}
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
            Start a {callType} call with <strong>{conversations[selectedChat]?.name}</strong>?
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