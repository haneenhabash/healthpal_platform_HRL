const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Journal = sequelize.define('Journal', {
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Patients',
            key: 'id'
        }
    },
    content: { type: DataTypes.TEXT },
    mood: { type: DataTypes.STRING },
    entryType: { type: DataTypes.STRING }, // Text, Voice, Drawing
    mediaUrl: { type: DataTypes.STRING },
    isSharedWithDoctor: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = Journal;