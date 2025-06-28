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
  <Box>
    {/* Hero Section */}
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        mb: 6
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              MindMate
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, opacity: 0.9 }}>
              Connect, Learn, and Grow Together
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem', opacity: 0.8 }}>
              Join a community of passionate learners and skilled teachers. Find your perfect match 
              to master new skills or share your expertise with others.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                size="large" 
                href="/register"
                sx={{ 
                  bgcolor: 'white', 
                  color: '#667eea',
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
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Explore Skills
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ textAlign: 'center' }}>
              <Psychology sx={{ fontSize: 200, opacity: 0.3 }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>

    {/* Features Section */}
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
        Why Choose MindMate?
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: '#667eea', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <Search fontSize="large" />
            </Avatar>
            <CardContent>
              <Typography variant="h5" gutterBottom>Smart Matching</Typography>
              <Typography color="text.secondary">
                Our intelligent algorithm connects you with the perfect teacher or student based on your skills and learning goals.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: '#764ba2', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <Verified fontSize="large" />
            </Avatar>
            <CardContent>
              <Typography variant="h5" gutterBottom>Verified Teachers</Typography>
              <Typography color="text.secondary">
                All teachers go through our verification process to ensure quality education and reliable expertise.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center', p: 2 }}>
            <Avatar sx={{ bgcolor: '#f093fb', width: 80, height: 80, mx: 'auto', mb: 2 }}>
              <Chat fontSize="large" />
            </Avatar>
            <CardContent>
              <Typography variant="h5" gutterBottom>Interactive Learning</Typography>
              <Typography color="text.secondary">
                Connect through chat, video calls, and interactive sessions to make learning engaging and effective.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>

    {/* Stats Section */}
    <Box sx={{ bgcolor: '#f8f9fa', py: 6, mb: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} textAlign="center">
          <Grid item xs={12} md={3}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>10K+</Typography>
            <Typography variant="h6" color="text.secondary">Active Learners</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>500+</Typography>
            <Typography variant="h6" color="text.secondary">Verified Teachers</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>50+</Typography>
            <Typography variant="h6" color="text.secondary">Skill Categories</Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold' }}>95%</Typography>
            <Typography variant="h6" color="text.secondary">Success Rate</Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>

    {/* Popular Skills */}
    <Container maxWidth="lg" sx={{ mb: 8 }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Popular Skills to Learn
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
        {['Programming', 'Design', 'Marketing', 'Languages', 'Music', 'Cooking', 'Fitness', 'Business'].map((skill) => (
          <Chip 
            key={skill}
            label={skill}
            variant="outlined"
            sx={{ 
              fontSize: '1.1rem', 
              p: 1,
              '&:hover': { bgcolor: 'primary.main', color: 'white' }
            }}
          />
        ))}
      </Box>
    </Container>

    {/* CTA Section */}
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6 }}>
      <Container maxWidth="md" textAlign="center">
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Ready to Start Your Learning Journey?
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, fontSize: '1.1rem' }}>
          Join thousands of learners who are already improving their skills with MindMate.
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          href="/register"
          sx={{ 
            bgcolor: 'white', 
            color: 'primary.main',
            px: 4,
            py: 1.5,
            fontSize: '1.1rem',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          Join Now <ArrowForward sx={{ ml: 1 }} />
        </Button>
      </Container>
    </Box>
  </Box>
);

export default Home; 