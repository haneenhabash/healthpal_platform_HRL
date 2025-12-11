const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Workshop = sequelize.define('Workshop', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { len: [3, 100] }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString(), 
    }
  },
  locationType: {
    type: DataTypes.ENUM('online', 'onsite'),
    allowNull: false
  },
  locationDetails: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'nutrition',
      'mental-health',
      'first-aid',
      'maternal-care',
      'chronic-illness',
      'general-health'
    ),
    allowNull: false
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'Arabic'
  },
  speaker: {
    type: DataTypes.STRING,
    allowNull: false
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 100,
    validate: { min: 1 }
  },
  status: {
    type: DataTypes.ENUM('upcoming', 'completed', 'cancelled'),
    defaultValue: 'upcoming'
  },
  averageRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  }
});

module.exports = Workshop;
