const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

// Database and Config
const sequelize = require('./config/db');
const swaggerDocs = require('./swagger');

// Route Imports
const chatRoutes = require('./routes/chatbotRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const healthGuideRoutes = require('./routes/healthGuideRoutes');
const publicAlertRoutes = require('./routes/publicAlertRoutes');
const workshopRoutes = require('./routes/workshopRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const environmentRoutes = require('./routes/environmentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const treatmentCaseRoutes = require('./routes/treatmentCaseRoutes');
const donationRoutes = require('./routes/donationRoutes');
const donorRoutes = require('./routes/donorRoutes');
const transparencyRoutes = require('./routes/transparencyRoutes');
const traumaRoutes = require('./routes/traumaRoutes');
const generalChatRoutes = require('./routes/chatRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- Middleware ---

// Security Headers
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

// Body Parsing
app.use(express.json());

// Logging
app.use(morgan('dev'));

// Static Files (Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

// --- Routes ---

app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/education/guides', healthGuideRoutes);
app.use('/api/alerts', publicAlertRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/environment', environmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use('/api/TreatmentCase', treatmentCaseRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/transparency', transparencyRoutes);
app.use('/api/trauma', traumaRoutes);

// Chat Routes
// Note: You had two routes pointing to '/api/chat'. I have separated them.
app.use('/api/chat', generalChatRoutes); // General messaging
app.use('/api/chatbot', chatRoutes);     // AI Chatbot (Changed path to avoid conflict)

app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Static Files (Frontend)
app.use(express.static(path.join(__dirname, "..", "public")));

// Initialize Swagger (Call this only once)
swaggerDocs(app);

app.use('/api/profile', require('./routes/profileRoutes'));



const requestRoutes = require('./routes/requestRoutes');
app.use('/api/requests', requestRoutes);

const medicineRoutes = require('./routes/medicineRoutes');
app.use('/api/medicines', medicineRoutes);

const equipmentRoutes = require('./routes/equipmentRoutes');
app.use('/api/equipments', equipmentRoutes);


const itemDonationRoutes = require('./routes/itemDonationRoutes');
app.use('/api/item-donations', itemDonationRoutes);

const volunteerRoutes = require('./routes/volunteerRoutes');
app.use('/api/volunteers', volunteerRoutes);

const ngoRoutes = require('./routes/ngoRoutes');
app.use('/api/ngos', ngoRoutes);

app.use("/api/activities", require("./routes/ngoActivityRoutes"));


const availabilityRoutes = require('./routes/availabilityRoutes');
app.use('/api/availabilities', availabilityRoutes);

const appointmentRoutes = require('./routes/appointmentRoutes');
app.use('/api/appointments', appointmentRoutes);

require('./cron/activityNotifier');
require('./utils/sendEmail');



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

// Health Check Endpoint
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

// --- Error Handling ---

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('ERROR STACK:', err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    status: 'error',
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// --- Server Startup ---

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    // هذا الأمر سيقوم بحذف الجداول القديمة وإنشائها من جديد بشكل نظيف
    await sequelize.sync({ alert: true });
    console.log('✅ All tables synced successfully!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(` HealthPal API running on http://localhost:${PORT}`);
      console.log(`📘 Check health: http://localhost:${PORT}/api/health`);
      console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });

  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1); // Exit process on DB failure
  }
}

startServer();

module.exports = app;