const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const swaggerDocs = require('./swagger');
const path = require('path');


require('./models/index');
const chatRoutes = require('./routes/chatbotRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/trauma', require('./routes/traumaRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use("/api/chat", chatRoutes); // Chatbot routes

const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/payments', paymentRoutes);


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

// [جديد 3] معالج أخطاء عام (Global Error Handler)
// يمنع السيرفر من الانهيار إذا حدث خطأ غير متوقع
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: err.message
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    // alter: true رح ينشئ الجداول الجديدة (Journals, Assessments) بدون حذف البيانات القديمة
    await sequelize.sync({ alter: true });
    console.log('✅ All tables are created or updated!');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 HealthPal API running on http://localhost:${PORT}`);
      console.log(`📘 Check health: http://localhost:${PORT}/api/health`);
      console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });

  } catch (err) {
    console.error('❌ Database connection failed:', err);
  }
}

startServer();