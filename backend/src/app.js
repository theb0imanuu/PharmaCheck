const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes (Placeholders)
app.get('/', (req, res) => {
  res.send('PharmaCheck Backend is running');
});

module.exports = app;
