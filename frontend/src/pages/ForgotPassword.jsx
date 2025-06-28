import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  InputAdornment,
  Alert,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Link,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Email, 
  School,
  ArrowBack,
  Send,
  Security,
  Lightbulb,
  Psychology,
  TrendingUp
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import geminiService from '../services/geminiService';

const schema = yup.object({
  email: yup.string().email('Please enter a valid email').required('Email is required'),
}).required();

const ForgotPassword = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [aiSuggestions, setAiSuggestions] = React.useState(null);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema)
  });

  const watchedEmail = watch('email');

  const onSubmit = async (data) => {
    try {
      setError('');
      setSuccess(false);
      setAiSuggestions(null);
      setShowSuggestions(false);
      setLoading(true);
      
      await resetPassword(data.email);
      setSuccess(true);
      
      // Get AI suggestions after successful password reset
      try {
        const suggestions = await geminiService.getPasswordResetSuggestions(data.email);
        setAiSuggestions(suggestions);
        setShowSuggestions(true);
      } catch (aiError) {
        console.error('AI suggestions error:', aiError);
        // Continue without AI suggestions
      }
    } catch (error) {
      console.error('Password reset error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Too many password reset attempts. Please try again later.');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: { xs: 4, md: 8 },
      px: { xs: 2, md: 0 },
      display: 'flex',
      alignItems: 'center'
    }}>
      <Container maxWidth="sm">
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 4,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background Pattern */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.03,
              background: 'radial-gradient(circle at 20% 80%, #667eea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #764ba2 0%, transparent 50%)'
            }} />

            <Box textAlign="center" sx={{ mb: { xs: 4, md: 5 }, position: 'relative' }}>
              <Grow in={true} timeout={1000}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 1.5,
                  mb: 3
                }}>
                  <School sx={{ 
                    fontSize: { xs: 32, md: 40 },
                    color: 'primary.main'
                  }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      fontSize: { xs: '1.75rem', md: '2.5rem' },
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    MindMate
                  </Typography>
                </Box>
              </Grow>
              <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700, 
                  color: 'text.primary',
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  mb: 2
                }}
              >
                Reset Password
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.95rem', md: '1.1rem' },
                  lineHeight: 1.5,
                  fontWeight: 400
                }}
              >
                Enter your email address and we'll send you a link to reset your password
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Password reset email sent! Please check your inbox and follow the instructions.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ position: 'relative' }}>
              <Grow in={true} timeout={1200}>
                <TextField 
                  label="Email Address" 
                  type="email" 
                  fullWidth 
                  margin="normal" 
                  required
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    mb: 4,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: 'rgba(255, 255, 255, 0.8)',
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      }
                    }
                  }}
                />
              </Grow>

              <Grow in={true} timeout={1400}>
                <Button 
                  type="submit"
                  variant="contained" 
                  color="primary" 
                  fullWidth 
                  size="large"
                  disabled={loading || success}
                  endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  sx={{ 
                    py: 2, 
                    mb: 4,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      background: 'rgba(0, 0, 0, 0.12)',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  {loading ? 'Sending...' : success ? 'Email Sent!' : 'Send Reset Link'}
                </Button>
              </Grow>

              {/* AI Suggestions */}
              {showSuggestions && aiSuggestions && (
                <Grow in={true} timeout={1600}>
                  <Card sx={{ 
                    mb: 4, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Lightbulb sx={{ color: 'primary.main', mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          AI-Powered Suggestions
                        </Typography>
                      </Box>
                      
                      <List dense>
                        <ListItem>
                          <ListItemIcon>
                            <Security color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Security Tips" 
                            secondary={aiSuggestions.securityTips}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItem>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <ListItem>
                          <ListItemIcon>
                            <Lightbulb color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Password Suggestions" 
                            secondary={aiSuggestions.passwordSuggestions}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItem>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <ListItem>
                          <ListItemIcon>
                            <Psychology color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Memory Tips" 
                            secondary={aiSuggestions.memoryTips}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItem>
                        
                        <Divider sx={{ my: 1 }} />
                        
                        <ListItem>
                          <ListItemIcon>
                            <TrendingUp color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary="Motivation" 
                            secondary={aiSuggestions.motivation}
                            primaryTypographyProps={{ fontWeight: 600 }}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grow>
              )}

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Remember your password?{' '}
                  <Link 
                    href="/login" 
                    sx={{ 
                      textDecoration: 'none',
                      color: 'primary.main',
                      fontWeight: 600,
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign in
                  </Link>
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/login')}
                  sx={{ 
                    textTransform: 'none',
                    color: 'text.secondary',
                    fontWeight: 600,
                    '&:hover': {
                      color: 'primary.main',
                      bgcolor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                >
                  Back to Login
                </Button>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ForgotPassword; 