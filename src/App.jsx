import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import IconButton from '@mui/material/IconButton';
import { 
  Notifications, 
  School, 
  Message, 
  Person, 
  Dashboard as DashboardIcon,
  Home as HomeIcon
} from '@mui/icons-material';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Chat from './pages/Chat';

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar 
          position="static" 
          sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}
        >
          <Toolbar>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <School sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                MindMate
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                startIcon={<HomeIcon />}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2
                  }
                }}
              >
                Home
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/dashboard"
                startIcon={<DashboardIcon />}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2
                  }
                }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/profile"
                startIcon={<Person />}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2
                  }
                }}
              >
                Profile
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/chat"
                startIcon={<Message />}
                sx={{ 
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderRadius: 2
                  }
                }}
              >
                Chat
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
              <IconButton color="inherit">
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <Avatar 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: 'rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                }}
              >
                JD
              </Avatar>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
              <Button 
                variant="outlined" 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{ 
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': { 
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/register"
                sx={{ 
                  bgcolor: 'white', 
                  color: '#667eea',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 2 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
