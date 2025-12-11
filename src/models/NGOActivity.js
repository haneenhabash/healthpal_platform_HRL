// models/NGOActivity.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const NGO = require('./NGO');

const NGOActivity = sequelize.define('NGOActivity', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

  ngoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  description: {
    type: DataTypes.TEXT,
  },

  activityType: {
    type: DataTypes.ENUM(
      'medical_mission',
      'mobile_clinic',
      'aid_drop',
      'volunteer_event',
      'awareness_campaign',
      'emergency_response'
    ),
    allowNull: false
  },

  country: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },

  startDate: { type: DataTypes.DATE },
  endDate: { type: DataTypes.DATE },

  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'planned'
  },

  mediaUrl: { type: DataTypes.STRING },

}, {
  tableName: 'ngo_activities'
});

NGO.hasMany(NGOActivity, { foreignKey: 'ngoId' });
NGOActivity.belongsTo(NGO, { foreignKey: 'ngoId' });

module.exports = NGOActivity;
