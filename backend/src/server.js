require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const matchesRoutes = require('./routes/findMatches');
const authenticate = require('./middlewares/authenticate');
const pool = require('./db');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 8080;

// Use cors middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Protect profile routes with authentication middleware
app.use('/api/profile', authenticate, profileRoutes);

// Protect matches routes with authentication middleware
app.use('/api', authenticate, matchesRoutes);

// Basic health check or root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Test database connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT COUNT(*) as user_count FROM users');
    res.json({ 
      message: 'Database connection successful', 
      userCount: result.rows[0].user_count,
      users: await pool.query('SELECT firebase_uid, display_name, email FROM users LIMIT 5')
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ error: 'Database connection failed', details: error.message });
  }
});

// Temporary endpoint to create missing user
app.post('/create-missing-user', authenticate, async (req, res) => {
  try {
    const { uid, email } = req.user;
    console.log('Creating missing user:', uid, email);
    
    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE firebase_uid = $1', [uid]);
    if (existingUser.rows.length > 0) {
      return res.json({ message: 'User already exists', user: existingUser.rows[0] });
    }
    
    // Create user
    const result = await pool.query(
      `INSERT INTO users (firebase_uid, display_name, email, bio, city, country, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [uid, 'User', email, null, null, null]
    );
    
    console.log('User created successfully:', result.rows[0]);
    res.json({ message: 'User created successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user', details: error.message });
  }
});

// Socket.io connection handling
const connectedUsers = new Map(); // Map to store socket connections by user ID

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Authenticate user and store their connection
  socket.on('authenticate', async (data) => {
    try {
      // In a real app, you'd verify the token here
      // For now, we'll trust the client sends the correct user ID
      const userId = data.userId;
      if (userId) {
        connectedUsers.set(userId, socket.id);
        socket.userId = userId;
        socket.join(`user_${userId}`);
        console.log(`User ${userId} authenticated and connected`);
        
        // Notify other users that this user is online
        socket.broadcast.emit('user_online', { userId });
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
  });

  // Handle joining a chat room
  socket.on('join_chat', (matchId) => {
    socket.join(`chat_${matchId}`);
    console.log(`User joined chat: ${matchId}`);
  });

  // Handle leaving a chat room
  socket.on('leave_chat', (matchId) => {
    socket.leave(`chat_${matchId}`);
    console.log(`User left chat: ${matchId}`);
  });

  // Handle new message
  socket.on('send_message', (data) => {
    const { matchId, message, senderId } = data;
    
    // Broadcast message to all users in the chat room
    io.to(`chat_${matchId}`).emit('new_message', {
      matchId,
      message,
      senderId,
      timestamp: new Date()
    });
    
    console.log(`Message sent in chat ${matchId}:`, message);
  });

  // Handle typing indicator
  socket.on('typing_start', (data) => {
    const { matchId, userId } = data;
    socket.to(`chat_${matchId}`).emit('user_typing', { matchId, userId, isTyping: true });
  });

  socket.on('typing_stop', (data) => {
    const { matchId, userId } = data;
    socket.to(`chat_${matchId}`).emit('user_typing', { matchId, userId, isTyping: false });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      // Notify other users that this user is offline
      socket.broadcast.emit('user_offline', { userId: socket.userId });
      console.log(`User ${socket.userId} disconnected`);
    }
    console.log('User disconnected:', socket.id);
  });
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`Socket.io server ready for real-time communication`);
});
