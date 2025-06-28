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
    <Container maxWidth="sm" sx={{ mt: 4, mb: 8 }}>
      <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
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

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Link href="#" variant="body2" sx={{ textDecoration: 'none' }}>
              Forgot password?
            </Link>
            <Link href="/register" variant="body2" sx={{ textDecoration: 'none' }}>
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
              mb: 3,
              fontSize: '1.1rem',
              fontWeight: 'bold'
            }}
          >
            Sign In
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
            This is a demo version. Use any email/password to sign in.
          </Alert>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login; 