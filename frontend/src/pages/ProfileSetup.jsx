import React, { useState, useEffect } from 'react';
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
  Chip,
  Autocomplete
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
import { skillsService } from '../services/skillsService';

// Location data with major cities and countries
const locations = [
  { city: 'New York', country: 'United States' },
  { city: 'Los Angeles', country: 'United States' },
  { city: 'Chicago', country: 'United States' },
  { city: 'Houston', country: 'United States' },
  { city: 'Phoenix', country: 'United States' },
  { city: 'Philadelphia', country: 'United States' },
  { city: 'San Antonio', country: 'United States' },
  { city: 'San Diego', country: 'United States' },
  { city: 'Dallas', country: 'United States' },
  { city: 'San Jose', country: 'United States' },
  { city: 'London', country: 'United Kingdom' },
  { city: 'Manchester', country: 'United Kingdom' },
  { city: 'Birmingham', country: 'United Kingdom' },
  { city: 'Leeds', country: 'United Kingdom' },
  { city: 'Liverpool', country: 'United Kingdom' },
  { city: 'Toronto', country: 'Canada' },
  { city: 'Montreal', country: 'Canada' },
  { city: 'Vancouver', country: 'Canada' },
  { city: 'Calgary', country: 'Canada' },
  { city: 'Edmonton', country: 'Canada' },
  { city: 'Sydney', country: 'Australia' },
  { city: 'Melbourne', country: 'Australia' },
  { city: 'Brisbane', country: 'Australia' },
  { city: 'Perth', country: 'Australia' },
  { city: 'Adelaide', country: 'Australia' },
  { city: 'Berlin', country: 'Germany' },
  { city: 'Hamburg', country: 'Germany' },
  { city: 'Munich', country: 'Germany' },
  { city: 'Cologne', country: 'Germany' },
  { city: 'Frankfurt', country: 'Germany' },
  { city: 'Paris', country: 'France' },
  { city: 'Marseille', country: 'France' },
  { city: 'Lyon', country: 'France' },
  { city: 'Toulouse', country: 'France' },
  { city: 'Nice', country: 'France' },
  { city: 'Madrid', country: 'Spain' },
  { city: 'Barcelona', country: 'Spain' },
  { city: 'Valencia', country: 'Spain' },
  { city: 'Seville', country: 'Spain' },
  { city: 'Zaragoza', country: 'Spain' },
  { city: 'Rome', country: 'Italy' },
  { city: 'Milan', country: 'Italy' },
  { city: 'Naples', country: 'Italy' },
  { city: 'Turin', country: 'Italy' },
  { city: 'Palermo', country: 'Italy' },
  { city: 'Tokyo', country: 'Japan' },
  { city: 'Yokohama', country: 'Japan' },
  { city: 'Osaka', country: 'Japan' },
  { city: 'Nagoya', country: 'Japan' },
  { city: 'Sapporo', country: 'Japan' },
  { city: 'Seoul', country: 'South Korea' },
  { city: 'Busan', country: 'South Korea' },
  { city: 'Incheon', country: 'South Korea' },
  { city: 'Daegu', country: 'South Korea' },
  { city: 'Daejeon', country: 'South Korea' },
  { city: 'Beijing', country: 'China' },
  { city: 'Shanghai', country: 'China' },
  { city: 'Guangzhou', country: 'China' },
  { city: 'Shenzhen', country: 'China' },
  { city: 'Chengdu', country: 'China' },
  { city: 'Mumbai', country: 'India' },
  { city: 'Delhi', country: 'India' },
  { city: 'Bangalore', country: 'India' },
  { city: 'Hyderabad', country: 'India' },
  { city: 'Chennai', country: 'India' },
  { city: 'São Paulo', country: 'Brazil' },
  { city: 'Rio de Janeiro', country: 'Brazil' },
  { city: 'Brasília', country: 'Brazil' },
  { city: 'Salvador', country: 'Brazil' },
  { city: 'Fortaleza', country: 'Brazil' },
  { city: 'Mexico City', country: 'Mexico' },
  { city: 'Guadalajara', country: 'Mexico' },
  { city: 'Monterrey', country: 'Mexico' },
  { city: 'Puebla', country: 'Mexico' },
  { city: 'Tijuana', country: 'Mexico' },
  { city: 'Moscow', country: 'Russia' },
  { city: 'Saint Petersburg', country: 'Russia' },
  { city: 'Novosibirsk', country: 'Russia' },
  { city: 'Yekaterinburg', country: 'Russia' },
  { city: 'Kazan', country: 'Russia' },
  { city: 'Istanbul', country: 'Turkey' },
  { city: 'Ankara', country: 'Turkey' },
  { city: 'İzmir', country: 'Turkey' },
  { city: 'Bursa', country: 'Turkey' },
  { city: 'Antalya', country: 'Turkey' },
  { city: 'Cairo', country: 'Egypt' },
  { city: 'Alexandria', country: 'Egypt' },
  { city: 'Giza', country: 'Egypt' },
  { city: 'Shubra El Kheima', country: 'Egypt' },
  { city: 'Port Said', country: 'Egypt' },
  { city: 'Lagos', country: 'Nigeria' },
  { city: 'Kano', country: 'Nigeria' },
  { city: 'Ibadan', country: 'Nigeria' },
  { city: 'Kaduna', country: 'Nigeria' },
  { city: 'Port Harcourt', country: 'Nigeria' },
  { city: 'Johannesburg', country: 'South Africa' },
  { city: 'Cape Town', country: 'South Africa' },
  { city: 'Durban', country: 'South Africa' },
  { city: 'Pretoria', country: 'South Africa' },
  { city: 'Port Elizabeth', country: 'South Africa' }
];

