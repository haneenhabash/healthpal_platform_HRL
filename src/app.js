const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const swaggerDocs = require('./swagger');
const path = require('path');


require('./models/index');
const chatRoutes = require('./routes/chatbotRoutes');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require("path");
const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

swaggerDocs(app);

app.use(morgan('dev'));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api/', apiLimiter);

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

app.use('/api/TreatmentCase', require('./routes/treatmentCaseRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/donors', require('./routes/donorRoutes'));
app.use('/api/transparency', require('./routes/transparencyRoutes'));
app.use('/api/trauma', require('./routes/traumaRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use("/api/chat", chatRoutes); // Chatbot routes

const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/payments', paymentRoutes);
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes=require('./routes/authRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 

app.use(express.static(path.join(__dirname, "..", "public")));

swaggerDocs(app);

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

app.use((err, req, res, next) => {
  console.error('ERROR:', err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal server error'
  });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    // alter: true رح ينشئ الجداول الجديدة (Journals, Assessments) بدون حذف البيانات القديمة
    await sequelize.sync({ alter: true });
    console.log('✅ All tables are created or updated!');

    console.log(' All tables are created or updated!');

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

module.exports = app;
