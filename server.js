// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const suicideRateRoutes = require('./routes/suicideRateRoutes');
const path = require('path');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

// Serve frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Register the routes
app.use('/api', suicideRateRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
