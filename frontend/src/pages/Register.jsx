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
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { 
  Person, 
  Email, 
  Lock, 
  Google, 
  Facebook,
  Visibility,
  VisibilityOff,
  CheckCircle
} from '@mui/icons-material';

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const steps = ['Account Details', 'Profile Setup', 'Verification'];

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
              Join MindMate
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.95rem', md: '1rem' },
                lineHeight: 1.5
              }}
            >
              Start your learning journey today
            </Typography>
          </Box>

          {/* Registration Progress */}
          <Stepper 
            activeStep={0} 
            sx={{ 
              mb: { xs: 3, md: 4 },
              '& .MuiStepLabel-root .Mui-completed': {
                color: 'success.main',
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: 'primary.main',
              }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" noValidate autoComplete="off">
            <TextField 
              label="Full Name" 
              fullWidth 
              margin="normal" 
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
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

            <TextField 
              label="Confirm Password" 
              type={showConfirmPassword ? 'text' : 'password'} 
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 4,
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
              alignItems: 'center', 
              mb: 4,
              justifyContent: 'center'
            }}>
              <Link 
                href="/login" 
                variant="body2" 
                sx={{ 
                  textDecoration: 'none',
                  color: 'primary.main',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Already have an account? Sign in
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
              Create Account
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
                mb: 4,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  fontSize: '0.9rem'
                }
              }}
            >
              This is a demo version. Registration will be simulated.
            </Alert>

            {/* Benefits */}
            <Box sx={{ 
              p: 3, 
              bgcolor: '#f8f9fa', 
              borderRadius: 3,
              border: '1px solid #e9ecef'
            }}>
              <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 2
                }}
              >
                <CheckCircle color="success" />
                What you'll get:
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 1,
                ml: 4
              }}>
                <Typography variant="body2" color="text.secondary">
                  • Access to verified teachers and learners
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Smart matching algorithm
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Interactive learning tools
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Progress tracking
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register; 