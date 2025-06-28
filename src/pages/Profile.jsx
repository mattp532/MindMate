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
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        Profile
      </Typography>

      <Grid container spacing={4}>
        {/* Profile Overview */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                mx: 'auto', 
                mb: 3,
                bgcolor: 'primary.main',
                fontSize: '3rem'
              }}
            >
              JD
            </Avatar>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
              John Doe
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Software Developer & Teacher
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
              <Star sx={{ color: 'warning.main' }} />
              <Typography variant="body2">
                4.8 (127 reviews)
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                San Francisco, CA
              </Typography>
            </Box>

            <Button 
              variant="outlined" 
              startIcon={<Edit />}
              fullWidth
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
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Verified sx={{ color: 'primary.main', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Teaching Verification
                  </Typography>
                </Box>

                <Stepper activeStep={activeStep} orientation="vertical">
                  {verificationSteps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel
                        StepIconComponent={step.completed ? CheckCircle : Pending}
                        StepIconProps={{ 
                          sx: { 
                            color: step.completed ? 'success.main' : 'grey.400' 
                          } 
                        }}
                      >
                        {step.label}
                      </StepLabel>
                      <StepContent>
                        <Typography color="text.secondary" sx={{ mb: 2 }}>
                          {step.description}
                        </Typography>
                        {index === 1 && (
                          <Box sx={{ mb: 2 }}>
                            <Button 
                              variant="contained" 
                              startIcon={<Quiz />}
                              sx={{ mr: 2 }}
                            >
                              Start Assessment
                            </Button>
                            <Button variant="outlined">
                              View Sample Questions
                            </Button>
                          </Box>
                        )}
                        {index === 2 && (
                          <Box sx={{ mb: 2 }}>
                            <Button 
                              variant="contained" 
                              startIcon={<VideoCall />}
                              sx={{ mr: 2 }}
                            >
                              Schedule Interview
                            </Button>
                            <Button variant="outlined">
                              View Available Slots
                            </Button>
                          </Box>
                        )}
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Verification Progress:</strong> 33% Complete
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={33} 
                    sx={{ mt: 1, height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Skills Management */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Your Skills
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    {skills.map((skill, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={`${skill.name} (${skill.level})`}
                          color={skill.verified ? "success" : "default"}
                          variant={skill.verified ? "filled" : "outlined"}
                          icon={skill.verified ? <Verified /> : undefined}
                          sx={{ fontSize: '0.9rem' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="subtitle1" gutterBottom>
                  Add New Skill
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Skill Name"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g., Python, Design, Marketing"
                    fullWidth
                  />
                  <Button 
                    variant="contained" 
                    startIcon={<Add />}
                    onClick={handleAddSkill}
                    sx={{ minWidth: 120 }}
                  >
                    Add
                  </Button>
                </Box>
              </Paper>
            </Grid>

            {/* Teaching Stats */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Teaching Statistics
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        45
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Students Taught
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        127
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Sessions Completed
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        4.8
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Average Rating
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ textAlign: 'center', p: 2 }}>
                      <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
                        98%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
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
  );
};

export default Profile; 