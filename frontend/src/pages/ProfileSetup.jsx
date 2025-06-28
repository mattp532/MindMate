import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Avatar,
  Chip
} from '@mui/material';
import {
  Person,
  School,
  LocationOn,
  Description,
  ArrowForward,
  ArrowBack,
  CheckCircle,
  Star
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const schema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Full name must be at least 2 characters'),
  bio: yup.string().required('Bio is required').min(10, 'Bio must be at least 10 characters'),
  location: yup.string().required('Location is required'),
  userType: yup.string().required('Please select your user type'),
  skills: yup.array().min(1, 'Please add at least one skill'),
  hourlyRate: yup.number().when('userType', {
    is: 'teacher',
    then: yup.number().required('Hourly rate is required for teachers').min(1, 'Hourly rate must be at least $1'),
    otherwise: yup.number().optional()
  })
}).required();

const ProfileSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: yupResolver(schema)
  });

  const watchedUserType = watch('userType');

  const steps = [
    {
      label: 'Basic Information',
      description: 'Tell us about yourself',
      icon: <Person />
    },
    {
      label: 'Bio & Location',
      description: 'Share your story and location',
      icon: <Description />
    },
    {
      label: 'Skills & Expertise',
      description: 'What can you teach or learn?',
      icon: <School />
    },
    {
      label: 'Review & Complete',
      description: 'Review your profile and finish setup',
      icon: <CheckCircle />
    }
  ];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setValue('skills', updatedSkills);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = skills.filter(skill => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue('skills', updatedSkills);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    try {
      setError('');
      setLoading(true);

      const token = await currentUser.getIdToken();
      
      const profileData = {
        ...data,
        skills: skills
      };

      // Update user profile in backend
      const response = await axios.put('http://localhost:8080/api/profile/update', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile updated successfully:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Let's start with your basic information
            </Typography>
            
            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              required
              {...register('fullName')}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
              InputProps={{
                startAdornment: (
                  <Person color="action" />
                ),
              }}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
              I want to:
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
              <Button
                variant={watchedUserType === 'student' ? 'contained' : 'outlined'}
                onClick={() => setValue('userType', 'student')}
                startIcon={<School />}
                fullWidth
                sx={{ py: 2, textTransform: 'none', fontWeight: 'bold' }}
              >
                Learn from others
              </Button>
              <Button
                variant={watchedUserType === 'teacher' ? 'contained' : 'outlined'}
                onClick={() => setValue('userType', 'teacher')}
                startIcon={<Star />}
                fullWidth
                sx={{ py: 2, textTransform: 'none', fontWeight: 'bold' }}
              >
                Teach others
              </Button>
            </Box>

            {watchedUserType === 'teacher' && (
              <TextField
                label="Hourly Rate ($)"
                type="number"
                fullWidth
                margin="normal"
                required
                {...register('hourlyRate')}
                error={!!errors.hourlyRate}
                helperText={errors.hourlyRate?.message}
                InputProps={{
                  startAdornment: <Typography>$</Typography>,
                }}
                sx={{ mb: 3 }}
              />
            )}
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Tell us more about yourself
            </Typography>
            
            <TextField
              label="Bio"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              required
              placeholder="Tell us about your background, interests, and what you're passionate about..."
              {...register('bio')}
              error={!!errors.bio}
              helperText={errors.bio?.message}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Location"
              fullWidth
              margin="normal"
              required
              placeholder="City, Country"
              {...register('location')}
              error={!!errors.location}
              helperText={errors.location?.message}
              InputProps={{
                startAdornment: (
                  <LocationOn color="action" />
                ),
              }}
              sx={{ mb: 3 }}
            />
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              What are your skills and interests?
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Add skills you {watchedUserType === 'teacher' ? 'can teach' : 'want to learn'}:
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                  label="Add a skill"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="e.g., JavaScript, Cooking, Photography"
                  fullWidth
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <Button
                  variant="contained"
                  onClick={handleAddSkill}
                  disabled={!newSkill.trim()}
                  sx={{ minWidth: 100, textTransform: 'none' }}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    color="primary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Review your profile
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                  {watch('fullName')?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {watch('fullName') || 'Your Name'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {watch('userType') === 'teacher' ? 'Teacher' : 'Student'}
                  </Typography>
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Bio:</strong> {watch('bio') || 'No bio provided'}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Location:</strong> {watch('location') || 'No location provided'}
              </Typography>
              
              {watch('userType') === 'teacher' && watch('hourlyRate') && (
                <Typography variant="body1" sx={{ mb: 2 }}>
                  <strong>Hourly Rate:</strong> ${watch('hourlyRate')}/hour
                </Typography>
              )}
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Skills:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill, index) => (
                  <Chip key={index} label={skill} size="small" />
                ))}
              </Box>
            </Paper>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: { xs: 3, md: 4 },
      px: { xs: 2, md: 0 }
    }}>
      <Container maxWidth="md">
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              borderRadius: 4,
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <Box textAlign="center" sx={{ mb: 4 }}>
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
                Complete Your Profile
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
                Let's get to know you better to personalize your experience
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Stepper 
              activeStep={activeStep} 
              orientation={isMobile ? 'vertical' : 'horizontal'}
              sx={{ mb: 4 }}
            >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel 
                    StepIconComponent={step.icon}
                    sx={{
                      '& .MuiStepLabel-label': {
                        fontWeight: 'bold'
                      }
                    }}
                  >
                    {!isMobile && step.label}
                  </StepLabel>
                  {isMobile && (
                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.description}
                      </Typography>
                    </StepContent>
                  )}
                </Step>
              ))}
            </Stepper>

            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Grow in={true} timeout={500}>
                <Box>
                  {renderStepContent(activeStep)}
                </Box>
              </Grow>

              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2
              }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Back
                </Button>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {activeStep === steps.length - 1 ? (
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      endIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                        }
                      }}
                    >
                      {loading ? 'Completing...' : 'Complete Profile'}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForward />}
                      sx={{ 
                        textTransform: 'none',
                        fontWeight: 'bold',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default ProfileSetup; 