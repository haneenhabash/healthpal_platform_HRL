
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Donor = sequelize.define('Donor', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING },
    address: { type: DataTypes.TEXT },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
     donorType: {
    type: DataTypes.ENUM('ngo', 'pharmacy', 'hospital', 'private donor', 'volunteer'),
    allowNull: false,
    defaultValue: 'private donor'}
});

module.exports = Donor;