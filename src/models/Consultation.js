// src/models/Consultation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Consultation = sequelize.define('Consultation', {
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      notNull: { msg: 'Consultation date is required' }
    }
  },
  type: {
    type: DataTypes.ENUM('video', 'audio', 'message'),
    allowNull: false,
    defaultValue: 'video',
    validate: {
      isIn: {
        args: [['video', 'audio', 'message']],
        msg: 'Consultation type must be video, audio, or message'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

Consultation.belongsTo(Patient);
Consultation.belongsTo(Doctor);

module.exports = Consultation;
