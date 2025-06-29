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
  ListItemButton,
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
  Popover,
  CircularProgress,
  Tabs,
  Tab
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
  ContentCopy,
  Download as DownloadIcon,
  Person
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';
import { useAuth } from '../contexts/AuthContext';
import chatService from '../services/chatService';
import socketService from '../services/socketService';

const Chat = () => {
  const [message, setMessage] = React.useState("");
  const [selectedChat, setSelectedChat] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Real data state
  const [conversations, setConversations] = useState([]);
  const [messagesByChat, setMessagesByChat] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [creatingMatch, setCreatingMatch] = useState(false);

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [reactionMsgId, setReactionMsgId] = useState(null);
  const [hoveredMsgId, setHoveredMsgId] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const fileInputRef = useRef();
  const messagesEndRef = useRef();
  const [chatFadeKey, setChatFadeKey] = useState(0);

  // Initialize socket connection and fetch data
  useEffect(() => {
    if (!currentUser) return;

    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);

        // Set up authentication token
        const token = await currentUser.getIdToken();
        chatService.setToken(token);

        // Connect to socket with error handling
        try {
          socketService.connect(currentUser.uid);
        } catch (socketError) {
          console.warn('Socket connection failed, continuing without real-time features:', socketError);
          // Continue without socket - messages will still work via API
        }

        // Fetch conversations
        await loadConversations();

        // If userId is provided in URL, create or find match
        if (userId) {
          await handleUserMatch(userId);
        }

      } catch (err) {
        console.error('Error initializing chat:', err);
        setError('Failed to load conversations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initializeChat();

    // Cleanup socket on unmount
    return () => {
      try {
        socketService.disconnect();
      } catch (error) {
        console.warn('Error disconnecting socket:', error);
      }
    };
  }, [currentUser, userId]);

  // Load conversations from backend
  const loadConversations = async () => {
    try {
      const conversationsData = await chatService.getConversations();
      setConversations(conversationsData || []);

      // Load messages for each conversation
      const messagesData = {};
      if (conversationsData && conversationsData.length > 0) {
        for (const conv of conversationsData) {
          try {
            const messages = await chatService.getMatchMessages(conv.match_id);
            messagesData[conv.match_id] = (messages || []).map(msg => ({
              id: msg.id,
              sender: msg.sender_name,
              avatar: msg.sender_name?.charAt(0)?.toUpperCase() || 'U',
              content: msg.content,
              time: new Date(msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isOwn: msg.sender_firebase_uid === currentUser.uid,
              timestamp: msg.sent_at
            }));
          } catch (messageError) {
            console.warn(`Failed to load messages for conversation ${conv.match_id}:`, messageError);
            messagesData[conv.match_id] = [];
          }
        }
      }
      setMessagesByChat(messagesData);
    } catch (err) {
      console.error('Error loading conversations:', err);
      // Don't throw here, just set empty state
      setConversations([]);
      setMessagesByChat({});
    }
  };

  // Handle matching with a user (when coming from dashboard)
  const handleUserMatch = async (targetUserId) => {
    try {
      setCreatingMatch(true);
      
      // Check if match already exists
      const existingMatch = conversations.find(conv => 
        conv.other_user_id === targetUserId
      );

      if (existingMatch) {
        // Match exists, select it
        const matchIndex = conversations.findIndex(conv => conv.match_id === existingMatch.match_id);
        setSelectedChat(matchIndex);
        setTabValue(0); // Switch to conversations tab
        return;
      }

      // Create new match
      const newMatch = await chatService.createMatch(targetUserId);
      
      // Refresh conversations
      await loadConversations();
      
      // Select the new conversation
      const newMatchIndex = conversations.length; // New match will be at the end
      setSelectedChat(newMatchIndex);
      setTabValue(0);

      setSnackbar({
        open: true,
        message: 'Match created successfully!',
        severity: 'success'
      });

    } catch (err) {
      console.error('Error creating match:', err);
      setSnackbar({
        open: true,
        message: err.message || 'Failed to create match',
        severity: 'error'
      });
    } finally {
      setCreatingMatch(false);
    }
  };

  // Set up socket event listeners
  useEffect(() => {
    if (!socketService.isConnected || !conversations || conversations.length === 0) return;

    // Listen for new messages
    const handleNewMessage = (data) => {
      const { matchId, message, senderId, timestamp } = data;
      
      setMessagesByChat(prev => {
        const currentMessages = prev[matchId] || [];
        const newMessage = {
          id: Date.now(), // Temporary ID
          sender: senderId === currentUser.uid ? 'You' : conversations.find(c => c.match_id === matchId)?.display_name || 'User',
          avatar: senderId === currentUser.uid ? 'ME' : (conversations.find(c => c.match_id === matchId)?.display_name?.charAt(0)?.toUpperCase() || 'U'),
          content: message,
          time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: senderId === currentUser.uid,
          timestamp: timestamp
        };
        
        return {
          ...prev,
          [matchId]: [...currentMessages, newMessage]
        };
      });
    };

    // Listen for typing indicators
    const handleTyping = (data) => {
      // Implement typing indicator logic here
      console.log('Typing indicator:', data);
    };

    try {
      // Subscribe to events
      conversations.forEach(conv => {
        if (conv.match_id) {
          socketService.onNewMessage(conv.match_id, handleNewMessage);
          socketService.onTyping(conv.match_id, handleTyping);
        }
      });

      // Join chat rooms
      conversations.forEach(conv => {
        if (conv.match_id) {
          socketService.joinChat(conv.match_id);
        }
      });
    } catch (error) {
      console.warn('Error setting up socket listeners:', error);
    }

    return () => {
      try {
        // Cleanup listeners
        conversations.forEach(conv => {
          if (conv.match_id) {
            socketService.offNewMessage(conv.match_id, handleNewMessage);
            socketService.offTyping(conv.match_id, handleTyping);
            socketService.leaveChat(conv.match_id);
          }
        });
      } catch (error) {
        console.warn('Error cleaning up socket listeners:', error);
      }
    };
  }, [conversations, currentUser.uid]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!message.trim() || !conversations[selectedChat]) return;

    const currentConversation = conversations[selectedChat];
    const newMsg = {
      id: Date.now(),
      sender: "You",
      avatar: "ME",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      timestamp: new Date().toISOString()
    };

    // Optimistically add message to UI
    setMessagesByChat(prev => ({
      ...prev,
      [currentConversation.match_id]: [...(prev[currentConversation.match_id] || []), newMsg]
    }));

    const messageContent = message;
    setMessage(""); // Clear input immediately for better UX

    try {
      // Send message via socket if connected
      if (socketService.isConnected) {
        try {
          socketService.sendMessage(currentConversation.match_id, messageContent, currentUser.uid);
        } catch (socketError) {
          console.warn('Failed to send message via socket, falling back to API only:', socketError);
        }
      }
      
      // Always save to database
      await chatService.sendMessage(currentConversation.match_id, messageContent);
      
    } catch (err) {
      console.error('Error sending message:', err);
      
      // Remove the optimistically added message on error
      setMessagesByChat(prev => ({
        ...prev,
        [currentConversation.match_id]: (prev[currentConversation.match_id] || []).filter(msg => msg.id !== newMsg.id)
      }));
      
      // Restore the message in the input
      setMessage(messageContent);
      
      setSnackbar({
        open: true,
        message: 'Failed to send message. Please try again.',
        severity: 'error'
      });
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle chat selection
  const handleChatSelect = (index) => {
    setSelectedChat(index);
    setChatFadeKey(prev => prev + 1);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat, messagesByChat]);

  // Quick action buttons
  const quickActions = [
    { label: "👍 Great!", icon: <ThumbUp />, action: () => sendQuickMessage("👍 Great!") },
    { label: "👋 Hi there!", icon: <EmojiEmotions />, action: () => sendQuickMessage("👋 Hi there!") },
    { label: "📅 Schedule", icon: <ScheduleIcon />, action: () => sendQuickMessage("Let's schedule a session!") },
    { label: "📍 Location", icon: <LocationOn />, action: () => sendQuickMessage("📍 I'm available for in-person sessions") },
    { label: "✅ Confirmed", icon: <CheckCircle />, action: () => sendQuickMessage("✅ Confirmed!") },
    { label: "❓ Question", icon: <Search />, action: () => sendQuickMessage("❓ Do you have any questions?") }
  ];

  const sendQuickMessage = (content) => {
    setMessage(content);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading conversations...
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: { xs: 2, md: 3 },
      px: { xs: 1, md: 3 }
    }}>
      <Container maxWidth="xl" sx={{ height: 'calc(100vh - 100px)' }}>
        <Box sx={{ 
          display: 'flex', 
          height: '100%', 
          gap: 2,
          bgcolor: 'white',
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          {/* Conversations Sidebar */}
          <Box sx={{ 
            width: { xs: '100%', md: 350 }, 
            borderRight: '1px solid rgba(0,0,0,0.1)',
            display: { xs: tabValue === 0 ? 'block' : 'none', md: 'block' }
          }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <IconButton onClick={() => navigate('/dashboard')} sx={{ display: { md: 'none' } }}>
                  <ArrowBack />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Conversations
                </Typography>
              </Box>
              
              {/* Mobile tabs */}
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <Tab label="Conversations" />
                <Tab label="Discover" />
              </Tabs>
            </Box>

            {/* Conversations List */}
            {tabValue === 0 && (
              <Box sx={{ height: 'calc(100% - 100px)', overflowY: 'auto' }}>
                {conversations.length === 0 ? (
                  <Box sx={{ p: 4, textAlign: 'center' }}>
                    <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                      No conversations yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start matching with people to begin chatting!
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ p: 0 }}>
                    {conversations.map((conversation, index) => (
                      <ListItem 
                        key={conversation.match_id}
                        sx={{ 
                          px: 0, 
                          py: 1, 
                          cursor: 'pointer',
                          bgcolor: selectedChat === index ? 'rgba(102, 126, 234, 0.08)' : 'inherit'
                        }}
                        onClick={() => handleChatSelect(index)}
                      >
                        <ListItemButton sx={{ borderRadius: 2, mx: 1 }}>
                          <ListItemText 
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {conversation.display_name}
                                </Typography>
                                {conversation.unread_count > 0 && (
                                  <Badge badgeContent={conversation.unread_count} color="primary" />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {conversation.last_message_content || 'No messages yet'}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Box>
            )}

            {/* Discover Tab (for mobile) */}
            {tabValue === 1 && (
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Use the desktop version to discover new people.
                </Typography>
              </Box>
            )}
          </Box>

          {/* Chat Area */}
          <Box sx={{ 
            flex: 1, 
            display: { xs: tabValue === 0 ? 'none' : 'flex', md: 'flex' },
            flexDirection: 'column'
          }}>
            {conversations.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%',
                p: 4
              }}>
                <Person sx={{ fontSize: 120, color: 'text.secondary', mb: 3 }} />
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                  Welcome to MindMate Chat!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, textAlign: 'center' }}>
                  Start matching with people on the dashboard to begin conversations.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/dashboard')}
                  sx={{ 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4
                  }}
                >
                  Go to Dashboard
                </Button>
              </Box>
            ) : (
              <>
                {/* Chat Header */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {conversations[selectedChat]?.display_name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {conversations[selectedChat]?.display_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {conversations[selectedChat]?.user_type}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton onClick={() => setCallDialogOpen(true)}>
                      <VideoCall />
                    </IconButton>
                    <IconButton>
                      <MoreVert />
                    </IconButton>
                  </Box>
                </Box>

                {/* Messages Area */}
                <Box sx={{ 
                  flex: 1, 
                  overflowY: 'auto',
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Fade in={true} timeout={300} key={chatFadeKey}>
                    <Box>
                      {messagesByChat[conversations[selectedChat]?.match_id]?.map((msg, index) => (
                        <Box 
                          key={msg.id || index}
                          sx={{ 
                            display: 'flex',
                            justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                            mb: 2
                          }}
                        >
                          <Box sx={{ 
                            maxWidth: '70%',
                            bgcolor: msg.isOwn ? 'primary.main' : 'grey.100',
                            color: msg.isOwn ? 'white' : 'text.primary',
                            p: 2,
                            borderRadius: 3,
                            position: 'relative'
                          }}>
                            <Typography variant="body1">
                              {msg.content}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                opacity: 0.7,
                                display: 'block',
                                mt: 0.5
                              }}
                            >
                              {msg.time}
                            </Typography>
                          </Box>
                        </Box>
                      ))}
                      <div ref={messagesEndRef} />
                    </Box>
                  </Fade>
                </Box>

                {/* Message Input */}
                <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
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
                        }
                      }}
                    />
                    <IconButton 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      sx={{ 
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&.Mui-disabled': { bgcolor: 'grey.300' }
                      }}
                    >
                      <Send />
                    </IconButton>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Chat; 