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
  Snackbar,
  CircularProgress,
  Autocomplete
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
import { useAuth } from '../contexts/AuthContext';
import { skillsService } from '../services/skillsService';
import axios from 'axios';

const Profile = () => {
  const { currentUser } = useAuth();
  // Simulate userId (in real app, get from auth context or props)
  const userId = 'user-001'; // Change this value to simulate a new user

  // Profile state
  const [profile, setProfile] = React.useState({
    name: 'Loading...',
    title: 'Loading...',
    location: 'Loading...',
    bio: 'Loading...'
  });
  const [loading, setLoading] = React.useState(true);
  const [profileError, setProfileError] = React.useState('');
  const [editOpen, setEditOpen] = React.useState(false);
  const [editForm, setEditForm] = React.useState(profile);
  const [editError, setEditError] = React.useState('');
  const [showEditSuccess, setShowEditSuccess] = React.useState(false);

  // Skills/assessment state (existing)
  const [skills, setSkills] = React.useState([]); // { name, verified, score }
  const [interests, setInterests] = React.useState([]); // { name }
  const [newSkill, setNewSkill] = React.useState("");
  const [newInterest, setNewInterest] = React.useState("");
  const [availableSkills, setAvailableSkills] = React.useState([]);
  const [loadingSkills, setLoadingSkills] = React.useState(true);
  const [showVideoAssessment, setShowVideoAssessment] = React.useState(false);
  const [currentSkill, setCurrentSkill] = React.useState(null);
  const [showCongrats, setShowCongrats] = React.useState(false);
  const [lastVerifiedSkill, setLastVerifiedSkill] = React.useState(null);
  const [savingSkill, setSavingSkill] = React.useState(false);
  const [savingInterest, setSavingInterest] = React.useState(false);

  // Fetch available skills from database
  React.useEffect(() => {
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

  // Fetch user profile data
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const userData = response.data;
        setProfile({
          name: userData.name || 'No name provided',
          title: '',
          location: userData.city && userData.country 
            ? `${userData.city}, ${userData.country}`
            : userData.city || userData.country || 'No location provided',
          bio: userData.bio || 'No bio provided'
        });
        setEditForm({
          name: userData.name || 'No name provided',
          title: '',
          location: userData.city && userData.country 
            ? `${userData.city}, ${userData.country}`
            : userData.city || userData.country || 'No location provided',
          bio: userData.bio || 'No bio provided'
        });
        
        // Set skills from backend as unverified skills
        if (userData.skills && userData.skills.length > 0) {
          const backendSkills = userData.skills.map(skill => ({
            name: skill.name,
            verified: skill.verified || false,
            score: skill.verification_score || null
          }));
          setSkills(backendSkills);
        }
        
        // Set interests from backend
        if (userData.interests && userData.interests.length > 0) {
          const backendInterests = userData.interests.map(interestName => ({
            name: interestName
          }));
          setInterests(backendInterests);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileError('Failed to load profile data');
        setProfile({
          name: 'Error loading profile',
          title: 'Error loading profile',
          location: 'Error loading profile',
          bio: 'Error loading profile'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Compute display name and avatar
  const displayName = currentUser?.displayName || profile.name;
  const avatarUrl = currentUser?.photoURL || null;

  // Reset all state when userId changes (simulate new user)
  React.useEffect(() => {
    setProfile({
      name: 'John Doe',
      title: '',
      location: 'San Francisco, CA',
      bio: 'Loading...'
    });
    setEditOpen(false);
    setEditForm({
      name: 'John Doe',
      title: '',
      location: 'San Francisco, CA',
      bio: 'Loading...'
    });
    setEditError('');
    setShowEditSuccess(false);
    setSkills([]);
    setInterests([]);
    setNewSkill("");
    setNewInterest("");
    setShowVideoAssessment(false);
    setCurrentSkill(null);
    setShowCongrats(false);
    setLastVerifiedSkill(null);
    setSavingSkill(false);
    setSavingInterest(false);
  }, [userId]);

  // Add a new skill and immediately start verification
  const handleAddSkill = async (skillName) => {
    if (skillName && !skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      setSavingSkill(true);
      
      const newSkillObj = { name: skillName, verified: false, score: null };
      setSkills([...skills, newSkillObj]);
      
      // Save the new skill to the database immediately
      try {
        const token = await currentUser.getIdToken();
        await axios.put('http://localhost:8080/api/profile', {
          fullName: profile.name,
          bio: profile.bio,
          location: profile.location.split(',')[0]?.trim() || '', // Extract city from location
          skills: [...skills.map(skill => skill.name), skillName], // Include all existing skills plus the new one
          interests: interests.map(interest => interest.name),
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('New skill saved to database:', skillName);
      } catch (error) {
        console.error('Error saving new skill to database:', error);
      } finally {
        setSavingSkill(false);
      }
    } else if (skillName && skills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) {
      // If skill already exists, just clear the input
      setNewSkill("");
    }
  };

  // Add a new interest
  const handleAddInterest = async (interestName) => {
    if (interestName && !interests.some(i => i.name.toLowerCase() === interestName.toLowerCase())) {
      setSavingInterest(true);
      
      const newInterestObj = { name: interestName };
      setInterests([...interests, newInterestObj]);
      
      // Save the new interest to the database immediately
      try {
        const token = await currentUser.getIdToken();
        await axios.put('http://localhost:8080/api/profile', {
          fullName: profile.name,
          bio: profile.bio,
          location: profile.location.split(',')[0]?.trim() || '', // Extract city from location
          skills: skills.map(skill => skill.name), // Include all existing skills
          interests: [...interests.map(interest => interest.name), interestName], // Include all existing interests plus the new one
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('New interest saved to database:', interestName);
      } catch (error) {
        console.error('Error saving new interest to database:', error);
      } finally {
        setSavingInterest(false);
      }
    } else if (interestName && interests.some(i => i.name.toLowerCase() === interestName.toLowerCase())) {
      // If interest already exists, just clear the input
      setNewInterest("");
    }
  };

  // Remove an interest
  const handleRemoveInterest = async (interestToRemove) => {
    try {
      const token = await currentUser.getIdToken();
      
      // Remove from backend
      await axios.delete(`http://localhost:8080/api/profile/interests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          interest: interestToRemove
        }
      });
      
      // Remove from local state
      setInterests(interests.filter(interest => interest.name !== interestToRemove));
    } catch (error) {
      console.error('Error removing interest:', error);
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    try {
      const token = await currentUser.getIdToken();
      
      // Remove from backend
      await axios.delete(`http://localhost:8080/api/profile/skills`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        data: {
          skill: skillToRemove
        }
      });
      
      // Remove from local state
      setSkills(skills.filter(skill => skill.name !== skillToRemove));
    } catch (error) {
      console.error('Error removing skill:', error);
    }
  };

  // After assessment, update the skill as verified (if passed) and store the score
  const handleAssessmentComplete = async (result) => {
    try {
      const token = await currentUser.getIdToken();
      const verified = result.score >= 80;
      
      // Update skill verification in backend
      await axios.put('http://localhost:8080/api/profile/skill-verification', {
        skillName: currentSkill,
        verified: verified,
        score: result.score
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setSkills(skills => skills.map(skill =>
        skill.name === currentSkill
          ? { ...skill, verified: verified, score: result.score }
          : skill
      ));
      
      setShowVideoAssessment(false);
      setShowCongrats(true);
      setCurrentSkill(null);
      setLastVerifiedSkill({ name: currentSkill, score: result.score });
    } catch (error) {
      console.error('Error updating skill verification:', error);
      // Still update local state even if backend call fails
      setSkills(skills => skills.map(skill =>
        skill.name === currentSkill
          ? { ...skill, verified: result.score >= 80, score: result.score }
          : skill
      ));
      setShowVideoAssessment(false);
      setShowCongrats(true);
      setCurrentSkill(null);
      setLastVerifiedSkill({ name: currentSkill, score: result.score });
    }
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
  const handleEditSave = async () => {
    // Validation
    if (!editForm.name.trim() || !editForm.location.trim()) {
      setEditError('Name and location are required.');
      return;
    }
    if (editForm.name.length > 50 || editForm.location.length > 60) {
      setEditError('Please keep fields to a reasonable length.');
      return;
    }
    if (editForm.bio && editForm.bio.length > 500) {
      setEditError('Bio should be less than 500 characters.');
      return;
    }

    try {
      const token = await currentUser.getIdToken();
      
      // Parse location to extract city and country
      const locationParts = editForm.location.split(',').map(part => part.trim());
      const city = locationParts[0] || '';
      const country = locationParts[1] || '';

      const response = await axios.put('http://localhost:8080/api/profile', {
        fullName: editForm.name,
        bio: editForm.bio,
        location: city, // Backend expects just the city
        skills: skills.map(skill => skill.name), // Include all skills (verified and unverified)
        interests: interests.map(interest => interest.name), // Include current interests
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state with the response data
      const updatedData = response.data;
      setProfile({
        name: updatedData.name || editForm.name,
        title: '',
        location: updatedData.city && updatedData.country 
          ? `${updatedData.city}, ${updatedData.country}`
          : updatedData.city || updatedData.country || editForm.location,
        bio: updatedData.bio || editForm.bio
      });

      setEditOpen(false);
      setShowEditSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setEditError('Failed to update profile. Please try again.');
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

        {/* Error Alert */}
        {profileError && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {profileError}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
          </Box>
        )}

        {/* Top Row: Flexbox for Profile, Skills, Teaching Statistics */}
        <Box sx={{ display: 'flex', gap: 4, mb: 4, flexWrap: 'wrap', alignItems: 'stretch', justifyContent: 'center' }}>
          {/* Profile Overview */}
          <Box sx={{ minWidth: 320, maxWidth: 400, flex: '0 0 320px', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Avatar 
                src={avatarUrl || undefined}
                sx={{ width: { xs: 80, md: 120 }, height: { xs: 80, md: 120 }, mx: 'auto', mb: 2, bgcolor: 'primary.main', fontSize: { xs: '2rem', md: '3rem' }, boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)' }}
              >
                {!avatarUrl && displayName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
              </Avatar>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', md: '1.5rem' }, mb: 1 }}>{displayName}</Typography>
              {profile.title && (
                <Typography variant="body1" color="text.secondary" gutterBottom sx={{ fontSize: { xs: '0.85rem', md: '1rem' }, mb: 2 }}>{profile.title}</Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <Star sx={{ color: 'warning.main', fontSize: 18 }} />
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: { xs: '0.9rem', md: '1rem' } }}>4.8 (127 reviews)</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: { xs: '0.85rem', md: '1rem' } }}>
                  {profile.location}
                </Typography>
              </Box>
              {profile.bio && profile.bio !== 'No bio provided' && (
                <Box sx={{ mb: 2, textAlign: 'left' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontSize: { xs: '0.8rem', md: '0.9rem' }, 
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {profile.bio}
                  </Typography>
                </Box>
              )}
              <Button variant="outlined" startIcon={<Edit />} fullWidth sx={{ borderRadius: 2, py: 1.2, fontWeight: 'bold', textTransform: 'none', mt: 'auto', fontSize: { xs: '0.95rem', md: '1rem' } }} onClick={handleEditOpen}>Edit Profile</Button>
            </Paper>
          </Box>

          {/* Skills Wizard */}
          <Box sx={{ minWidth: 350, maxWidth: 500, flex: '0 0 420px', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 8px 32px rgba(102,126,234,0.10)', background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(12px)', minHeight: 420, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main', textAlign: 'center' }}>Skill Verification</Typography>
              
              <Alert severity="info" sx={{ mb: 3, borderRadius: 2, fontSize: '1.1rem' }}>
                {skills.length > 0 
                  ? "Add more skills you want to teach, or click on unverified skills below to verify them."
                  : "Add skills you want to teach. Click on a skill to verify it with a video assessment!"
                }
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2, justifyContent: 'center' }}>
                <Autocomplete
                  options={availableSkills.filter(skill => !skills.some(s => s.name.toLowerCase() === skill.toLowerCase()))}
                  value={newSkill}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setNewSkill(""); // Clear the input immediately
                      handleAddSkill(newValue);
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setNewSkill(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Skill Name"
                      placeholder="e.g., Python, Design, Marketing"
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2, 
                          fontSize: { xs: '1.1rem', md: '1.2rem' }, 
                          boxShadow: '0 2px 8px rgba(102,126,234,0.08)' 
                        } 
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
                  startIcon={savingSkill ? <CircularProgress size={20} /> : <Add />} 
                  onClick={() => handleAddSkill(newSkill)}
                  disabled={savingSkill || !newSkill.trim() || skills.some(s => s.name.toLowerCase() === newSkill.trim().toLowerCase())}
                  sx={{ minWidth: { xs: '100%', sm: 120 }, borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none', fontSize: { xs: '1.1rem', md: '1.2rem' }, boxShadow: '0 2px 8px rgba(102,126,234,0.12)' }}
                >
                  {savingSkill ? 'Saving...' : 'Add'}
                </Button>
              </Box>
              
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
                                onDelete={() => handleRemoveSkill(skill.name)}
                                sx={{ 
                                  fontSize: { xs: '1rem', md: '1.1rem' }, 
                                  height: { xs: 32, md: 40 }, 
                                  fontWeight: 'bold', 
                                  px: 2, 
                                  bgcolor: skill.verified ? '#e8f5e8' : '#ffeaea', // Light green for verified, light red for unverified
                                  color: skill.verified ? '#2e7d32' : '#d32f2f', // Dark green text for verified, dark red for unverified
                                  border: skill.verified ? '2px solid #4caf50' : '2px solid #f44336', // Green border for verified, red for unverified
                                  '&:hover': {
                                    bgcolor: skill.verified ? '#d4edda' : '#ffcdd2', // Darker on hover
                                  }
                                }}
                              />
                            </span>
                          </Tooltip>
                        </Grid>
                      ))}
                    </Grid>
                    {skills.some(skill => !skill.verified) && (
                      <Alert severity="warning" sx={{ mt: 3, borderRadius: 2, fontWeight: 'bold', textAlign: 'center' }}>
                        {skills.every(skill => !skill.verified && skill.score === null) 
                          ? "Click on any unverified skill (red) to start the verification process."
                          : "You have unverified skills. Click on a red skill to verify it with a video assessment."
                        }
                      </Alert>
                    )}
                  </>
                )}
              </Box>
            </Paper>
          </Box>

          {/* Interests Section */}
          <Box sx={{ minWidth: 320, maxWidth: 400, flex: '0 0 320px', display: 'flex', flexDirection: 'column' }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'stretch' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '1.0rem', md: '1.39rem' }, mb: 2 }}>Interests</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.9rem', md: '1rem' } }}>
                Skills you want to learn
              </Typography>
              
              {/* Add Interest Section */}
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mb: 2, justifyContent: 'center' }}>
                <Autocomplete
                  options={availableSkills.filter(skill => !interests.some(i => i.name.toLowerCase() === skill.toLowerCase()))}
                  value={newInterest}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setNewInterest(""); // Clear the input immediately
                      handleAddInterest(newValue);
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setNewInterest(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Add Interest"
                      placeholder="e.g., Python, French, Piano"
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
                      sx={{ 
                        '& .MuiOutlinedInput-root': { 
                          borderRadius: 2, 
                          fontSize: { xs: '1rem', md: '1.1rem' }, 
                          boxShadow: '0 2px 8px rgba(102,126,234,0.08)' 
                        } 
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
                  startIcon={savingInterest ? <CircularProgress size={20} /> : <Add />} 
                  onClick={() => handleAddInterest(newInterest)}
                  disabled={savingInterest || !newInterest.trim() || interests.some(i => i.name.toLowerCase() === newInterest.trim().toLowerCase())}
                  sx={{ minWidth: { xs: '100%', sm: 120 }, borderRadius: 2, py: 1.5, fontWeight: 'bold', textTransform: 'none', fontSize: { xs: '1rem', md: '1.1rem' }, boxShadow: '0 2px 8px rgba(102,126,234,0.12)' }}
                >
                  {savingInterest ? 'Saving...' : 'Add'}
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}>Your Interests</Typography>
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                {interests.length === 0 ? (
                  <Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
                    No interests added yet.
                  </Alert>
                ) : (
                  <Grid container spacing={1}>
                    {interests.map((interest, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={interest.name}
                          color="primary"
                          variant="outlined"
                          onDelete={() => handleRemoveInterest(interest.name)}
                          sx={{ 
                            fontSize: { xs: '0.9rem', md: '1rem' }, 
                            height: { xs: 28, md: 32 }, 
                            fontWeight: 'bold', 
                            px: 2,
                            border: '2px solid',
                            borderColor: 'primary.main'
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
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
              label="Location"
              name="location"
              value={editForm.location}
              onChange={handleEditChange}
              fullWidth
              required
              inputProps={{ maxLength: 60 }}
            />
            <TextField
              margin="normal"
              label="Bio"
              name="bio"
              value={editForm.bio}
              onChange={handleEditChange}
              fullWidth
              multiline
              rows={4}
              inputProps={{ maxLength: 500 }}
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