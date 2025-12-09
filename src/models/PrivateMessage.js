const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PrivateMessage = sequelize.define('PrivateMessage', {
    chatId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    senderType: {
        type: DataTypes.ENUM('Patient', 'Doctor'),
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
});

module.exports = PrivateMessage;