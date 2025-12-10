// src/models/PublicAlert.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PublicAlert = sequelize.define('PublicAlert', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: { msg: 'Title is required' } }
  },
  type: {
    type: DataTypes.ENUM('outbreak', 'air-quality', 'emergency', 'awareness'),
    allowNull: false,
    defaultValue: 'awareness'
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'national'
  },
  severity: {
    type: DataTypes.ENUM('low', 'moderate', 'high', 'critical'),
    defaultValue: 'moderate'
  },
  status: {
    type: DataTypes.ENUM('active', 'resolved'),
    defaultValue: 'active'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: 'Content cannot be empty' } }
  },
  issuedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Health Authority'
  },
  validUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = PublicAlert;
