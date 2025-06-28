import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Box, Button, Typography, Paper, IconButton } from '@mui/material';
import { CallEnd, Videocam, Mic, MicOff, VideocamOff, Person } from '@mui/icons-material';
import io from 'socket.io-client';

const SIGNALING_SERVER_URL = 'http://localhost:8080';

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const remoteName = location.state?.remoteName || 'User';
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [callActive, setCallActive] = useState(false);
  const localStreamRef = useRef(null);
  const [localStreamAvailable, setLocalStreamAvailable] = useState(false);
  const [remoteStreamAvailable, setRemoteStreamAvailable] = useState(false);

  useEffect(() => {
    const s = io(SIGNALING_SERVER_URL);
    setSocket(s);
    return () => s.disconnect();
  }, []);

  useEffect(() => {
    if (!socket) return;
    let pc;
    let localStream;

    const start = async () => {
      localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = localStream;
      setLocalStreamAvailable(true);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
      pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      setPeerConnection(pc);
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));
      
      pc.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
          setRemoteStreamAvailable(true);
        }
      };
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit('ice-candidate', { roomId, candidate: event.candidate });
        }
      };
      
      socket.emit('join-room', roomId);
      setCallActive(true);
    };
    start();

    socket.on('user-joined', async () => {
      if (pc) {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { roomId, sdp: offer });
      }
    });
    socket.on('offer', async ({ sdp }) => {
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { roomId, sdp: answer });
      }
    });
    socket.on('answer', async ({ sdp }) => {
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });
    socket.on('ice-candidate', async ({ candidate }) => {
      if (pc) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) { /* ignore */ }
      }
    });
    socket.on('user-left', () => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = null;
        setRemoteStreamAvailable(false);
      }
    });

    return () => {
      socket.emit('leave-room', roomId);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (pc) pc.close();
    };
  }, [socket, roomId]);

  const handleEndCall = () => {
    const chatId = location.state?.chatId;
    if (chatId) {
      navigate(`/chat?userId=${chatId}`);
    } else {
      navigate('/chat');
    }
  };

  const toggleMic = () => {
    setMicOn((prev) => {
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach(track => track.enabled = !prev);
      }
      return !prev;
    });
  };

  const toggleCam = () => {
    setCamOn((prev) => {
      if (localStreamRef.current) {
        localStreamRef.current.getVideoTracks().forEach(track => track.enabled = !prev);
      }
      return !prev;
    });
  };

  const videoBoxStyles = {
    position: 'relative',
    width: 340,
    height: 255,
    background: 'linear-gradient(135deg, #e3e9f7 0%, #f8fafc 100%)',
    borderRadius: 4,
    boxShadow: '0 4px 24px 0 rgba(102,126,234,0.10)',
    border: '2.5px solid #e0e7ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    mb: 1
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e3e9f7 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 5, maxWidth: 900, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, boxShadow: '0 8px 40px rgba(102,126,234,0.10)' }}>
        <Typography variant="h4" fontWeight={800} mb={2} sx={{ color: 'primary.main', letterSpacing: 1 }}>
          Video Call with {remoteName}
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, width: '100%', justifyContent: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle2" align="center" sx={{ mb: 1, fontWeight: 700, color: 'primary.main', letterSpacing: 0.5 }}>You</Typography>
            <Box sx={videoBoxStyles}>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: 340,
                  height: 255,
                  borderRadius: 4,
                  objectFit: 'cover',
                  background: 'transparent',
                  display: localStreamAvailable && camOn ? 'block' : 'none',
                  position: 'absolute',
                  left: 0,
                  top: 0
                }}
              />
              {(!localStreamAvailable || !camOn) && (
                <Person sx={{ fontSize: 110, color: '#b3b8d8', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
              )}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="subtitle2" align="center" sx={{ mb: 1, fontWeight: 700, color: 'primary.main', letterSpacing: 0.5 }}>
              {remoteName}
            </Typography>
            <Box sx={videoBoxStyles}>
              {remoteStreamAvailable ? (
                <video ref={remoteVideoRef} autoPlay playsInline style={{ width: 340, height: 255, borderRadius: 4, objectFit: 'cover', background: 'transparent' }} />
              ) : (
                <Person sx={{ fontSize: 110, color: '#b3b8d8' }} />
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
          <IconButton color={micOn ? 'primary' : 'error'} onClick={toggleMic} sx={{ bgcolor: micOn ? 'rgba(102,126,234,0.08)' : 'rgba(239,68,68,0.08)', transition: 'all 0.2s' }}>
            {micOn ? <Mic /> : <MicOff />}
          </IconButton>
          <IconButton color={camOn ? 'primary' : 'error'} onClick={toggleCam} sx={{ bgcolor: camOn ? 'rgba(102,126,234,0.08)' : 'rgba(239,68,68,0.08)', transition: 'all 0.2s' }}>
            {camOn ? <Videocam /> : <VideocamOff />}
          </IconButton>
          <Button variant="contained" color="error" startIcon={<CallEnd />} onClick={handleEndCall} sx={{ fontWeight: 700, px: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(239,68,68,0.10)' }}>
            End Call
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default VideoCall; 