const express = require('express');
const router = express.Router();
const chatController = require('../controllers/anonymousChatController');

/**
 * @swagger
 * tags:
 *   - name: Anonymous Therapy Chat
 *     description: Private 1-on-1 chat system (No Stigma)
 */

/**
 * @swagger
 * /api/chat/start:
 *   post:
 *     summary: Start a new anonymous chat session
 *     tags: [Anonymous Therapy Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *               doctorId:
 *                 type: integer
 *               topic:
 *                 type: string
 *                 example: "Anxiety & Stress"
 *     responses:
 *       201:
 *         description: Chat session started
 */
router.post('/start', chatController.startChat);

/**
 * @swagger
 * /api/chat/send:
 *   post:
 *     summary: Send a private message
 *     tags: [Anonymous Therapy Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: integer
 *               senderId:
 *                 type: integer
 *               senderType:
 *                 type: string
 *                 enum: [Patient, Doctor]
 *               content:
 *                 type: string
 *                 example: "Hello doctor, I feel overwhelmed."
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post('/send', chatController.sendMessage);

/**
 * @swagger
 * /api/chat/history/{chatId}:
 *   get:
 *     summary: Get chat history (Names hidden automatically)
 *     tags: [Anonymous Therapy Chat]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat history
 */
router.get('/history/:chatId', chatController.getMessages);

/**
 * @swagger
 * /api/chat/close:
 *   post:
 *     summary: End the chat session
 *     tags: [Anonymous Therapy Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               chatId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Chat closed
 */
router.post('/close', chatController.closeChat);

module.exports = router;