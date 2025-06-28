import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Divider,
  Link,
  InputAdornment,
  Alert
} from '@mui/material';
import { 
  Email, 
  Lock, 
  Google, 
  Facebook,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: { xs: 4, md: 8 },
      px: { xs: 2, md: 0 }
    }}>
      <Container maxWidth="sm">
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 4,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box textAlign="center" sx={{ mb: { xs: 3, md: 4 } }}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold', 
                color: 'primary.main',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                mb: 1
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.5
              }}
            >
              Sign in to continue your learning journey
            </Typography>
          </Box>

          <Box component="form" noValidate autoComplete="off">
            <TextField 
              label="Email Address" 
              type="email" 
              fullWidth 
              margin="normal" 
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
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
            
            <TextField 
              label="Password" 
              type={showPassword ? 'text' : 'password'} 
              fullWidth 
              margin="normal" 
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ 
                        minWidth: 'auto', 
                        p: 0,
                        color: 'text.secondary',
                        '&:hover': {
                          bgcolor: 'transparent',
                          color: 'primary.main'
                        }
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
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

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 2, sm: 0 }
            }}>
              <Link 
                href="#" 
                variant="body2" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Forgot password?
              </Link>
              <Link 
                href="/register" 
                variant="body2" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Don't have an account? Sign up
              </Link>
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              size="large"
              sx={{ 
                py: 1.5, 
                mb: 4,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Sign In
            </Button>

            <Divider sx={{ my: 4 }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  px: 2,
                  bgcolor: 'background.paper'
                }}
              >
                OR
              </Typography>
            </Divider>

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              mb: 4,
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Google />}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#db4437',
                  color: '#db4437',
                  '&:hover': {
                    borderColor: '#c23321',
                    bgcolor: 'rgba(219, 68, 55, 0.04)'
                  }
                }}
              >
                Google
              </Button>
              <Button 
                variant="outlined" 
                fullWidth 
                startIcon={<Facebook />}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: '#4267B2',
                  color: '#4267B2',
                  '&:hover': {
                    borderColor: '#365899',
                    bgcolor: 'rgba(66, 103, 178, 0.04)'
                  }
                }}
              >
                Facebook
              </Button>
            </Box>

            {/* Demo Alert */}
            <Alert 
              severity="info" 
              sx={{ 
                mt: 3,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '0.9rem'
                }
              }}
            >
              This is a demo version. Use any email/password to sign in.
            </Alert>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 