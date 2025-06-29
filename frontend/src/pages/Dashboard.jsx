import React from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Button, 
  TextField, 
  Card,
  CardContent,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  InputAdornment,
  Badge,
  Fade,
  Grow,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Search, 
  Person, 
  Star, 
  LocationOn, 
  School,
  TrendingUp,
  Message,
  VideoCall,
  FilterList,
  MoreVert,
  OnlinePrediction,
  Schedule
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapUpdater = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 13); // zoom to 13 for a wider view
    }
  }, [coords, map]);
  return null;
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [tabValue, setTabValue] = React.useState(0);
  const [mapLoaded, setMapLoaded] = React.useState(false);
  const [selectedCoords, setSelectedCoords] = React.useState(null);
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [searchSkill, setSearchSkill] = React.useState("");
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Real data state
  const [matches, setMatches] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [userProfile, setUserProfile] = React.useState(null);
  const [profileLoading, setProfileLoading] = React.useState(true);

  const popularSkills = [
    "JavaScript", "Python", "React", "Node.js", "Data Science", 
    "UI/UX Design", "Machine Learning", "Graphic Design"
  ];

  // Fetch matches from backend
  React.useEffect(() => {
    const fetchMatches = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError('');
        const token = await currentUser.getIdToken();
        
        const response = await axios.post('http://localhost:8080/api/matches', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const { matches: matchesData, message: responseMessage } = response.data;
        setMatches(matchesData || []);
        setMessage(responseMessage || '');
        
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError('Failed to load matches. Please try again.');
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [currentUser]);

  // Fetch user profile to check verification status
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser) return;
      
      try {
        setProfileLoading(true);
        const token = await currentUser.getIdToken();
        
        const response = await axios.get('http://localhost:8080/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUserProfile(response.data);
        
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [currentUser]);

  // Transform backend data to match frontend format
  const transformedMatches = matches.map((match, index) => ({
    id: match.firebase_uid,
    name: match.name || 'Anonymous User',
    avatar: (match.name || 'A').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
    skills: match.skills ? match.skills.map(skill => skill.name || skill) : [], // What they can teach
    interests: match.interests ? match.interests.map(interest => interest.name || interest) : [], // What they want to learn
    rating: 4.8, // Default rating since we don't have this in backend yet
    location: match.city && match.country ? `${match.city}, ${match.country}` : 'Location not set',
    isOnline: true, // Default to online since we don't have this in backend yet
    lastActive: 'Recently',
    coordinates: [43.6532 + (index * 0.01), -79.3832 + (index * 0.01)] // Spread out around Toronto
  }));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Check if user meets verification requirements
  const hasVerifiedSkill = userProfile?.skills?.some(skill => skill.verified) || false;
  const hasInterest = userProfile?.interests?.length > 0 || false;
  const meetsRequirements = hasVerifiedSkill && hasInterest;

  // Toronto coordinates
  const torontoCoords = [43.6532, -79.3832];

  // Map component with proper error handling
  const MapComponent = ({ selectedCoords, matches }) => {
    React.useEffect(() => {
      setMapLoaded(true);
    }, []);

    if (!mapLoaded) {
      return (
        <Box sx={{ 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 3
        }}>
          <Typography>Loading map...</Typography>
        </Box>
      );
    }

    return (
      <MapContainer 
        center={selectedCoords || torontoCoords} 
        zoom={10} 
        style={{ height: '100%', width: '100%' }}
        key={mapLoaded ? 'loaded' : 'loading'}
      >
        <TileLayer 
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        />
        {selectedCoords && (
          <>
            <MapUpdater coords={selectedCoords} />
            <Circle center={selectedCoords} radius={1609} color="purple" />
          </>
        )}
        {matches.map((match) => (
          <Marker key={match.id} position={match.coordinates}>
            <Popup>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{match.name}</Typography>
                <Typography variant="body2" color="text.secondary">{match.location}</Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                  <Star sx={{ color: 'warning.main', fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{match.rating}</Typography>
                </Box>
              </Box>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

  // Filter matches by skill or interest
  const filteredMatches = searchSkill.trim() === ""
    ? transformedMatches
    : transformedMatches.filter(match =>
        match.skills.some(skill =>
          skill.toLowerCase().includes(searchSkill.trim().toLowerCase())
        ) ||
        match.interests.some(interest =>
          interest.toLowerCase().includes(searchSkill.trim().toLowerCase())
        )
      );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      py: { xs: 3, md: 4 },
      px: { xs: 2, md: 4 }
    }}>
      {/* Only show Matches and Map sections */}
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '100%'
      }}>
        <Box sx={{ 
          flex: '0 0 40%', 
          pl: { xs: 0, md: 4 },
          minWidth: 0
        }}>
          {/* Welcome Section */}
          <Fade in={true} timeout={600}>
            <Box sx={{ 
              mb: 3,
              textAlign: 'left'
            }}>
              <Typography 
                variant="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '1.5rem', md: '2rem' },
                  mb: 1,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Welcome back, User! 👋
              </Typography>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  lineHeight: 1.5,
                  fontWeight: 400
                }}
              >
                Ready to learn something new today? Here are your matches and trending skills.
              </Typography>
            </Box>
          </Fade>

          <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, fontSize: { xs: '1.5rem', md: '2rem' }, color: 'text.primary' }}>Your Matches</Typography>
              <Button variant="outlined" size="small" startIcon={<FilterList />} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, borderColor: 'primary.main', color: 'primary.main', '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.08)', borderColor: 'primary.dark' } }}>Filter</Button>
            </Box>
            
            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
                <CircularProgress size={40} />
                <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
                  Finding your matches...
                </Typography>
              </Box>
            )}
            
            {/* Error State */}
            {error && !loading && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            
            {/* Message from backend (eligibility or no matches) */}
            {message && !loading && !error && (
              <Alert 
                severity={message.includes('need to') ? 'warning' : message.includes('Found') ? 'success' : 'info'} 
                sx={{ mb: 3, borderRadius: 2 }}
              >
                {message}
              </Alert>
            )}
            
            {/* Verification Requirement Message */}
            {!profileLoading && !meetsRequirements && (
              <Alert 
                severity="warning" 
                sx={{ mb: 3, borderRadius: 2 }}
                action={
                  <Button 
                    color="inherit" 
                    size="small" 
                    onClick={() => navigate('/profile')}
                    sx={{ fontWeight: 'bold' }}
                  >
                    Complete Profile
                  </Button>
                }
              >
                <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Complete your profile to see matches!
                </Typography>
                <Typography variant="body2">
                  You need at least <strong>1 verified skill</strong> and <strong>1 interest</strong> to find matches. 
                  {!hasVerifiedSkill && ' Add skills and verify them with video assessments. Only verified skills are used for matching. '}
                  {!hasInterest && ' Add interests to show what you want to learn. '}
                  Click "Complete Profile" to get started.
                </Typography>
              </Alert>
            )}
            
            {/* Matches List */}
            {!loading && !error && meetsRequirements && (
              <List sx={{ p: 0 }}>
                {filteredMatches.map((match, index) => (
                  <Grow key={match.id} in={true} timeout={800 + index * 200}>
                    <ListItem 
                      sx={{ px: 0, py: 1, cursor: 'pointer', bgcolor: selectedUserId === match.id ? 'rgba(102, 126, 234, 0.08)' : 'inherit' }}
                      onClick={() => { setSelectedCoords(match.coordinates); setSelectedUserId(match.id); }}
                    >
                      <ListItemButton sx={{ borderRadius: 3, mb: 2, p: 3, transition: 'all 0.3s ease-in-out', border: '1px solid rgba(0,0,0,0.06)', '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.04)', transform: 'translateY(-2px)', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', borderColor: 'primary.main' } }}>
                        <ListItemAvatar sx={{ mr: 2 }}>
                          <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} badgeContent={<Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: match.isOnline ? 'success.main' : 'grey.400', border: '3px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />}> <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: '1.5rem', fontWeight: 700, boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)' }}>{match.avatar}</Avatar> </Badge>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1rem', md: '1.25rem' }, color: 'text.primary' }}>
                                {match.name}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Star sx={{ color: 'warning.main', fontSize: 18 }} />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{match.rating}</Typography>
                              </Box>
                            </Box>
                          } 
                          secondary={
                            <Box>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                                <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                  {match.location}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
                                  {match.isOnline ? (
                                    <OnlinePrediction sx={{ fontSize: 16, color: 'success.main' }} />
                                  ) : (
                                    <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    {match.lastActive}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              {/* Skills Section - What they can teach */}
                              {match.skills.length > 0 && (
                                <Box sx={{ mb: 1.5 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 0.5 }}>
                                    🎯 Can Teach:
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {match.skills.map((skill, skillIndex) => (
                                      <Chip 
                                        key={skillIndex} 
                                        label={skill} 
                                        size="small" 
                                        sx={{ 
                                          bgcolor: 'rgba(102, 126, 234, 0.1)', 
                                          color: 'primary.main', 
                                          fontWeight: 600, 
                                          fontSize: '0.75rem', 
                                          '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.2)' } 
                                        }} 
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                              
                              {/* Interests Section - What they want to learn */}
                              {match.interests.length > 0 && (
                                <Box sx={{ mb: 1 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'secondary.main', display: 'block', mb: 0.5 }}>
                                    📚 Wants to Learn:
                                  </Typography>
                                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    {match.interests.map((interest, interestIndex) => (
                                      <Chip 
                                        key={interestIndex} 
                                        label={interest} 
                                        size="small" 
                                        sx={{ 
                                          bgcolor: 'rgba(156, 39, 176, 0.1)', 
                                          color: 'secondary.main', 
                                          fontWeight: 600, 
                                          fontSize: '0.75rem', 
                                          '&:hover': { bgcolor: 'rgba(156, 39, 176, 0.2)' } 
                                        }} 
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          } 
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, ml: 2 }}>
                          <Button 
                            variant="contained" 
                            size="small" 
                            startIcon={<Message />} 
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)', '&:hover': { boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)', transform: 'translateY(-1px)' } }}
                            onClick={e => { e.stopPropagation(); navigate(`/chat?userId=${match.id}`); }}
                          >
                            Message
                          </Button>
                          <Button 
                            variant="outlined" 
                            size="small" 
                            startIcon={<VideoCall />} 
                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, borderColor: 'primary.main', color: 'primary.main', '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.08)', borderColor: 'primary.dark' } }}
                            onClick={e => e.stopPropagation()}
                          >
                            Call
                          </Button>
                        </Box>
                      </ListItemButton>
                    </ListItem>
                  </Grow>
                ))}
                {filteredMatches.length === 0 && !loading && !error && !message?.includes('need to') && meetsRequirements && (
                  <Typography sx={{ p: 3, textAlign: 'center', color: 'text.secondary', fontWeight: 600 }}>
                    No matches found for that skill.
                  </Typography>
                )}
              </List>
            )}
          </Paper>
        </Box>
        <Box sx={{ 
          flex: '1 1 60%',
          pr: { xs: 0, md: 4 },
          minWidth: 0
        }}>
          {/* Search Container */}
          <Paper elevation={0} sx={{ 
            mb: 3, 
            p: 3, 
            borderRadius: 4, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255, 255, 255, 0.2)' 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Search Skills & Interests</Typography>
              <TextField
                placeholder="Search for skills or interests..."
                size="small"
                value={searchSkill}
                onChange={e => setSearchSkill(e.target.value)}
                sx={{
                  width: 'calc(100% - 180px)',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    }
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ borderRadius: 4, height: 'fit-content', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <Box sx={{ p: 3, pb: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>Match Locations</Typography>
            </Box>
            <Box sx={{ height: 500, width: '100%', borderRadius: 3, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)' }}>
              <MapComponent selectedCoords={selectedCoords} matches={filteredMatches} />
            </Box>
          </Paper>
          
          {/* Popular Skills Section */}
          <Paper elevation={0} sx={{ 
            mt: 3, 
            p: 3, 
            borderRadius: 4, 
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
            background: 'rgba(255, 255, 255, 0.9)', 
            backdropFilter: 'blur(20px)', 
            border: '1px solid rgba(255, 255, 255, 0.2)' 
          }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Popular Skills</Typography>
              <Button variant="outlined" size="small" startIcon={<TrendingUp />} sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, borderColor: 'primary.main', color: 'primary.main', '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.08)', borderColor: 'primary.dark' } }}>View All</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
              {popularSkills.map((skill, index) => (
                <Grow key={skill} in={true} timeout={600 + index * 100}>
                  <Chip 
                    label={skill} 
                    size="medium" 
                    sx={{ 
                      bgcolor: 'rgba(102, 126, 234, 0.1)', 
                      color: 'primary.main', 
                      fontWeight: 600, 
                      fontSize: '0.875rem',
                      px: 1,
                      py: 2,
                      '&:hover': { 
                        bgcolor: 'rgba(102, 126, 234, 0.2)',
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)'
                      },
                      transition: 'all 0.2s ease-in-out'
                    }} 
                  />
                </Grow>
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;