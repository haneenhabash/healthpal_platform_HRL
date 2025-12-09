const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const AnonymousChat = sequelize.define('AnonymousChat', {
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Patients',
            key: 'id'
        }
    },
    doctorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: 'Doctors', key: 'id' }
    },
    topic: { type: DataTypes.STRING },
    status: { type: DataTypes.ENUM('Active', 'Closed'), defaultValue: 'Active' },
    revealIdentity: { type: DataTypes.BOOLEAN, defaultValue: false }
});

module.exports = AnonymousChat;