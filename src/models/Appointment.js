const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Doctor = require('./Doctor');
const Patient = require('./Patient');
const Availability = require('./Availability');

const Appointment = sequelize.define('Appointment', {
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Doctor, key: 'id' }
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Patient, key: 'id' }
  },
  availabilityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: Availability, key: 'id' }
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending'
  }
});

Availability.hasMany(Appointment, { foreignKey: 'availabilityId' });
Appointment.belongsTo(Availability, { foreignKey: 'availabilityId' });

Doctor.hasMany(Appointment, { foreignKey: 'doctorId' });
Appointment.belongsTo(Doctor, { foreignKey: 'doctorId' });

Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

module.exports = Appointment;
