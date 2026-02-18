const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(process.env.NODE_ENV === 'production' ? require('morgan')('combined') : require('morgan')('dev')); // Optional logger if installed

// Routes
const inventoryRoutes = require('./routes/inventory');
const aiRoutes = require('./routes/ai');

app.use('/api/inventory', inventoryRoutes);
app.use('/api/ai', aiRoutes);

app.get('/', (req, res) => {
  res.send('PharmaCheck Backend is running');
});

module.exports = app;
