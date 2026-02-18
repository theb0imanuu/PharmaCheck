const express = require('express');
const router = express.Router();
const { getPredictions } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/predict', getPredictions);

module.exports = router;
