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
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Join MindMate
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start your learning journey today
          </Typography>
        </Box>

        {/* Registration Progress */}
        <Stepper activeStep={0} sx={{ mb: 4 }}>
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
            sx={{ mb: 2 }}
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
            sx={{ mb: 2 }}
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
                    sx={{ minWidth: 'auto', p: 0 }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
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
                    sx={{ minWidth: 'auto', p: 0 }}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </Button>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Link href="/login" variant="body2" sx={{ textDecoration: 'none' }}>
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
              mb: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Create Account
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<Google />}
              sx={{ py: 1.5 }}
            >
              Google
            </Button>
            <Button 
              variant="outlined" 
              fullWidth 
              startIcon={<Facebook />}
              sx={{ py: 1.5 }}
            >
              Facebook
            </Button>
          </Box>

          {/* Demo Alert */}
          <Alert severity="info" sx={{ mt: 2 }}>
            This is a demo version. Registration will be simulated.
          </Alert>

          {/* Benefits */}
          <Box sx={{ mt: 4, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircle color="success" />
              What you'll get:
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 4 }}>
              • Access to verified teachers and learners<br/>
              • Smart matching algorithm<br/>
              • Interactive learning tools<br/>
              • Progress tracking
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register; 