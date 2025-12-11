// src/models/HealthGuide.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HealthGuide = sequelize.define('HealthGuide', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Title is required' }
    }
  },
  category: {
    type: DataTypes.ENUM('first-aid', 'chronic-illness', 'nutrition', 'maternal-care', 'mental-health'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['first-aid', 'chronic-illness', 'nutrition', 'maternal-care', 'mental-health']],
        msg: 'Invalid category'
      }
    }
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'Arabic'
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Content cannot be empty' }
    }
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  source: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = HealthGuide;
