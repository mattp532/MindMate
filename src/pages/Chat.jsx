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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8, height: '80vh' }}>
      <Paper elevation={3} sx={{ height: '100%', display: 'flex', borderRadius: 3, overflow: 'hidden' }}>
        {/* Chat List Sidebar */}
        <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Conversations
            </Typography>
          </Box>
          
          <List sx={{ p: 0 }}>
            {chats.map((chat, index) => (
              <ListItem 
                key={chat.id}
                button
                selected={selectedChat === index}
                onClick={() => setSelectedChat(index)}
                sx={{ 
                  borderBottom: 1, 
                  borderColor: 'divider',
                  '&.Mui-selected': { bgcolor: 'primary.light' }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        {chat.name}
                      </Typography>
                      {chat.unread > 0 && (
                        <Chip 
                          label={chat.unread} 
                          size="small" 
                          color="primary"
                          sx={{ height: 20, fontSize: '0.75rem' }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {chat.lastMessage}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
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
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: chat.isOnline ? 'success.main' : 'grey.400'
                      }}
                    />
                  }
                >
                  <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
                    {chat.avatar}
                  </Avatar>
                </Badge>
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Chat Messages */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Chat Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: 1, 
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            gap: 2
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
                    bgcolor: chats[selectedChat]?.isOnline ? 'success.main' : 'grey.400'
                  }}
                />
              }
            >
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                {chats[selectedChat]?.avatar}
              </Avatar>
            </Badge>
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {chats[selectedChat]?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {chats[selectedChat]?.isOnline ? 'Online' : 'Offline'}
              </Typography>
            </Box>
            <IconButton size="small">
              <VideoCall />
            </IconButton>
            <IconButton size="small">
              <Phone />
            </IconButton>
            <IconButton size="small">
              <MoreVert />
            </IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            p: 2,
            bgcolor: '#f8f9fa'
          }}>
            {messages.map((msg) => (
              <Box 
                key={msg.id}
                sx={{ 
                  display: 'flex', 
                  justifyContent: msg.isOwn ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-end',
                  gap: 1,
                  maxWidth: '70%'
                }}>
                  {!msg.isOwn && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                      {msg.avatar}
                    </Avatar>
                  )}
                  <Box>
                    <Paper 
                      elevation={1}
                      sx={{ 
                        p: 2,
                        bgcolor: msg.isOwn ? 'primary.main' : 'white',
                        color: msg.isOwn ? 'white' : 'text.primary',
                        borderRadius: 3,
                        maxWidth: '100%'
                      }}
                    >
                      <Typography variant="body2">
                        {msg.content}
                      </Typography>
                    </Paper>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ ml: 1, mt: 0.5, display: 'block' }}
                    >
                      {msg.time}
                    </Typography>
                  </Box>
                  {msg.isOwn && (
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                      {msg.avatar}
                    </Avatar>
                  )}
                </Box>
              </Box>
            ))}
          </Box>

          {/* Message Input */}
          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <IconButton size="small">
                <AttachFile />
              </IconButton>
              <IconButton size="small">
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
                    bgcolor: 'white'
                  }
                }}
              />
              <IconButton 
                color="primary"
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <Send />
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat; 