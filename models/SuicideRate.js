const mongoose = require('mongoose');

const suicideRateSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  SuicideRate_BothSexes_RatePer100k_2021: String,
  SuicideRate_Male_RatePer100k_2021: String,
  SuicideRate_Female_RatePer100k_2021: String,
  SuicideRate_BothSexes_RatePer100k_2020: String,
  SuicideRate_Male_RatePer100k_2020: String,
  SuicideRate_Female_RatePer100k_2020: String,
  SuicideRate_BothSexes_RatePer100k_2019: String,
  SuicideRate_Male_RatePer100k_2019: String,
  SuicideRate_Female_RatePer100k_2019: String
});

module.exports = mongoose.model('SuicideRate', suicideRateSchema);
