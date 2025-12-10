const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    treatmentCaseId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    donationId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    invoiceNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    invoiceType: {
        type: DataTypes.ENUM('surgery', 'medication', 'tests', 'hospital', 'other'),
        allowNull: false
    },
    receiptUrl: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'verified'),
        defaultValue: 'pending'
    },
    dateIssued: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    paidAt: {
        type: DataTypes.DATE
    }
}, {
    tableName: 'invoices',
    timestamps: true
});

module.exports = Invoice;