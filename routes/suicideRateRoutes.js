const express = require('express');
const { getSuicideRates, getMetrics, getCountries } = require('../controllers/suicideRateController');
const router = express.Router();

// Route to fetch suicide rates by country and year
router.get('/suicideRates', getSuicideRates);

// Route to calculate metrics for a specified demographic
router.get('/suicideRates/metrics', getMetrics);

// Route to get a list of unique countries
router.get('/countries', getCountries);

module.exports = router;
