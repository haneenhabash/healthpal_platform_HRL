const { AnonymousChat, PrivateMessage, Patient, Doctor } = require('../models');

exports.startChat = async (req, res) => {
    try {
        const { patientId, doctorId, topic } = req.body;

        const existingChat = await AnonymousChat.findOne({
            where: { patientId, doctorId, status: 'Active' }
        });

        if (existingChat) {
            return res.json({ msg: 'Chat already active', chat: existingChat });
        }

        const chat = await AnonymousChat.create({
            patientId,
            doctorId,
            topic
        });

        res.status(201).json({ msg: 'Anonymous session started', chat });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.sendMessage = async (req, res) => {
    try {
        const { chatId, senderId, senderType, content } = req.body;

        const message = await PrivateMessage.create({
            chatId,
            senderId,
            senderType,
            content
        });

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await AnonymousChat.findByPk(chatId, {
            include: [
                { model: Doctor, attributes: ['id', 'name'] },
                { model: Patient, attributes: ['id', 'name'] }
            ]
        });

        if (!chat) return res.status(404).json({ error: 'Chat not found' });

        const messages = await PrivateMessage.findAll({
            where: { chatId },
            order: [['createdAt', 'ASC']]
        });

        res.json({ chat, messages });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

exports.closeChat = async (req, res) => {
    try {
        const { chatId } = req.body;
        await AnonymousChat.update({ status: 'Closed' }, { where: { id: chatId } });
        res.json({ msg: 'Chat session closed' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};