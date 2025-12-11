const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ItemDonation = sequelize.define('ItemDonation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    donorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    itemType: {
        type: DataTypes.ENUM('medicine', 'equipment', 'other'),
        allowNull: false
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: true
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
    donationType: {
        type: DataTypes.ENUM('matched request', 'crowdsourced inventory'),
        allowNull: false
    },
    requestId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    time: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'item_donations',
    timestamps: true
});

module.exports = ItemDonation;
