const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const SupportGroup = sequelize.define('SupportGroup', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    topic: {
        type: DataTypes.ENUM(
            'War_Trauma',
            'Grief_and_Loss',
            'Mothers_Support',
            'Child_Rehabilitation',
            'General_Anxiety'
        ),
        allowNull: false
    },

    targetAudience: {
        type: DataTypes.ENUM('All', 'Children', 'Teens', 'Adults', 'Women_Only'),
        defaultValue: 'All',
        comment: 'Restricts who can join (e.g., Women_Only for mothers groups)'
    },

    moderatorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID of the doctor/therapist leading the group'
    },

    maxParticipants: {
        type: DataTypes.INTEGER,
        defaultValue: 20
    },

    schedule: {
        type: DataTypes.STRING,
        allowNull: true
    },

    meetingLink: {
        type: DataTypes.STRING,
        allowNull: true
    },


    isAnonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'If true, members real names are hidden'
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = SupportGroup;