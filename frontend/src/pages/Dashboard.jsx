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
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: { xs: 3, md: 4 },
      px: { xs: 2, md: 0 }
    }}>
      <Container maxWidth="lg">
        {/* Welcome Section */}
        <Box sx={{ 
          mb: { xs: 4, md: 6 },
          textAlign: { xs: 'center', md: 'left' }
        }}>
          <Typography 
            variant="h3" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2rem', md: '2.5rem' },
              mb: 2,
              color: 'primary.main'
            }}
          >
            Welcome back, User! 👋
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6,
              maxWidth: 600
            }}
          >
            Ready to learn something new today? Here are your matches and trending skills.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Matches Section */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 4
              }}>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '1.25rem', md: '1.5rem' }
                  }}
                >
                  Your Matches
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  View All
                </Button>
              </Box>
              
              <List sx={{ p: 0 }}>
                {mockMatches.map((match, index) => (
                  <React.Fragment key={match.id}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemButton 
                        sx={{ 
                          borderRadius: 3, 
                          mb: 1,
                          p: 2,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            bgcolor: 'rgba(102, 126, 234, 0.08)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }
                        }}
                      >
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
                                  bgcolor: match.isOnline ? 'success.main' : 'grey.400',
                                  border: '2px solid white'
                                }}
                              />
                            }
                          >
                            <Avatar 
                              sx={{ 
                                width: 56, 
                                height: 56, 
                                bgcolor: 'primary.main',
                                fontSize: '1.25rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {match.avatar}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1,
                              mb: 1
                            }}>
                              <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                  fontWeight: 'bold',
                                  fontSize: '1.1rem'
                                }}
                              >
                                {match.name}
                              </Typography>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5 
                              }}>
                                <Star sx={{ 
                                  fontSize: 18, 
                                  color: 'warning.main' 
                                }} />
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ fontWeight: 'bold' }}
                                >
                                  {match.rating}
                                </Typography>
                              </Box>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1, 
                                mb: 1.5 
                              }}>
                                <LocationOn sx={{ 
                                  fontSize: 16, 
                                  color: 'text.secondary' 
                                }} />
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {match.location}
                                </Typography>
                              </Box>
                              <Box sx={{ 
                                display: 'flex', 
                                flexWrap: 'wrap', 
                                gap: 0.5 
                              }}>
                                {match.skills.slice(0, 3).map((skill) => (
                                  <Chip 
                                    key={skill} 
                                    label={skill} 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ 
                                      fontSize: '0.75rem',
                                      height: 24,
                                      '&:hover': {
                                        bgcolor: 'primary.main',
                                        color: 'white'
                                      }
                                    }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          }
                        />
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1,
                          flexDirection: { xs: 'column', sm: 'row' }
                        }}>
                          <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<Message />}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              minWidth: 80
                            }}
                          >
                            Chat
                          </Button>
                          <Button 
                            variant="contained" 
                            size="small"
                            startIcon={<VideoCall />}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none',
                              minWidth: 80,
                              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                            }}
                          >
                            Call
                          </Button>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                    {index < mockMatches.length - 1 && (
                      <Divider sx={{ my: 1, opacity: 0.3 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Search & Quick Actions */}
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              {/* Search Section */}
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      mb: 3
                    }}
                  >
                    Search Skills & Teachers
                  </Typography>
                  <TextField
                    fullWidth
                    placeholder="Search for skills or teachers..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                      }
                    }}
                  />
                  <Button 
                    variant="contained" 
                    fullWidth
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      fontWeight: 'bold',
                      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                      '&:hover': {
                        boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)'
                      }
                    }}
                  >
                    Search
                  </Button>
                </Paper>
              </Grid>

              {/* Popular Skills */}
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      mb: 3
                    }}
                  >
                    Trending Skills
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1 
                  }}>
                    {popularSkills.map((skill) => (
                      <Chip 
                        key={skill}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          height: 28,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': { 
                            bgcolor: 'primary.main', 
                            color: 'white',
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Paper>
              </Grid>

              {/* Quick Stats */}
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      mb: 3
                    }}
                  >
                    Your Progress
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 3 
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: 2
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Skills Learned
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'primary.main'
                        }}
                      >
                        12
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                      borderRadius: 2
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Sessions Completed
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'primary.main'
                        }}
                      >
                        28
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      p: 2,
                      bgcolor: 'rgba(76, 175, 80, 0.05)',
                      borderRadius: 2
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Streak
                      </Typography>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          fontWeight: 'bold', 
                          color: 'success.main' 
                        }}
                      >
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
    </Box>
  );
};

export default Dashboard; 