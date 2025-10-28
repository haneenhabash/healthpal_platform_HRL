// src/models/Patient.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define('Patient', {
  name: { type: DataTypes.STRING, allowNull: false },
  age: { type: DataTypes.INTEGER, allowNull: false },
  gender: { type: DataTypes.STRING },
  email: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: {
    name: 'patients_email_unique',
    msg: 'Email must be unique'
  },
  validate: {
    isEmail: true
  }
},
  phone: { type: DataTypes.STRING },
  medicalHistory: { type: DataTypes.TEXT },
  language: { type: DataTypes.STRING, defaultValue: 'Arabic' }
});

module.exports = Patient;
