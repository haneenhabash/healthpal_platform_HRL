// src/models/TreatmentCase.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const TreatmentCase = sequelize.define('TreatmentCase', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    treatmentType: {
        type: DataTypes.ENUM('surgery', 'cancer_treatment', 'dialysis', 'rehabilitation'),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    amountRaised: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    amountNeeded: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'fully_funded', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    urgencyLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium'
    },
    story: {
        type: DataTypes.TEXT
    },
    medicalHistory: {
        type: DataTypes.TEXT
    },
    consentGiven: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    patientFeedback: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    recoveryUpdates: {
        type: DataTypes.JSON
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: true // It might be null for cash donations
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'stripe'
    }

}, {
    tableName: 'TreatmentCase',
    timestamps: true
});

module.exports = TreatmentCase;