const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Patient = sequelize.define('Patient', {
  // 1. تعريف الـ ID بشكل صريح (Sequence)
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // هذا يجعله Sequence
    allowNull: false
  },
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
    validate: { isEmail: true }
  },
  phone: { type: DataTypes.STRING },
  medicalHistory: { type: DataTypes.TEXT },
  language: { type: DataTypes.STRING, defaultValue: 'Arabic' },

  nickname: { type: DataTypes.STRING, unique: true },
  isAnonymousMode: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Patient;