import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar, 
  IconButton, 
  Badge,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Home, 
  Dashboard, 
  Person, 
  Chat, 
  Notifications,
  School,
  Menu as MenuIcon,
  Close,
  Logout,
  AccountCircle
} from '@mui/icons-material';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardPage from './pages/Dashboard';
import Profile from './pages/Profile';
import ChatPage from './pages/Chat';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const Navigation = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { currentUser, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home', icon: <Home /> },
    { path: '/dashboard', label: 'Dashboard', icon: <Dashboard />, protected: true },
    { path: '/chat', label: 'Chat', icon: <Chat />, protected: true },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleProfileMenuClose();
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ width: 280, pt: 2 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        px: 3, 
        py: 2,
        mb: 2
      }}>
        <School sx={{ 
          fontSize: 32,
          color: 'primary.main'
        }} />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 800,
            fontSize: '1.5rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          MindMate
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.path}
            component={Link}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 3,
              bgcolor: isActive(item.path) ? 'primary.main' : 'transparent',
              color: isActive(item.path) ? 'white' : 'text.primary',
              '&:hover': {
                bgcolor: isActive(item.path) ? 'primary.dark' : 'rgba(102, 126, 234, 0.08)',
                transform: 'translateX(4px)',
                transition: 'all 0.2s ease-in-out'
              },
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <ListItemIcon sx={{ 
              color: 'inherit',
              minWidth: 40
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                '& .MuiListItemText-primary': {
                  fontWeight: isActive(item.path) ? 600 : 500,
                  fontSize: '0.95rem'
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ 
            px: { xs: 1, md: 0 },
            py: { xs: 1, md: 1.5 },
            minHeight: { xs: 64, md: 72 }
          }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1.5,
              mr: { xs: 2, md: 4 }
            }}>
              <IconButton
                color="primary"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ 
                  mr: 2, 
                  display: { md: 'none' },
                  bgcolor: 'rgba(102, 126, 234, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.12)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <School sx={{ 
                fontSize: { xs: 28, md: 32 },
                color: 'primary.main'
              }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
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
              {navItems.map((item) => (
                <Fade key={item.path} in={true} timeout={300 + navItems.indexOf(item) * 100}>
                  <Button 
                    component={Link} 
                    to={item.path}
                    startIcon={item.icon}
                    sx={{ 
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: isActive(item.path) ? 'primary.main' : 'text.primary',
                      bgcolor: isActive(item.path) ? 'rgba(102, 126, 234, 0.08)' : 'transparent',
                      '&:hover': {
                        bgcolor: isActive(item.path) ? 'rgba(102, 126, 234, 0.12)' : 'rgba(102, 126, 234, 0.04)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    {item.label}
                  </Button>
                </Fade>
              ))}
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, md: 2 }
            }}>
              <IconButton 
                sx={{ 
                  bgcolor: 'rgba(102, 126, 234, 0.08)',
                  '&:hover': {
                    bgcolor: 'rgba(102, 126, 234, 0.12)',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications color="primary" />
                </Badge>
              </IconButton>
              
              {currentUser ? (
                <>
                  <Button 
                    component={Link} 
                    to="/profile"
                    startIcon={<Person />}
                    sx={{ 
                      borderRadius: 3,
                      px: { xs: 1.5, md: 2.5 },
                      py: { xs: 0.75, md: 1 },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: { xs: '0.85rem', md: '0.95rem' },
                      color: 'text.primary',
                      bgcolor: 'rgba(102, 126, 234, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.12)',
                        transform: 'translateY(-1px)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }}
                  >
                    Profile
                  </Button>
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{ 
                      bgcolor: 'rgba(102, 126, 234, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 0.12)'
                      }
                    }}
                  >
                    <AccountCircle color="primary" />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        borderRadius: 3,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        backdropFilter: 'blur(20px)'
                      }
                    }}
                  >
                    <MenuItem onClick={handleLogout} sx={{ gap: 1 }}>
                      <Logout fontSize="small" />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/login"
                  sx={{ 
                    borderRadius: 3,
                    px: { xs: 1.5, md: 2.5 },
                    py: { xs: 0.75, md: 1 },
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.85rem', md: '0.95rem' },
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)'
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

const AppContent = () => {
  return (
    <Router>
      <Box sx={{ 
        flexGrow: 1,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <Navigation />
        <Slide direction="up" in={true} timeout={500}>
          <Box>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/chat" element={
                <ProtectedRoute>
                  <ChatPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Box>
        </Slide>
      </Box>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
