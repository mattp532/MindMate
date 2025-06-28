require('dotenv').config();         
const express = require('express');
const app = express()

const PORT = process.env.BACKEND_PORT || 8080

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send("Hello, Diddy")
});