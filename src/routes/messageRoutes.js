/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Doctor-patient messaging with auto-translation
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 27
 *         content:
 *           type: string
 *           example: "مرحبا دكتور، أحس بصداع من الصباح"
 *         translatedContent:
 *           type: string
 *           nullable: true
 *           example: "Hello doctor, I have a headache since the morning"
 *         senderType:
 *           type: string
 *           enum: [doctor, patient]
 *           example: "patient"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-11-29T14:35:48.133Z"
 *         ConsultationId:
 *           type: integer
 *           example: 6
 *
 *     SendMessageRequest:
 *       type: object
 *       required:
 *         - content
 *         - senderType
 *         - ConsultationId
 *       properties:
 *         content:
 *           type: string
 *           example: "مرحبا دكتور، أحس بصداع من الصباح"
 *         senderType:
 *           type: string
 *           enum: [doctor, patient]
 *           example: "patient"
 *         ConsultationId:
 *           type: integer
 *           example: 6
 *
 *     SendMessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Message sent successfully"
 *         data:
 *           $ref: '#/components/schemas/Message'
 *         mode:
 *           type: string
 *           example: "online translation"
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Send a translated or original message within a consultation
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SendMessageRequest'
 *     responses:
 *       201:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SendMessageResponse'
 *       400:
 *         description: Invalid consultation or message type
 *       404:
 *         description: Consultation not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/messages/{consultationId}:
 *   get:
 *     summary: Get all messages of a specific consultation
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: consultationId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       500:
 *         description: Server error
 */

// src/routes/messageRoutes.js
const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.post('/', messageController.sendMessage);
router.get('/:consultationId', messageController.getMessagesByConsultation);

module.exports = router;
