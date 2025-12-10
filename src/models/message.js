const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Consultation = require('./Consultation');

const Message = sequelize.define('Message', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Message content cannot be empty' }
    }
  },
  translatedContent: {
  type: DataTypes.TEXT,
  allowNull: true
},
  senderType: {
    type: DataTypes.ENUM('doctor', 'patient'),
    allowNull: false
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Message.belongsTo(Consultation);
Consultation.hasMany(Message, {
  onDelete: 'CASCADE' 
});

module.exports = Message;
