// src/models/Equipment.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Equipment = sequelize.define('Equipment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  condition: {
    type: DataTypes.ENUM('new', 'used', 'needs repair'), 
    allowNull: false,
    defaultValue: 'new'
  },
  category: {
    type: DataTypes.STRING,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'equipments',
  timestamps: true
});

module.exports = Equipment;
