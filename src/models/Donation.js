const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Donation = sequelize.define('Donation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    donorId: {
        type: DataTypes.INTEGER,
        allowNull: false
        // لا نحتاج لتعريف references هنا لأننا عرفناها في ملف relationships
    },
    treatmentCaseId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    donationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'stripe'
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // هذا يكفي لجعل العمود فريداً وإنشاء الفهرس
    },
    isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    message: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = Donation;