import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  IconButton, 
  Badge,
  Container
} from '@mui/material';
import { 
  Home, 
  Dashboard, 
  Person, 
  Chat, 
  Notifications,
  School
} from '@mui/icons-material';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/Dashboard';
import Profile from './pages/Profile';
import ChatPage from './pages/Chat';

const App = () => {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="static" 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Container maxWidth="lg">
            <Toolbar sx={{ 
              px: { xs: 1, md: 0 },
              py: { xs: 1, md: 1.5 }
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                mr: { xs: 2, md: 4 }
              }}>
                <School sx={{ 
                  fontSize: { xs: 28, md: 32 },
                  color: 'white'
                }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    color: 'white'
                  }}
                >
                  MindMate
                </Typography>
              </Box>

              <Box sx={{ 
                flexGrow: 1, 
                display: { xs: 'none', md: 'flex' },
                gap: 1
              }}>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/"
                  startIcon={<Home />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/dashboard"
                  startIcon={<Dashboard />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/chat"
                  startIcon={<Chat />}
                  sx={{ 
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Chat
                </Button>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 1, md: 2 }
              }}>
                <IconButton 
                  color="inherit"
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <Notifications />
                  </Badge>
                </IconButton>
                
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/profile"
                  startIcon={<Person />}
                  sx={{ 
                    borderRadius: 2,
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 0.75, md: 1 },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Profile
                </Button>

                <Button 
                  variant="outlined" 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    borderRadius: 2,
                    px: { xs: 1.5, md: 2 },
                    py: { xs: 0.75, md: 1 },
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  Login
                </Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
