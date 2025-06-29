import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person,
  LocationOn,
  School,
  Work,
  Message,
  Add,
  Info
} from '@mui/icons-material';
import chatService from '../services/chatService';
import { useAuth } from '../contexts/AuthContext';

const UserDiscovery = ({ onUserSelected, onMatchCreated }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creatingMatch, setCreatingMatch] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Set the token for API calls
      const token = await currentUser?.getIdToken();
      console.log('Setting token for loadUsers:', !!token);
      chatService.setToken(token);
      
      const usersData = await chatService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Error loading users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCreateMatch = async () => {
    if (!selectedUser) return;

    try {
      setCreatingMatch(true);
      
      // Ensure token is set before making the API call
      const token = await currentUser?.getIdToken();
      console.log('Setting token for createMatch:', !!token);
      chatService.setToken(token);
      
      const match = await chatService.createMatch(selectedUser.firebase_uid);
      
      setDialogOpen(false);
      setSelectedUser(null);
      
      // Notify parent component
      if (onMatchCreated) {
        onMatchCreated(match);
      }
      
      // Refresh users list
      loadUsers();
    } catch (err) {
      console.error('Error creating match:', err);
      setError('Failed to create match. Please try again.');
    } finally {
      setCreatingMatch(false);
    }
  };

  const handleStartChat = () => {
    if (onUserSelected && selectedUser) {
      onUserSelected(selectedUser);
    }
    setDialogOpen(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'primary.main' }}>
        Discover People
      </Typography>
      
      {users.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Person sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No users available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later to find people to connect with.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {users.map((user) => (
            <Grid item xs={12} md={6} lg={4} key={user.firebase_uid}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                  }
                }}
                onClick={() => handleUserClick(user)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar 
                      sx={{ 
                        width: 56, 
                        height: 56, 
                        bgcolor: 'primary.main',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        mr: 2
                      }}
                    >
                      {user.display_name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {user.display_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {user.bio && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {user.bio}
                    </Typography>
                  )}
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {user.user_type && (
                      <Chip 
                        label={user.user_type} 
                        size="small"
                        icon={user.user_type === 'teacher' ? <School /> : <Person />}
                        color={user.user_type === 'teacher' ? 'primary' : 'default'}
                      />
                    )}
                    {user.city && (
                      <Chip 
                        label={user.city} 
                        size="small"
                        icon={<LocationOn />}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* User Detail Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48, 
                bgcolor: 'primary.main',
                fontSize: '1.25rem',
                fontWeight: 700
              }}
            >
              {selectedUser?.display_name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedUser?.display_name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.email}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {selectedUser?.bio && (
            <Typography variant="body1" sx={{ mb: 2 }}>
              {selectedUser.bio}
            </Typography>
          )}
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {selectedUser?.user_type && (
              <Chip 
                label={selectedUser.user_type} 
                icon={selectedUser.user_type === 'teacher' ? <School /> : <Person />}
                color={selectedUser.user_type === 'teacher' ? 'primary' : 'default'}
              />
            )}
            {selectedUser?.city && (
              <Chip 
                label={selectedUser.city} 
                icon={<LocationOn />}
                variant="outlined"
              />
            )}
            {selectedUser?.country && (
              <Chip 
                label={selectedUser.country} 
                icon={<LocationOn />}
                variant="outlined"
              />
            )}
          </Box>
          
          <Typography variant="body2" color="text.secondary">
            Member since {new Date(selectedUser?.created_at).toLocaleDateString()}
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={handleCreateMatch}
            disabled={creatingMatch}
          >
            {creatingMatch ? 'Creating...' : 'Start Match'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDiscovery; 