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
  StepContent,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
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
  // Simulate userId (in real app, get from auth context or props)
  const userId = 'user-001'; // Change this value to simulate a new user

  // Profile state
  const [profile, setProfile] = React.useState({
    name: 'John Doe',
    title: 'Software Developer & Teacher',
    location: 'San Francisco, CA'
  });
  const [editOpen, setEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState(profile);
  const [editError, setEditError] = React.useState('');
  const [showEditSuccess, setShowEditSuccess] = React.useState(false);

  // Skills/assessment state (existing)
  const [skills, setSkills] = React.useState([]); // { name, verified, score }
  const [newSkill, setNewSkill] = React.useState("");
  const [showVideoAssessment, setShowVideoAssessment] = React.useState(false);
  const [currentSkill, setCurrentSkill] = React.useState(null);
  const [step, setStep] = React.useState(0); // 0: Add Skill, 1: Verify Skill, 2: Done
  const [showCongrats, setShowCongrats] = React.useState(false);
  const [lastVerifiedSkill, setLastVerifiedSkill] = React.useState(null);

  // Reset all state when userId changes (simulate new user)
  React.useEffect(() => {
    setProfile({
      name: 'John Doe',
      title: 'Software Developer & Teacher',
      location: 'San Francisco, CA'
    });
    setEditOpen(false);
    setEditForm({
      name: 'John Doe',
      title: 'Software Developer & Teacher',
      location: 'San Francisco, CA'
    });
    setEditError('');
    setShowEditSuccess(false);
    setSkills([]);
    setNewSkill("");
    setShowVideoAssessment(false);
    setCurrentSkill(null);
    setStep(0);
    setShowCongrats(false);
    setLastVerifiedSkill(null);
  }, [userId]);

  // Add a new skill and immediately start verification
  const handleAddSkill = () => {
    const skillName = newSkill.trim();
    if (skillName && !skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      setSkills([...skills, { name: skillName, verified: false, score: null }]);
      setCurrentSkill(skillName);
      setShowVideoAssessment(true);
      setNewSkill("");
      setStep(1);
    }
  };

  // After assessment, update the skill as verified (if passed) and store the score
  const handleAssessmentComplete = (result) => {
    setSkills(skills => skills.map(skill =>
      skill.name === currentSkill
        ? { ...skill, verified: result.score >= 80, score: result.score }
        : skill
    ));
    setShowVideoAssessment(false);
    setStep(2);
    setLastVerifiedSkill({ name: currentSkill, score: result.score });
    setShowCongrats(true);
    setCurrentSkill(null);
  };

  // Reset onboarding for another skill
  const handleAddAnotherSkill = () => {
    setStep(0);
    setCurrentSkill(null);
    setNewSkill("");
    setShowCongrats(false);
    setLastVerifiedSkill(null);
  };

  // Edit Profile Handlers
  const handleEditOpen = () => {
    setEditForm(profile);
    setEditError('');
    setEditOpen(true);
  };
  const handleEditClose = () => {
    setEditOpen(false);
    setEditError('');
  };
  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditSave = () => {
    // Validation
    if (!editForm.name.trim() || !editForm.title.trim() || !editForm.location.trim()) {
      setEditError('All fields are required.');
      return;
    }
    if (editForm.name.length > 50 || editForm.title.length > 60 || editForm.location.length > 60) {
      setEditError('Please keep fields to a reasonable length.');
      return;
    }
    setProfile(editForm);
    setEditOpen(false);
    setShowEditSuccess(true);
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

        {/* Onboarding Stepper */}
        <Box sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}>
          <Stepper activeStep={step} alternativeLabel>
            <Step key="add-skill">
              <StepLabel>Add Skill</StepLabel>
            </Step>
            <Step key="verify-skill">
              <StepLabel>Verify Skill</StepLabel>
            </Step>
            <Step key="done">
              <StepLabel>Done</StepLabel>
            </Step>
          </Stepper>
        </Box>

        {/* Top Row: Flexbox for Profile, Skills, Teaching Statistics */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'center' }}>
          {/* Profile Overview */}
          <Box sx={{ minWidth: 320, maxWidth: 400, flex: '0 0 320px', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Avatar sx={{ width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 }, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: { xs: '2rem', md: '3rem' }, boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)' }}>{profile.name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}</Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', md: '1.5rem' }, mb: 1 }}>{profile.name}</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, mb: 2 }}>{profile.title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Star sx={{ color: 'warning.main', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>4.8 (127 reviews)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', md: '1rem' } }}>{profile.location}</Typography>
              </Box>
              <Button variant="outlined" startIcon={<Edit />} fullWidth sx={{ borderRadius: 2, py: 1.2, fontWeight: 'bold', textTransform: 'none', mt: 'auto', fontSize: { xs: '0.95rem', md: '1rem' } }} onClick={handleEditOpen}>Edit Profile</Button>
            </Paper>
          </Box>

          {/* Skills Wizard */}
          <Box sx={{ minWidth: 350, maxWidth: 500, flex: '0 0 420px', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 8px 32px rgba(102,126,234,0.10)', background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(12px)', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main', textAlign: 'center' }}>Skill Verification</Typography>
              {step === 0 && (
                <>
                  <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: '1.1rem' }}>
                    Add a skill you want to teach. You'll be asked to verify it with a short video!
                  </Alert>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2, justifyContent: 'center' }}>
                    <TextField label="Skill Name" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="e.g., Python, Design, Marketing" fullWidth sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: { xs: '1.1rem', md: '1.2rem' }, boxShadow: '0 2px 8px rgba(102,126,234,0.08)' } }} />
                    <Button variant="contained" startIcon={<Add />} onClick={handleAddSkill} sx={{ minWidth: { xs: '100%', sm: 120 }, borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none', fontSize: { xs: '1.1rem', md: '1.2rem' }, boxShadow: '0 2px 8px rgba(102,126,234,0.12)' }}>Add</Button>
                  </Box>
                </>
              )}
              {step === 2 && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2, fontSize: '1.1rem', textAlign: 'center' }}>
                  <CheckCircle sx={{ color: 'success.main', mr: 1, verticalAlign: 'middle' }} />
                  Congratulations! Your skill has been verified. You can add more skills below.
                </Alert>
              )}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1rem', md: '1.15rem' } }}>Your Skills</Typography>
              <Box sx={{ mb: 3, flex: 1, overflow: 'auto', minHeight: 60 }}>
                {skills.length === 0 ? (
                  <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                    No skills added yet.
                  </Alert>
                ) : (
                  <>
                    <Grid container spacing={1}>
                      {skills.map((skill, index) => (
                        <Grid item key={index}>
                          <Tooltip title={skill.verified ? `Verified (Score: ${skill.score})` : skill.score ? `Needs Improvement (Score: ${skill.score})` : 'Not Verified'} arrow>
                            <span style={{ cursor: skill.verified ? 'default' : 'pointer', display: 'inline-block' }} onClick={() => {
                              if (!skill.verified) {
                                setCurrentSkill(skill.name);
                                setShowVideoAssessment(true);
                                setStep(1);
                              }
                            }}>
                              <Chip
                                label={
                                  <span style={{ fontWeight: 600 }}>
                                    {skill.name} {skill.verified ? <CheckCircle style={{ color: '#43a047', verticalAlign: 'middle', marginLeft: 4 }} /> : skill.score ? <Pending style={{ color: '#ffa726', verticalAlign: 'middle', marginLeft: 4 }} /> : ''}
                                  </span>
                                }
                                color={skill.verified ? "success" : skill.score ? "warning" : "default"}
                                variant={skill.verified ? "filled" : "outlined"}
                                sx={{ fontSize: { xs: '1rem', md: '1.1rem' }, height: { xs: 32, md: 40 }, fontWeight: 'bold', px: 2, boxShadow: skill.verified ? '0 2px 8px rgba(76,175,80,0.10)' : undefined, border: skill.verified ? '2px solid #43a047' : skill.score ? '2px solid #ffa726' : undefined }}
                              />
                            </span>
                          </Tooltip>
                        </Grid>
                      ))}
                    </Grid>
                    {skills.some(skill => !skill.verified) && (
                      <Alert severity="warning" sx={{ mt: 3, borderRadius: 2, fontWeight: 'bold', textAlign: 'center' }}>
                        You have unverified skills. Click a skill to resubmit your video and get verified.
                      </Alert>
                    )}
                  </>
                )}
              </Box>
              {step === 2 && (
                <Button variant="outlined" onClick={handleAddAnotherSkill} sx={{ borderRadius: 2, py: 1.2, fontWeight: 'bold', textTransform: 'none', fontSize: { xs: '1rem', md: '1.1rem' }, mt: 2 }}>
                  Add Another Skill
                </Button>
              )}
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

        {/* Only show verification/assessment after a skill is added */}
        {showVideoAssessment && currentSkill && (
          <VideoAssessment
            skillName={currentSkill}
            onAssessmentComplete={handleAssessmentComplete}
            onClose={() => {
              setShowVideoAssessment(false);
              setCurrentSkill(null);
            }}
          />
        )}

        {/* Congrats Modal Popup */}
        <Dialog open={showCongrats && !!lastVerifiedSkill} onClose={() => setShowCongrats(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ textAlign: 'center', pt: 4 }}>
            <CheckCircle sx={{ color: 'success.main', fontSize: 48, mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 2 }}>
              Congratulations!
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your skill <b>{lastVerifiedSkill?.name}</b> has been verified!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Score: <b>{lastVerifiedSkill?.score}</b>
            </Typography>
            <Button variant="contained" color="primary" onClick={() => setShowCongrats(false)} sx={{ borderRadius: 2, px: 4, py: 1.5, fontWeight: 'bold', textTransform: 'none', fontSize: '1.1rem' }}>
              Close
            </Button>
          </DialogContent>
        </Dialog>

        {/* Edit Profile Modal */}
        <Dialog open={editOpen} onClose={handleEditClose} maxWidth="xs" fullWidth>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              margin="normal"
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              fullWidth
              required
              inputProps={{ maxLength: 50 }}
            />
            <TextField
              margin="normal"
              label="Title"
              name="title"
              value={editForm.title}
              onChange={handleEditChange}
              fullWidth
              required
              inputProps={{ maxLength: 60 }}
            />
            <TextField
              margin="normal"
              label="Location"
              name="location"
              value={editForm.location}
              onChange={handleEditChange}
              fullWidth
              required
              inputProps={{ maxLength: 60 }}
            />
            {editError && <Alert severity="error" sx={{ mt: 2 }}>{editError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditClose} color="secondary" sx={{ fontWeight: 'bold' }}>Cancel</Button>
            <Button onClick={handleEditSave} variant="contained" color="primary" sx={{ fontWeight: 'bold' }}>Save</Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={showEditSuccess}
          autoHideDuration={3000}
          onClose={() => setShowEditSuccess(false)}
          message="Profile updated successfully!"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </Container>
    </Box>
  );
};

export default Profile; 