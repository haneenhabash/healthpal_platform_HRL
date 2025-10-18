
const express = require('express'); 
const cors = require('cors');     
require('dotenv').config();       
const sequelize = require('./config/db');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

app.use(cors());
app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'HealthPal API', version: '1.0.0', description: 'API documentation for HealthPal clinical management system' },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./app.js'], 
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));

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

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` HealthPal API running on http://localhost:${PORT}`);
      console.log(` Check health: http://localhost:${PORT}/api/health`);
    });

  } catch (err) {
    console.error(' Database connection failed:', err);
  }
}

startServer();
