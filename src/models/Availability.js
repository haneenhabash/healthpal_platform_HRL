const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./Doctor');  



const Availability = sequelize.define('Availability', {
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Doctor,
      key: 'id'
    }
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  locationType: {
    type: DataTypes.ENUM('local', 'international'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('available', 'booked'),
    defaultValue: 'available',
    allowNull: false
  }
});
Doctor.hasMany(Availability, { foreignKey: 'doctorId' });
Availability.belongsTo(Doctor, { foreignKey: 'doctorId' });

module.exports = Availability;
