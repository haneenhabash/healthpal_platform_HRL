const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
  
  
  const Doctor = sequelize.define('Doctor', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specialty: {
  type: DataTypes.ENUM(
    'general',
    'pediatrics',
    'mental-health',
    'cardiology',
    'dermatology',
    'gynecology',
    'neurology',
    'orthopedics',
    'ophthalmology',
    'dentistry',
    'surgery',
    'internal-medicine',
    'endocrinology',
    'urology',
    'oncology',
    'infectious-diseases',
    'emergency',
    'nutrition',
    'rehabilitation',
    'radiology'
  ),
  allowNull: false
},

    locationType: {
      type: DataTypes.ENUM('local', 'international'),
      allowNull: false
    },
    email: {
  type: DataTypes.STRING,
  allowNull: false,
  
  unique: {
    name: 'doctors_email_unique',
    msg: 'Email must be unique'
  },
  validate: {
    isEmail: true
  }
},
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
  language: { type: DataTypes.STRING, defaultValue: 'Arabic' },
  experienceYears: { type: DataTypes.INTEGER, defaultValue: 0 }
 });
 
module.exports = Doctor;
