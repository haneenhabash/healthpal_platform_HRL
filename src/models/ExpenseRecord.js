const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ExpenseRecord = sequelize.define('ExpenseRecord', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    treatmentCaseId: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false }, // e.g., "Surgery Invoice", "Medication Bill"
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    imageUrl: { type: DataTypes.STRING }, // URL/Path to the invoice image/PDF
    description: { type: DataTypes.TEXT },
    dateIncurred: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'ExpenseRecords' });

module.exports = ExpenseRecord;