const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Donation = sequelize.define('Donation', {
    donorId: { type: DataTypes.INTEGER, allowNull: false },
    treatmentCaseId: { type: DataTypes.INTEGER, allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    donationDate: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    paymentMethod: { type: DataTypes.STRING },
    transactionId: { type: DataTypes.STRING, unique: true },
    isAnonymous: { type: DataTypes.BOOLEAN, defaultValue: false },
    message: { type: DataTypes.TEXT },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
    }
});

module.exports = Donation;