const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Workshop = require('./Workshop');
const Patient = require('./Patient');

const Registration = sequelize.define('Registration', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  phone: { type: DataTypes.STRING },
  attendance: { type: DataTypes.BOOLEAN, defaultValue: false },
  feedback: { type: DataTypes.TEXT },
  rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  }
});

Registration.belongsTo(Workshop);
Workshop.hasMany(Registration, { onDelete: 'CASCADE' });

Registration.belongsTo(Patient, { allowNull: true });

module.exports = Registration;
