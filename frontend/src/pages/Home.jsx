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
  Chip
} from '@mui/material';
import { 
  School, 
  People, 
  Chat, 
  Search, 
  Verified, 
  Star,
  ArrowForward,
  Psychology
} from '@mui/icons-material';

const Home = () => (
  <Box sx={{ minHeight: '100vh' }}>
    {/* Hero Section */}
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 6, md: 10 },
        px: { xs: 2, md: 0 },
        mb: { xs: 4, md: 8 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2,
                mb: 3
              }}
            >
              MindMate
            </Typography>
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                mb: 3, 
                opacity: 0.9,
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                lineHeight: 1.4
              }}
            >
              Connect, Learn, and Grow Together
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                fontSize: { xs: '1rem', md: '1.1rem' }, 
                opacity: 0.8,
                lineHeight: 1.6
              }}
            >
              Join a community of passionate learners and skilled teachers. Find your perfect match 
              to master new skills or share your expertise with others.
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              flexWrap: 'wrap',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Button 
                variant="contained" 
                size="large" 
                href="/register"
                sx={{ 
                  bgcolor: 'white', 
                  color: '#667eea',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Get Started
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                href="/dashboard"
                sx={{ 
                  borderColor: 'white', 
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': { 
                    borderColor: 'white', 
                    bgcolor: 'rgba(255,255,255,0.1)' 
                  }
                }}
              >
                Explore Skills
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ 
              textAlign: 'center',
              display: { xs: 'none', md: 'block' }
            }}>
              <Psychology sx={{ 
                fontSize: { md: 200, lg: 250 }, 
                opacity: 0.3,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
              }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>

    {/* Features Section */}
    <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 10 }, px: { xs: 2, md: 0 } }}>
      <Typography 
        variant="h3" 
        align="center" 
        gutterBottom 
        sx={{ 
          mb: { xs: 4, md: 6 }, 
          fontWeight: 'bold',
          fontSize: { xs: '2rem', md: '2.5rem' }
        }}
      >
        Why Choose MindMate?
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            textAlign: 'center', 
            p: 3,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
            }
          }}>
            <Avatar sx={{ 
              bgcolor: '#667eea', 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 3,
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
            }}>
              <Search fontSize="large" />
            </Avatar>
            <CardContent sx={{ px: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Smart Matching
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Our intelligent algorithm connects you with the perfect teacher or student based on your skills and learning goals.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            textAlign: 'center', 
            p: 3,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
            }
          }}>
            <Avatar sx={{ 
              bgcolor: '#764ba2', 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 3,
              boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)'
            }}>
              <Verified fontSize="large" />
            </Avatar>
            <CardContent sx={{ px: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Verified Teachers
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                All teachers go through our verification process to ensure quality education and reliable expertise.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%', 
            textAlign: 'center', 
            p: 3,
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
            }
          }}>
            <Avatar sx={{ 
              bgcolor: '#f093fb', 
              width: 80, 
              height: 80, 
              mx: 'auto', 
              mb: 3,
              boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
            }}>
              <Chat fontSize="large" />
            </Avatar>
            <CardContent sx={{ px: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Interactive Learning
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>
                Connect through chat, video calls, and interactive sessions to make learning engaging and effective.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>

    {/* Stats Section */}
    <Box sx={{ 
      bgcolor: '#f8f9fa', 
      py: { xs: 6, md: 8 }, 
      mb: { xs: 6, md: 10 },
      px: { xs: 2, md: 0 }
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} textAlign="center">
          <Grid item xs={6} md={3}>
            <Typography 
              variant="h3" 
              color="primary" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              10K+
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Active Learners
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography 
              variant="h3" 
              color="primary" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              500+
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Verified Teachers
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography 
              variant="h3" 
              color="primary" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              50+
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Skill Categories
            </Typography>
          </Grid>
          <Grid item xs={6} md={3}>
            <Typography 
              variant="h3" 
              color="primary" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2rem', md: '3rem' }
              }}
            >
              95%
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
              Success Rate
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>

    {/* Popular Skills */}
    <Container maxWidth="lg" sx={{ mb: { xs: 6, md: 10 }, px: { xs: 2, md: 0 } }}>
      <Typography 
        variant="h4" 
        align="center" 
        gutterBottom 
        sx={{ 
          mb: { xs: 3, md: 4 }, 
          fontWeight: 'bold',
          fontSize: { xs: '1.75rem', md: '2.25rem' }
        }}
      >
        Popular Skills to Learn
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        justifyContent: 'center',
        px: { xs: 1, md: 0 }
      }}>
        {['Programming', 'Design', 'Marketing', 'Languages', 'Music', 'Cooking', 'Fitness', 'Business'].map((skill) => (
          <Chip 
            key={skill}
            label={skill}
            variant="outlined"
            sx={{ 
              fontSize: { xs: '0.9rem', md: '1.1rem' }, 
              p: { xs: 1, md: 1.5 },
              height: { xs: 32, md: 40 },
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
    </Container>

    {/* CTA Section */}
    <Box sx={{ 
      bgcolor: 'primary.main', 
      color: 'white', 
      py: { xs: 6, md: 8 },
      px: { xs: 2, md: 0 }
    }}>
      <Container maxWidth="md" textAlign="center">
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '1.75rem', md: '2.25rem' },
            mb: 3
          }}
        >
          Ready to Start Your Learning Journey?
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            mb: 4, 
            fontSize: { xs: '1rem', md: '1.1rem' },
            opacity: 0.9,
            lineHeight: 1.6
          }}
        >
          Join thousands of learners who are already improving their skills with MindMate.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          href="/register"
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            px: 5,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            '&:hover': { 
              bgcolor: '#f5f5f5',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 25px rgba(0,0,0,0.25)'
            }
          }}
        >
          Join Now <ArrowForward sx={{ ml: 1 }} />
        </Button>
      </Container>
    </Box>
  </Box>
);

export default Home; 