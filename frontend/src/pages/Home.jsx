import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Avatar,
  Paper,
  Chip,
  Fade,
  Slide,
  Grow,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  School, 
  People, 
  Chat, 
  Search, 
  Verified, 
  Star,
  ArrowForward,
  Psychology,
  TrendingUp,
  Lightbulb,
  Group
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Search />,
      title: "Smart Matching",
      description: "Our intelligent algorithm connects you with the perfect teacher or student based on your skills and learning goals.",
      color: "#667eea"
    },
    {
      icon: <People />,
      title: "Community Learning",
      description: "Join a vibrant community of learners and educators. Share knowledge, collaborate, and grow together.",
      color: "#764ba2"
    },
    {
      icon: <Chat />,
      title: "Interactive Sessions",
      description: "Engage in real-time conversations, video calls, and collaborative learning sessions with your matches.",
      color: "#f093fb"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Learners", icon: <People /> },
    { number: "500+", label: "Expert Teachers", icon: <School /> },
    { number: "50+", label: "Skills Available", icon: <Lightbulb /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp /> }
  ];

  const BOX_WIDTH = 480;
  const BOX_HEIGHT = 260;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: { xs: 2, md: 0 },
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)'
        }} />
        
        <Container maxWidth="lg" sx={{ width: '100%' }}>
          <Grid container spacing={6} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={800}>
                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                  <Typography 
                    variant="h1" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 900,
                      fontSize: { xs: '2.5rem', md: '4rem', lg: '4.5rem' },
                      lineHeight: 1.1,
                      mb: 3,
                      background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    MindMate
                  </Typography>
                  <Typography 
                    variant="h4" 
                    gutterBottom 
                    sx={{ 
                      mb: 3, 
                      opacity: 0.95,
                      fontSize: { xs: '1.25rem', md: '1.75rem' },
                      lineHeight: 1.3,
                      fontWeight: 300
                    }}
                  >
                    Connect, Learn, and Grow Together
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      mb: 5, 
                      fontSize: { xs: '1.1rem', md: '1.25rem' }, 
                      opacity: 0.9,
                      lineHeight: 1.6,
                      fontWeight: 300
                    }}
                  >
                    Join a community of passionate learners and skilled teachers. Find your perfect match 
                    to master new skills or share your expertise with others.
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 3, 
                    flexWrap: 'wrap',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: { xs: 'center', md: 'flex-start' }
                  }}>
                    {currentUser ? (
                      <Grow in={true} timeout={1000}>
                        <Button 
                          variant="contained" 
                          size="large" 
                          onClick={() => navigate('/dashboard')}
                          endIcon={<TrendingUp />}
                          sx={{ 
                            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            px: 5,
                            py: 2.5,
                            fontSize: '1.2rem',
                            fontWeight: 800,
                            borderRadius: 4,
                            boxShadow: '0 8px 32px rgba(102,126,234,0.18)',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                            transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                            '&:hover': { 
                              bgcolor: 'white',
                              color: '#667eea',
                              boxShadow: '0 12px 40px rgba(102,126,234,0.28)',
                              transform: 'translateY(-2px) scale(1.03)',
                              transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
                            },
                            '& .MuiButton-endIcon': {
                              transition: 'color 0.3s cubic-bezier(.4,2,.6,1)',
                            },
                            '&:hover .MuiButton-endIcon': {
                              color: '#667eea',
                            }
                          }}
                        >
                          Explore Trending Skills
                        </Button>
                      </Grow>
                    ) : (
                      <>
                        <Grow in={true} timeout={1000}>
                          <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => navigate('/register')}
                            endIcon={<ArrowForward />}
                            sx={{ 
                              bgcolor: 'white', 
                              color: '#667eea',
                              px: 4,
                              py: 2,
                              fontSize: '1.1rem',
                              fontWeight: 700,
                              borderRadius: 3,
                              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                              '&:hover': { 
                                bgcolor: '#f8f9fa',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.3)'
                              },
                              transition: 'all 0.3s ease-in-out'
                            }}
                          >
                            Get Started
                          </Button>
                        </Grow>
                        <Grow in={true} timeout={1200}>
                          <Button 
                            variant="outlined" 
                            size="large"
                            onClick={() => navigate('/dashboard')}
                            sx={{ 
                              borderColor: 'rgba(255,255,255,0.5)', 
                              color: 'white',
                              px: 4,
                              py: 2,
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              borderRadius: 3,
                              borderWidth: 2,
                              transition: 'all 0.3s cubic-bezier(.4,2,.6,1)',
                              '&:hover': { 
                                bgcolor: 'white',
                                color: '#667eea',
                                borderColor: '#667eea',
                                boxShadow: '0 12px 40px rgba(102,126,234,0.18)',
                                transform: 'translateY(-2px)',
                                transition: 'all 0.3s cubic-bezier(.4,2,.6,1)'
                              },
                            }}
                          >
                            Explore Skills
                          </Button>
                        </Grow>
                      </>
                    )}
                  </Box>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={6}>
              <Fade in={true} timeout={1000}>
                <Box sx={{ 
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Box sx={{
                    position: 'relative',
                    display: 'inline-block'
                  }}>
                    <Psychology sx={{ 
                      fontSize: { xs: 200, md: 300, lg: 350 }, 
                      opacity: 0.2,
                      filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))',
                      animation: 'float 6s ease-in-out infinite'
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: { xs: 150, md: 200 },
                      height: { xs: 150, md: 200 },
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                      animation: 'pulse 4s ease-in-out infinite'
                    }} />
                  </Box>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ 
        py: { xs: 6, md: 8 }, 
        px: { xs: 2, md: 0 },
        width: '100%'
      }}>
        <Grid container spacing={4} justifyContent="center">
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Grow in={true} timeout={800 + index * 200}>
                <Card sx={{ 
                  textAlign: 'center', 
                  p: 3,
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }
                }}>
                  <Avatar sx={{ 
                    bgcolor: 'primary.main', 
                    width: 60, 
                    height: 60, 
                    mx: 'auto', 
                    mb: 2,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}>
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 900,
                    color: 'primary.main',
                    mb: 1
                  }}>
                    {stat.number}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}>
                    {stat.label}
                  </Typography>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ 
        mb: { xs: 8, md: 12 }, 
        px: { xs: 2, md: 0 },
        width: '100%'
      }}>
        <Fade in={true} timeout={800}>
          <Typography 
            variant="h2" 
            align="center" 
            gutterBottom 
            sx={{ 
              mb: { xs: 6, md: 8 }, 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Why Choose MindMate?
          </Typography>
        </Fade>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow in={true} timeout={800 + index * 200}>
                <Card sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 4,
                  borderRadius: 4,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
                  }
                }}>
                  <Avatar sx={{ 
                    bgcolor: feature.color, 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 3,
                    boxShadow: `0 8px 24px ${feature.color}40`
                  }}>
                    {feature.icon}
                  </Avatar>
                  <CardContent sx={{ px: 2 }}>
                    <Typography variant="h5" gutterBottom sx={{ 
                      fontWeight: 700, 
                      mb: 2,
                      color: 'text.primary'
                    }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ 
                      lineHeight: 1.7,
                      fontSize: '1rem'
                    }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        py: { xs: 8, md: 12 },
        px: { xs: 2, md: 0 },
        borderTop: '1px solid rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Container maxWidth="md" sx={{ width: '100%' }}>
          <Fade in={true} timeout={800}>
            <Box textAlign="center">
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 3,
                  color: 'text.primary'
                }}
              >
                Ready to Start Learning?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 5, 
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  fontWeight: 400
                }}
              >
                Join thousands of learners and teachers who are already transforming their skills and knowledge.
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                href="/register"
                endIcon={<ArrowForward />}
                sx={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 6,
                  py: 2.5,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease-in-out'
                }}
              >
                Join MindMate Today
              </Button>
            </Box>
          </Fade>
        </Container>
      </Box>

      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          @keyframes pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.3; }
          }
        `}
      </style>
    </Box>
  );
};

export default Home; 