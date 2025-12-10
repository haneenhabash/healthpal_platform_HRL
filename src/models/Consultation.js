const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Consultation = sequelize.define('Consultation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  
  status: {
    type: DataTypes.ENUM('pending', 'scheduled', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  
}, {
  timestamps: true

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

  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Consultation;