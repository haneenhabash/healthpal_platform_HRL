// models/NGO.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Donor = require('./Donor');

const NGO = sequelize.define('NGO', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  donorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true  
  },

  ngoName: { type: DataTypes.STRING, allowNull: false },
  registrationNumber: { type: DataTypes.STRING },
  website: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },

  verificationStatus: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationNotes: { type: DataTypes.TEXT },
  documentsUrl: { type: DataTypes.STRING }
}, {
  tableName: 'ngos'
});

Donor.hasOne(NGO, { foreignKey: 'donorId' });
NGO.belongsTo(Donor, { foreignKey: 'donorId' });

module.exports = NGO;
