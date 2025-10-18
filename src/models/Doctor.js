// src/models/Doctor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Doctor = sequelize.define('Doctor', {
  name: { type: DataTypes.STRING, allowNull: false },
  specialty: { type: DataTypes.STRING, allowNull: false }, // general, pediatrics, mental health
  email: { type: DataTypes.STRING, unique: true },
  phone: { type: DataTypes.STRING },
  language: { type: DataTypes.STRING, defaultValue: 'Arabic' },
  experienceYears: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = Doctor;
