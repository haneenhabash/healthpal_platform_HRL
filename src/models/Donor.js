const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Donor = sequelize.define('Donor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Sequelize will now create this index exactly once
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING
    },
    address: {
        type: DataTypes.TEXT
    },

    donorType: {
        type: DataTypes.ENUM('ngo', 'pharmacy', 'hospital', 'private donor', 'volunteer'),
        allowNull: false,
        defaultValue: 'private donor'
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true

});

module.exports = Donor;