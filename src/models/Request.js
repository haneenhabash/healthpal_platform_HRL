// src/models/Request.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Patient = require('./Patient');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Patient,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  type: {
    type: DataTypes.ENUM('medicine', 'equipment', 'other'),
    allowNull: false
  },
  itemId: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  itemName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  status: {
    type: DataTypes.ENUM('pending', 'matched', 'cancelled', 'delivered'),
    defaultValue: 'pending'
  },
  timeRequested: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  lastEdited: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'requests',
  timestamps: false 
});

Request.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

module.exports = Request;
