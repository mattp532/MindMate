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
  Videocam
} from '@mui/icons-material';
import VideoAssessment from '../components/VideoAssessment';

const Profile = () => {
  const [activeStep, setActiveStep] = React.useState(1);
  const [showVideoAssessment, setShowVideoAssessment] = React.useState(false);
  const [assessmentResult, setAssessmentResult] = React.useState(null);
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
      label: 'Video Assessment',
      description: 'Upload a video demonstrating your teaching abilities',
      completed: assessmentResult !== null
    },
    {
      label: 'Final Verification',
      description: 'Complete final verification to start teaching',
      completed: assessmentResult && assessmentResult.score >= 80
    }
  ];

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, { name: newSkill, level: "Beginner", verified: false }]);
      setNewSkill("");
    }
  };

  const handleAssessmentComplete = (result) => {
    setAssessmentResult(result);
    setShowVideoAssessment(false);
    
    // Update verification progress
    if (result.score >= 80) {
      setActiveStep(3);
    } else {
      setActiveStep(2);
    }
  };

  const getVerificationProgress = () => {
    if (assessmentResult && assessmentResult.score >= 80) return 100;
    if (assessmentResult) return 66;
    return 33;
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

        {/* Top Row: Flexbox for Profile, Skills, Teaching Statistics */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'nowrap', alignItems: 'stretch' }}>
          {/* Profile Overview */}
          <Box sx={{ minWidth: 400, maxWidth: 440, flex: '0 0 320px', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Avatar sx={{ width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 }, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: { xs: '2rem', md: '3rem' }, boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)' }}>JD</Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', md: '1.5rem' }, mb: 1 }}>John Doe</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, mb: 2 }}>Software Developer & Teacher</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Star sx={{ color: 'warning.main', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>4.8 (127 reviews)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', md: '1rem' } }}>San Francisco, CA</Typography>
              </Box>
              <Button variant="outlined" startIcon={<Edit />} fullWidth sx={{ borderRadius: 2, py: 1.2, fontWeight: 'bold', textTransform: 'none', mt: 'auto', fontSize: { xs: '0.95rem', md: '1rem' } }}>Edit Profile</Button>
            </Paper>
          </Box>

          {/* Your Skills */}
          <Box sx={{ minWidth: 350, maxWidth: 500, flex: '0 0 420px', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', md: '1.5rem' }, mb: 2 }}>Your Skills</Typography>
              <Box sx={{ mb: 3, flex: 1, overflow: 'auto' }}>
                <Grid container spacing={1}>
                  {skills.map((skill, index) => (
                    <Grid item key={index}>
                      <Chip label={`${skill.name} (${skill.level})`} color={skill.verified ? "success" : "default"} variant={skill.verified ? "filled" : "outlined"} icon={skill.verified ? <Verified /> : undefined} sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' }, height: { xs: 28, md: 36 }, fontWeight: 'bold', '&:hover': { transform: 'scale(1.05)', transition: 'transform 0.2s ease-in-out' } }} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', md: '1.15rem' } }}>Add New Skill</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField label="Skill Name" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g., Python, Design, Marketing" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, '&:hover fieldset': { borderColor: 'primary.main' }, fontSize: { xs: '0.9rem', md: '1rem' } } }} />
                <Button variant="contained" startIcon={<Add />} onClick={handleAddSkill} sx={{ minWidth: { xs: '100%', sm: 120 }, borderRadius: 2, py: 1.2, fontWeight: 'bold', textTransform: 'none', fontSize: { xs: '0.95rem', md: '1rem' } }}>Add</Button>
              </Box>
            </Paper>
          </Box>

          {/* Teaching Statistics - fills remaining space */}
          <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.0rem', md: '1.39rem' }, mb: 2 }}>Teaching Statistics</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1, justifyContent: 'space-between' }}>
                <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 65, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', fontSize: { xs: '1.3rem', md: '2.2rem' }, mb: 0.5 }}>0</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>Students Taught</Typography>
                </Box>
                <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 65, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', fontSize: { xs: '1.3rem', md: '2.2rem' }, mb: 0.5 }}>0</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>Sessions Completed</Typography>
                </Box>
                <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 65, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', fontSize: { xs: '1.3rem', md: '2.2rem' }, mb: 0.5 }}>0.0</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>Average Rating</Typography>
                </Box>
                <Box sx={{ bgcolor: 'white', borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 65, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                  <Typography variant="h3" color="primary" sx={{ fontWeight: 'bold', fontSize: { xs: '1.3rem', md: '2.2rem' }, mb: 0.5 }}>0%</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>Success Rate</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Teaching Verification Full Width Below */}
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                <Verified sx={{ color: 'primary.main', fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Teaching Verification</Typography>
              </Box>
              <Stepper activeStep={activeStep} orientation="vertical" sx={{ '& .MuiStepLabel-root .Mui-completed': { color: 'success.main', }, '& .MuiStepLabel-root .Mui-active': { color: 'primary.main', } }}>
                {verificationSteps.map((step, index) => (
                  <Step key={step.label}>
                    <StepLabel StepIconComponent={step.completed ? CheckCircle : Pending} StepIconProps={{ sx: { color: step.completed ? 'success.main' : 'grey.400', fontSize: 24 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1rem', md: '1.1rem' } }}>{step.label}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.5 }}>{step.description}</Typography>
                      {index === 1 && (
                        <Box sx={{ mb: 3 }}>
                          {!assessmentResult ? (
                            <Button variant="contained" startIcon={<Videocam />} onClick={() => setShowVideoAssessment(true)} sx={{ mr: 2, mb: { xs: 2, sm: 0 }, borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}>Start Video Assessment</Button>
                          ) : (
                            <Box>
                              <Alert severity={assessmentResult.score >= 80 ? 'success' : 'warning'} sx={{ mb: 2, borderRadius: 2 }}>
                                Assessment Score: {assessmentResult.score}/100
                                {assessmentResult.score >= 80 ? ' - Excellent! You can proceed to final verification.' : ' - Good effort, but you need to improve. Please try again.'}
                              </Alert>
                              <Button variant="outlined" onClick={() => setShowVideoAssessment(true)} sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}>Retake Assessment</Button>
                            </Box>
                          )}
                        </Box>
                      )}
                      {index === 2 && assessmentResult && assessmentResult.score >= 80 && (
                        <Box sx={{ mb: 3 }}>
                          <Button variant="contained" startIcon={<VideoCall />} sx={{ mr: 2, mb: { xs: 2, sm: 0 }, borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}>Complete Final Verification</Button>
                          <Button variant="outlined" sx={{ borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none' }}>View Requirements</Button>
                        </Box>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(102, 126, 234, 0.05)', borderRadius: 3, border: '1px solid rgba(102, 126, 234, 0.1)' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold', mb: 2 }}><strong>Verification Progress:</strong> {getVerificationProgress()}% Complete</Typography>
                <LinearProgress variant="determinate" value={getVerificationProgress()} sx={{ height: 10, borderRadius: 5, bgcolor: 'rgba(102, 126, 234, 0.1)', '& .MuiLinearProgress-bar': { borderRadius: 5, bgcolor: 'primary.main' } }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Video Assessment Dialog */}
      {showVideoAssessment && (
        <VideoAssessment
          onAssessmentComplete={handleAssessmentComplete}
          onClose={() => setShowVideoAssessment(false)}
        />
      )}
    </Box>
  );
};

export default Profile; 