require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authenticate = require('./middlewares/authenticate');

const app = express();
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

// Protect profile routes with authentication middleware
app.use('/api/profile', authenticate, profileRoutes);

// Basic health check or root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
