import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  InputAdornment,
  Badge
} from '@mui/material';
import { 
  Search, 
  Person, 
  Star, 
  LocationOn, 
  School,
  TrendingUp,
  Message,
  VideoCall
} from '@mui/icons-material';

const Dashboard = () => {
  // Mock data for demonstration
  const mockMatches = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "SJ",
      skills: ["JavaScript", "React", "Node.js"],
      rating: 4.8,
      location: "New York, NY",
      isOnline: true
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "MC",
      skills: ["Python", "Data Science", "Machine Learning"],
      rating: 4.9,
      location: "San Francisco, CA",
      isOnline: false
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "ED",
      skills: ["UI/UX Design", "Figma", "Adobe Creative Suite"],
      rating: 4.7,
      location: "Austin, TX",
      isOnline: true
    }
  ];

  const popularSkills = [
    "JavaScript", "Python", "React", "Node.js", "Data Science", 
    "UI/UX Design", "Machine Learning", "Graphic Design"
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Welcome back, User! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready to learn something new today? Here are your matches and trending skills.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Matches Section */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Your Matches
              </Typography>
              <Button variant="outlined" size="small">
                View All
              </Button>
            </Box>
            
            <List>
              {mockMatches.map((match, index) => (
                <React.Fragment key={match.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemButton sx={{ borderRadius: 2, mb: 1 }}>
                      <ListItemAvatar>
                        <Badge
                          overlap="circular"
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                          badgeContent={
                            <Box
                              sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: match.isOnline ? 'success.main' : 'grey.400'
                              }}
                            />
                          }
                        >
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {match.avatar}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {match.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Star sx={{ fontSize: 16, color: 'warning.main' }} />
                              <Typography variant="body2" color="text.secondary">
                                {match.rating}
                              </Typography>
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {match.location}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {match.skills.slice(0, 3).map((skill) => (
                                <Chip 
                                  key={skill} 
                                  label={skill} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ fontSize: '0.75rem' }}
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          size="small"
                          startIcon={<Message />}
                        >
                          Chat
                        </Button>
                        <Button 
                          variant="contained" 
                          size="small"
                          startIcon={<VideoCall />}
                        >
                          Call
                        </Button>
                      </Box>
                    </ListItemButton>
                  </ListItem>
                  {index < mockMatches.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Search & Quick Actions */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            {/* Search Section */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Search Skills & Teachers
                </Typography>
                <TextField
                  fullWidth
                  placeholder="Search for skills or teachers..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <Button variant="contained" fullWidth>
                  Search
                </Button>
              </Paper>
            </Grid>

            {/* Popular Skills */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Trending Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {popularSkills.map((skill) => (
                    <Chip 
                      key={skill}
                      label={skill}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': { bgcolor: 'primary.main', color: 'white' }
                      }}
                    />
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Your Progress
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Skills Learned
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      12
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Sessions Completed
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      28
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Current Streak
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      7 days
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 