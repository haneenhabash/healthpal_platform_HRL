const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GroupSession = sequelize.define('GroupSession', {
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false
    },
    durationMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 60
    },
    meetingLink: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled'),
        defaultValue: 'Scheduled'
    }
});

module.exports = GroupSession;