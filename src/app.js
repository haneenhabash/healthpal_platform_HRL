const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/db');
const swaggerDocs = require('./swagger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const app = express();

app.use(helmet());

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));

app.use(express.json());

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

app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/education/guides', healthGuideRoutes);
app.use('/api/alerts', publicAlertRoutes);
app.use('/api/workshops', workshopRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/environment', environmentRoutes);

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
