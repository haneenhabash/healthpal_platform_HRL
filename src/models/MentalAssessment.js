const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const MentalAssessment = sequelize.define('MentalAssessment', {
    // هنا نربط بجدول المريض
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Patients',
            key: 'id'
        }
    },
    type: { type: DataTypes.STRING, allowNull: false },
    score: { type: DataTypes.INTEGER },
    answers: { type: DataTypes.JSON },
    riskLevel: { type: DataTypes.ENUM('Low', 'Moderate', 'High', 'Critical') }
});

module.exports = MentalAssessment;