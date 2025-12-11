const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GroupMessage = sequelize.define('GroupMessage', {
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'ID of the patient or doctor'
    },
    senderType: {
        type: DataTypes.ENUM('Patient', 'Doctor'),
        defaultValue: 'Patient'
    },
    senderName: {
        type: DataTypes.STRING,
        defaultValue: 'Anonymous'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = GroupMessage;