const SuicideRate = require('../models/SuicideRate');

// Fetch suicide rates by country and year
exports.getSuicideRates = async (req, res) => {
  try {
    const { country, year } = req.query;

    // Build query based on country
    let query = {};
    if (country) query.country = country;

    // Select specific fields based on year
    let fields = '';
    if (year) {
      fields = `SuicideRate_BothSexes_RatePer100k_${year} SuicideRate_Male_RatePer100k_${year} SuicideRate_Female_RatePer100k_${year}`;
    }

    const rates = await SuicideRate.find(query).select(fields);
    res.json(rates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Calculate metrics for a specified demographic across countries for a specific year
exports.getMetrics = async (req, res) => {
  try {
    const { demographic, year } = req.query;

    // Build the field name dynamically
    const field = `SuicideRate_${demographic}_RatePer100k_${year}`;

    // Retrieve all relevant data
    const allRates = await SuicideRate.find().select(field);
    
    let sum = 0;
    let min = Infinity;
    let max = -Infinity;
    let count = 0;

    // Calculate metrics manually
    allRates.forEach(rate => {
      const value = parseFloat(rate[field]);
      if (!isNaN(value)) {
        sum += value;
        min = Math.min(min, value);
        max = Math.max(max, value);
        count++;
      }
    });

    const average = sum / count;

    res.json({
      average: average || null,
      min: min === Infinity ? null : min,
      max: max === -Infinity ? null : max
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
