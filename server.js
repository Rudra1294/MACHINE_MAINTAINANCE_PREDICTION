require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const diagnosticRoutes = require('./routes/diagnostic');
const adminRoutes = require('./routes/admin');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/diagnostic', diagnosticRoutes);
app.use('/api/admin', adminRoutes);

// Database Connection & Server Initialization
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Node.js Orchestrator is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });