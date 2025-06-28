import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button, 
  TextField, 
  Divider,
  Avatar,
  Chip,
  LinearProgress,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import { 
  Person, 
  Email, 
  LocationOn, 
  School, 
  Verified, 
  Add,
  Edit,
  Star,
  CheckCircle,
  Pending,
  Assignment,
  VideoCall,
  Quiz
} from '@mui/icons-material';

const Profile = () => {
  const [activeStep, setActiveStep] = React.useState(1);
  const [skills, setSkills] = React.useState([
    { name: "JavaScript", level: "Advanced", verified: true },
    { name: "React", level: "Intermediate", verified: true },
    { name: "Node.js", level: "Beginner", verified: false }
  ]);
  const [newSkill, setNewSkill] = React.useState("");

  const verificationSteps = [
    {
      label: 'Profile Completion',
      description: 'Complete your basic profile information',
      completed: true
    },
    {
      label: 'Skill Assessment',
      description: 'Take a quiz to verify your teaching abilities',
      completed: false
    },
    {
      label: 'Video Interview',
      description: 'Schedule a brief video call for final verification',
      completed: false
    }
  ];

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill, level: "Beginner", verified: false }]);
      setNewSkill("");
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: { xs: 3, md: 4 },
      px: { xs: 2, md: 0 }
    }}>
      <Container maxWidth="lg">
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            mb: { xs: 3, md: 4 },
            fontSize: { xs: '2rem', md: '2.5rem' },
            color: 'primary.main',
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Profile
        </Typography>

        <Grid container spacing={4}>
          {/* Profile Overview */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: { xs: 3, md: 4 }, 
                borderRadius: 4, 
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                height: 'fit-content'
              }}
            >
              <Avatar 
                sx={{ 
                  width: { xs: 100, md: 120 }, 
                  height: { xs: 100, md: 120 }, 
                  mx: 'auto', 
                  mb: 3,
                  bgcolor: 'primary.main',
                  fontSize: { xs: '2.5rem', md: '3rem' },
                  boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
                }}
              >
                JD
              </Avatar>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  mb: 1
                }}
              >
                John Doe
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary" 
                gutterBottom
                sx={{ 
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  mb: 2
                }}
              >
                Software Developer & Teacher
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 1, 
                mb: 2 
              }}>
                <Star sx={{ color: 'warning.main', fontSize: 20 }} />
                <Typography 
                  variant="body2"
                  sx={{ fontWeight: 'bold' }}
                >
                  4.8 (127 reviews)
                </Typography>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 1, 
                mb: 3 
              }}>
                <LocationOn sx={{ 
                  fontSize: 18, 
                  color: 'text.secondary' 
                }} />
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  San Francisco, CA
                </Typography>
              </Box>

              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                fullWidth
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                  textTransform: 'none'
                }}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={3}>
              {/* Teaching Verification */}
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2, 
                    mb: 4 
                  }}>
                    <Verified sx={{ 
                      color: 'primary.main', 
                      fontSize: 32 
                    }} />
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        fontSize: { xs: '1.25rem', md: '1.5rem' }
                      }}
                    >
                      Teaching Verification
                    </Typography>
                  </Box>

                  <Stepper 
                    activeStep={activeStep} 
                    orientation="vertical"
                    sx={{
                      '& .MuiStepLabel-root .Mui-completed': {
                        color: 'success.main',
                      },
                      '& .MuiStepLabel-root .Mui-active': {
                        color: 'primary.main',
                      }
                    }}
                  >
                    {verificationSteps.map((step, index) => (
                      <Step key={step.label}>
                        <StepLabel
                          StepIconComponent={step.completed ? CheckCircle : Pending}
                          StepIconProps={{ 
                            sx: { 
                              color: step.completed ? 'success.main' : 'grey.400',
                              fontSize: 24
                            } 
                          }}
                        >
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 'bold',
                              fontSize: { xs: '1rem', md: '1.1rem' }
                            }}
                          >
                            {step.label}
                          </Typography>
                        </StepLabel>
                        <StepContent>
                          <Typography 
                            color="text.secondary" 
                            sx={{ 
                              mb: 3,
                              fontSize: { xs: '0.9rem', md: '1rem' },
                              lineHeight: 1.5
                            }}
                          >
                            {step.description}
                          </Typography>
                          {index === 1 && (
                            <Box sx={{ mb: 3 }}>
                              <Button 
                                variant="contained" 
                                startIcon={<Quiz />}
                                sx={{ 
                                  mr: 2,
                                  mb: { xs: 2, sm: 0 },
                                  borderRadius: 2,
                                  py: 1.5,
                                  fontWeight: 'bold',
                                  textTransform: 'none'
                                }}
                              >
                                Start Assessment
                              </Button>
                              <Button 
                                variant="outlined"
                                sx={{ 
                                  borderRadius: 2,
                                  py: 1.5,
                                  fontWeight: 'bold',
                                  textTransform: 'none'
                                }}
                              >
                                View Sample Questions
                              </Button>
                            </Box>
                          )}
                          {index === 2 && (
                            <Box sx={{ mb: 3 }}>
                              <Button 
                                variant="contained" 
                                startIcon={<VideoCall />}
                                sx={{ 
                                  mr: 2,
                                  mb: { xs: 2, sm: 0 },
                                  borderRadius: 2,
                                  py: 1.5,
                                  fontWeight: 'bold',
                                  textTransform: 'none'
                                }}
                              >
                                Schedule Interview
                              </Button>
                              <Button 
                                variant="outlined"
                                sx={{ 
                                  borderRadius: 2,
                                  py: 1.5,
                                  fontWeight: 'bold',
                                  textTransform: 'none'
                                }}
                              >
                                View Available Slots
                              </Button>
                            </Box>
                          )}
                        </StepContent>
                      </Step>
                    ))}
                  </Stepper>

                  <Box sx={{ 
                    mt: 4, 
                    p: 3, 
                    bgcolor: 'rgba(102, 126, 234, 0.05)', 
                    borderRadius: 3,
                    border: '1px solid rgba(102, 126, 234, 0.1)'
                  }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 'bold',
                        mb: 2
                      }}
                    >
                      <strong>Verification Progress:</strong> 33% Complete
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={33} 
                      sx={{ 
                        height: 10, 
                        borderRadius: 5,
                        bgcolor: 'rgba(102, 126, 234, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 5,
                          bgcolor: 'primary.main'
                        }
                      }}
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Skills Management */}
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      mb: 3
                    }}
                  >
                    Your Skills
                  </Typography>
                  
                  <Box sx={{ mb: 4 }}>
                    <Grid container spacing={2}>
                      {skills.map((skill, index) => (
                        <Grid item key={index}>
                          <Chip
                            label={`${skill.name} (${skill.level})`}
                            color={skill.verified ? "success" : "default"}
                            variant={skill.verified ? "filled" : "outlined"}
                            icon={skill.verified ? <Verified /> : undefined}
                            sx={{ 
                              fontSize: { xs: '0.85rem', md: '0.9rem' },
                              height: { xs: 32, md: 36 },
                              fontWeight: 'bold',
                              '&:hover': {
                                transform: 'scale(1.05)',
                                transition: 'transform 0.2s ease-in-out'
                              }
                            }}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  <Divider sx={{ my: 4 }} />

                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      mb: 2
                    }}
                  >
                    Add New Skill
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                  }}>
                    <TextField
                      label="Skill Name"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g., Python, Design, Marketing"
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': {
                            borderColor: 'primary.main',
                          },
                        }
                      }}
                    />
                    <Button 
                      variant="contained" 
                      startIcon={<Add />}
                      onClick={handleAddSkill}
                      sx={{ 
                        minWidth: { xs: '100%', sm: 120 },
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 'bold',
                        textTransform: 'none'
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                </Paper>
              </Grid>

              {/* Teaching Stats */}
              <Grid item xs={12}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: { xs: 3, md: 4 }, 
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1.25rem', md: '1.5rem' },
                      mb: 4
                    }}
                  >
                    Teaching Statistics
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}>
                        <Typography 
                          variant="h3" 
                          color="primary" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            mb: 1
                          }}
                        >
                          45
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Students Taught
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}>
                        <Typography 
                          variant="h3" 
                          color="primary" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            mb: 1
                          }}
                        >
                          127
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Sessions Completed
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}>
                        <Typography 
                          variant="h3" 
                          color="primary" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            mb: 1
                          }}
                        >
                          4.8
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Average Rating
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Card sx={{ 
                        textAlign: 'center', 
                        p: 3,
                        borderRadius: 3,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                        transition: 'transform 0.2s ease-in-out',
                        '&:hover': {
                          transform: 'translateY(-4px)'
                        }
                      }}>
                        <Typography 
                          variant="h3" 
                          color="primary" 
                          sx={{ 
                            fontWeight: 'bold',
                            fontSize: { xs: '2rem', md: '2.5rem' },
                            mb: 1
                          }}
                        >
                          98%
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          Success Rate
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile; 