const schema = yup.object({
  fullName: yup.string().required('Full name is required').min(2, 'Full name must be at least 2 characters'),
  bio: yup.string().required('Bio is required').min(5, 'Bio must be at least 5 characters'),
  location: yup.object().required('Please select a location').test('is-valid-location', 'Please select a valid location', value => {
    return value && value.city && value.country;
  }),
  skills: yup.array().min(1, 'Please add at least one skill'),
  interests: yup.array().min(1, 'Please add at least one interest')
}).required();

const ProfileSetup = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [skills, setSkills] = useState([]);
  const [interests, setInterests] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [showVideoAssessment, setShowVideoAssessment] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [lastVerifiedSkill, setLastVerifiedSkill] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setValue, setError } = useForm({
    resolver: yupResolver(schema)
  });

  // Fetch available skills from database
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        const skillsData = await skillsService.getAllSkills();
        setAvailableSkills(skillsData.map(skill => skill.name));
      } catch (error) {
        console.error('Error fetching skills:', error);
        // Fallback to some common skills if API fails
        setAvailableSkills([
          'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'C++', 'SQL', 'Git', 'Docker', 'AWS',
          'English', 'Spanish', 'French', 'German', 'Japanese', 'Mandarin', 'Italian', 'Portuguese', 'Russian', 'Arabic',
          'Piano', 'Guitar', 'Violin', 'Drums', 'Singing', 'Music Theory', 'Composition', 'Jazz', 'Classical', 'Rock',
          'Cooking', 'Photography', 'Drawing', 'Yoga', 'Meditation', 'Chess', 'Public Speaking', 'Creative Writing'
        ]);
      } finally {
        setLoadingSkills(false);
      }
    };

    fetchSkills();
  }, []);

  // Debug form errors
  console.log('Form errors:', errors);
  console.log('Current form values:', watch());

  const watchedUserType = watch('userType');

  const steps = [
    {
      label: 'Basic Information',
      description: 'Tell us about yourself',
      icon: Person
    },
    {
      label: 'Skills & Interests',
      description: 'What are your skills and interests?',
      icon: School
    },
    {
      label: 'Review & Complete',
      description: 'Review your profile and finish setup',
      icon: CheckCircle
    }
  ];

  const handleAddSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      const updatedSkills = [...skills, skill];
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

  const handleAddInterest = (interest) => {
    if (interest && !interests.includes(interest)) {
      const updatedInterests = [...interests, interest];
      setInterests(updatedInterests);
      setValue('interests', updatedInterests);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove) => {
    const updatedInterests = interests.filter(interest => interest !== interestToRemove);
    setInterests(updatedInterests);
    setValue('interests', updatedInterests);
  };

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      // Validate basic information step
      const currentValues = watch();
      const stepErrors = {};
      
      if (!currentValues.fullName || currentValues.fullName.length < 2) {
        stepErrors.fullName = 'Full name must be at least 2 characters';
      }
      if (!currentValues.bio || currentValues.bio.length < 5) {
        stepErrors.bio = 'Bio must be at least 5 characters';
      }
      if (!currentValues.location || !currentValues.location.city || !currentValues.location.country) {
        stepErrors.location = 'Please select a valid location';
      }
      
      if (Object.keys(stepErrors).length > 0) {
        // Set errors and don't proceed
        Object.keys(stepErrors).forEach(field => {
          setError(field, { message: stepErrors[field] });
        });
        return;
      }
    } else if (activeStep === 1) {
      // Validate skills and interests step
      if (skills.length === 0) {
        setError('skills', { message: 'Please add at least one skill' });
        return;
      }
      if (interests.length === 0) {
        setError('interests', { message: 'Please add at least one interest' });
        return;
      }
    }
    
    // If validation passes, proceed to next step
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage('');

    try {
      console.log('Form submitted with data:', data);
      console.log('Skills:', skills);
      console.log('Interests:', interests);
      
      const token = await currentUser.getIdToken();
      
      const profileData = {
        ...data,
        location: data.location ? `${data.location.city}, ${data.location.country}` : null,
        skills: skills,
        interests: interests
      };

      console.log('Sending profile data:', profileData);

      // Update user profile in backend
      const response = await axios.put('http://localhost:8080/api/profile', profileData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Profile updated successfully:', response.data);
      navigate('/profile');
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error response:', error.response?.data);
      setErrorMessage('Failed to update profile. Please try again.');
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
              helperText={
                errors.bio?.message ? (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{errors.bio.message}</span>
                    <span style={{ fontSize: '0.75rem', color: 'red' }}>
                      {watch('bio')?.length || 0}/500
                    </span>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span></span>
                    <span style={{ fontSize: '0.75rem', color: 'gray' }}>
                      {watch('bio')?.length || 0}/500
                    </span>
                  </Box>
                )
              }
              inputProps={{
                maxLength: 500
              }}
              sx={{ mb: 3 }}
            />

            <Autocomplete
              options={locations}
              getOptionLabel={(option) => `${option.city}, ${option.country}`}
              value={watch('location') || null}
              onChange={(event, newValue) => {
                setValue('location', newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location"
                  required
                  placeholder="Select your city and country"
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <LocationOn color="action" />
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {option.city}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.country}
                    </Typography>
                  </Box>
                </Box>
              )}
              sx={{ mb: 3 }}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              What are your skills and interests?
            </Typography>
            
            {/* Skills Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Skills you have:
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Autocomplete
                  options={availableSkills.filter(skill => !skills.includes(skill))}
                  value={newSkill}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setNewSkill(newValue);
                      handleAddSkill(newValue);
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setNewSkill(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add a skill"
                      placeholder="Search and select skills..."
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingSkills ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  loading={loadingSkills}
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddSkill(newSkill)}
                  disabled={!newSkill.trim() || skills.includes(newSkill.trim())}
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
              {errors.skills && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.skills.message}
                </Typography>
              )}
            </Box>

            {/* Interests Section */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
                Interests you have:
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Autocomplete
                  options={availableSkills.filter(skill => !interests.includes(skill))}
                  value={newInterest}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setNewInterest(newValue);
                      handleAddInterest(newValue);
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setNewInterest(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add an interest"
                      placeholder="Search and select interests..."
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loadingSkills ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  loading={loadingSkills}
                  freeSolo
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  onClick={() => handleAddInterest(newInterest)}
                  disabled={!newInterest.trim() || interests.includes(newInterest.trim())}
                  sx={{ minWidth: 100, textTransform: 'none' }}
                >
                  Add
                </Button>
              </Box>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    onDelete={() => handleRemoveInterest(interest)}
                    color="secondary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
                ))}
              </Box>
              {errors.interests && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {errors.interests.message}
                </Typography>
              )}
            </Box>
          </Box>
        );

      case 2:
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
                </Box>
              </Box>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Bio:</strong> {watch('bio') || 'No bio provided'}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Location:</strong> {watch('location') ? `${watch('location').city}, ${watch('location').country}` : 'No location provided'}
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Skills:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
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

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Interests:</strong>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {interests.map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    onDelete={() => handleRemoveInterest(interest)}
                    color="secondary"
                    variant="outlined"
                    sx={{ fontWeight: 'bold' }}
                  />
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

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {errorMessage}
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
                    StepIconComponent={() => React.createElement(step.icon)}
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

            <Box component="form">
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
                      onClick={handleSubmit(onSubmit)}
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