import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

// Placeholder components for each page
function Home() {
  return <Container><Typography variant="h4">Welcome to MindMate Skill Sharing!</Typography></Container>;
}
function Login() {
  return <Container><Typography variant="h4">Login</Typography></Container>;
}
function Register() {
  return <Container><Typography variant="h4">Register</Typography></Container>;
}
function Dashboard() {
  return <Container><Typography variant="h4">Dashboard: Find Matches & Search Skills</Typography></Container>;
}
function Profile() {
  return <Container><Typography variant="h4">Profile: Verify Teaching Ability</Typography></Container>;
}
function Chat() {
  return <Container><Typography variant="h4">Chat</Typography></Container>;
}

function App() {
  return (
    <Router>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              MindMate
            </Typography>
            <Button color="inherit" component={Link} to="/">Home</Button>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
            <Button color="inherit" component={Link} to="/chat">Chat</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
