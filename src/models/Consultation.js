// src/models/Consultation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Consultation = sequelize.define('Consultation', {
  date: { type: DataTypes.DATE, allowNull: false },
  type: { type: DataTypes.STRING, defaultValue: 'video' }, // video or audio
  status: { type: DataTypes.STRING, defaultValue: 'pending' },
  notes: { type: DataTypes.TEXT },
});

Consultation.belongsTo(Patient);
Consultation.belongsTo(Doctor);

module.exports = Consultation;
