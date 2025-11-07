
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const swaggerDocs = require('./swagger');
require('./models/donationRelations');

const app = express();

app.use(cors());
app.use(express.json());
swaggerDocs(app);

const doctorRoutes = require('./routes/doctorRoutes');
app.use('/api/doctors', doctorRoutes);


const patientRoutes = require('./routes/patientRoutes');
app.use('/api/patients', patientRoutes);


const consultationRoutes = require('./routes/consultationRoutes');
app.use('/api/consultations', consultationRoutes);

app.use('/api/TreatmentCase', require('./routes/treatmentCaseRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/transparency', require('./routes/transparencyRoutes'));

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Check if the HealthPal API is running
 *     description: Returns a status message to confirm that the API is active and healthy.
 *     responses:
 *       200:
 *         description: Successful health check
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK 👌"
 *                 message:
 *                   type: string
 *                   example: "HealthPal API is working perfectly! 🏥"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 timestamp:
 *                   type: string
 *                   example: "2025-10-25T23:25:00.000Z"
 */

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

    await sequelize.sync({ alter: true });
    console.log(' All tables are created or updated!');

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
