/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Doctor-patient chat and translation system
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a message within a consultation
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "مرحبا دكتور، أشعر بتعب منذ الصباح."
 *               senderType:
 *                 type: string
 *                 enum: [doctor, patient]
 *                 example: "patient"
 *               ConsultationId:
 *                 type: integer
 *                 example: 6
 *     responses:
 *       201:
 *         description: Message sent successfully
 *       400:
 *         description: Invalid consultation or message type
 */
// src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.sendMessage);
router.get('/:consultationId', messageController.getMessagesByConsultation);

module.exports = router;
