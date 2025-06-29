require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const matchesRoutes = require('./routes/findMatches');
const authenticate = require('./middlewares/authenticate');
const { getAllSkills, getSkillDistribution } = require('./controllers/profileController');

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

// Public skills endpoints (no authentication required)
app.get('/api/skills', getAllSkills);
app.get('/api/skills/distribution', getSkillDistribution);

// Protect profile routes with authentication middleware
app.use('/api/profile', authenticate, profileRoutes);

// Protect matches routes with authentication middleware
app.use('/api', authenticate, matchesRoutes);

// Basic health check or root route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
