const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK 👌',
    message: 'HealthPal API is working perfectly! 🏥',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'Medical Consultations',
      'Donation System', 
      'Medicine Management',
      'Mental Health Support'
    ]
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 HealthPal API running on http://localhost:${PORT}`);
  console.log(`📊 Check health: http://localhost:${PORT}/api/health`);
});