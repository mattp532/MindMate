require('dotenv').config();         
const express = require('express');
const pool = require('./db');
const app = express()

const userRoutes = require('./routes/userRoutes');

app.use(express.json())
app.use('/api', userRoutes)

const PORT = process.env.BACKEND_PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send("Hello, Diddy")
});