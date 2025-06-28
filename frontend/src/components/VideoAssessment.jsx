import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Grid
} from '@mui/material';
import {
  CloudUpload,
  Videocam,
  PlayArrow,
  CheckCircle,
  Warning,
  Assessment,
  Psychology,
  TrendingUp,
  School,
  Close
} from '@mui/icons-material';
import geminiService from '../services/geminiService';

const VideoAssessment = ({ onAssessmentComplete, onClose }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file.');
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        setError('Video file size must be less than 100MB.');
        return;
      }

      setError('');
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setAssessmentResult(null);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      setError('Please select a video file first.');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      await handleAnalysis();
      
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const result = await geminiService.analyzeVideoAssessment(videoFile.name);
      setAssessmentResult(result);
      
      if (onAssessmentComplete) {
        onAssessmentComplete(result);
      }

    } catch (error) {
      console.error('Analysis error:', error);
      setError('Failed to analyze video. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setAssessmentResult(null);
    setError('');
    setUploadProgress(0);
  };

  const getAssessmentColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getAssessmentMessage = (score) => {
    if (score >= 80) return 'Excellent! You can continue with your profile.';
    if (score >= 60) return 'Good, but you need to improve. Please resubmit.';
    return 'Needs improvement. Please resubmit with better quality.';
  };

  return (
    <Dialog 
      open={true} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Assessment sx={{ color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Video Assessment
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {!assessmentResult ? (
          <Box>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                mb: 3,
                border: '2px dashed',
                borderColor: videoFile ? 'success.main' : 'grey.300',
                borderRadius: 3,
                textAlign: 'center',
                background: videoFile ? 'rgba(76, 175, 80, 0.05)' : 'rgba(0, 0, 0, 0.02)',
                transition: 'all 0.3s ease'
              }}
            >
              {!videoFile ? (
                <Box>
                  <CloudUpload sx={{ 
                    fontSize: 64, 
                    color: 'primary.main', 
                    mb: 2 
                  }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Upload Your Assessment Video
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Record a 2-5 minute video explaining a topic you want to teach.
                    Show your expertise and teaching style.
                  </Typography>
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<Videocam />}
                    sx={{ 
                      borderRadius: 2,
                      py: 1.5,
                      px: 3,
                      fontWeight: 'bold',
                      textTransform: 'none'
                    }}
                  >
                    Select Video File
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      onChange={handleFileSelect}
                    />
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Videocam sx={{ 
                    fontSize: 48, 
                    color: 'success.main', 
                    mb: 2 
                  }} />
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Video Selected: {videoFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={() => setShowPreview(true)}
                      startIcon={<PlayArrow />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Preview
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleUpload}
                      disabled={isUploading || isAnalyzing}
                      startIcon={isUploading || isAnalyzing ? <CircularProgress size={20} /> : <CloudUpload />}
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      {isUploading ? 'Uploading...' : isAnalyzing ? 'Analyzing...' : 'Upload & Analyze'}
                    </Button>
                  </Box>
                </Box>
              )}
            </Paper>

            {(isUploading || isAnalyzing) && (
              <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {isUploading ? 'Uploading Video...' : 'Analyzing with AI...'}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={isUploading ? uploadProgress : 100} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    mb: 2
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {isUploading 
                    ? `Upload progress: ${uploadProgress}%`
                    : 'Our AI is analyzing your teaching skills, communication, and expertise...'
                  }
                </Typography>
              </Paper>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Assessment Guidelines
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <School color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Choose a topic you're passionate about teaching"
                      secondary="Demonstrate your knowledge and enthusiasm"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Psychology color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Show clear communication skills"
                      secondary="Speak clearly and organize your thoughts well"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUp color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Keep it between 2-5 minutes"
                      secondary="Concise but comprehensive explanation"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Box>
            <Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 2, 
                  mb: 2 
                }}>
                  {assessmentResult.score >= 80 ? (
                    <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
                  ) : (
                    <Warning sx={{ fontSize: 48, color: 'warning.main' }} />
                  )}
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Assessment Complete
                  </Typography>
                </Box>
                
                <Chip
                  label={`Score: ${assessmentResult.score}/100`}
                  color={getAssessmentColor(assessmentResult.score)}
                  sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold',
                    py: 1,
                    px: 2
                  }}
                />
                
                <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                  {getAssessmentMessage(assessmentResult.score)}
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Detailed Feedback
              </Typography>
              
              <Grid container spacing={3}>
                {assessmentResult.categories.map((category, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ borderRadius: 3 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          {category.icon}
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {category.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {category.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={category.score} 
                            sx={{ 
                              flexGrow: 1, 
                              height: 8, 
                              borderRadius: 4 
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {category.score}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  AI Recommendations
                </Typography>
                <List>
                  {assessmentResult.recommendations.map((rec, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <CheckCircle color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={rec} />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              {assessmentResult.score < 80 ? (
                <Button
                  variant="contained"
                  onClick={handleRetry}
                  startIcon={<Videocam />}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5,
                    px: 3,
                    fontWeight: 'bold',
                    textTransform: 'none'
                  }}
                >
                  Record New Video
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={onClose}
                  startIcon={<CheckCircle />}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.5,
                    px: 3,
                    fontWeight: 'bold',
                    textTransform: 'none'
                  }}
                >
                  Continue to Profile
                </Button>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <Dialog 
        open={showPreview} 
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Video Preview
          <IconButton
            onClick={() => setShowPreview(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <video
            ref={videoRef}
            controls
            style={{ width: '100%', borderRadius: 8 }}
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default VideoAssessment;
