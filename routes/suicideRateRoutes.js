const express = require('express');
const { getSuicideRates, getMetrics } = require('../controllers/suicideRateController');
const router = express.Router();

// Route to fetch suicide rates by country and year
router.get('/suicideRates', getSuicideRates);

// Route to calculate metrics for a specified demographic
router.get('/suicideRates/metrics', getMetrics);

module.exports = router;
