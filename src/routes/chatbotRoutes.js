const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatbotController');

/**
 * @swagger
 * tags:
 *   name: Chatbot
 *   description: HealthPal AI Assistant interaction APIs
 */

/**
 * @swagger
 * /api/chatbot/ask:
 *   post:
 *     summary: Send a message to the HealthPal AI Assistant
 *     description: Sends a user prompt to the AI and returns a response related to general health, mental wellness, donations, or services in Palestine.
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID of the user (optional, for context/history)
 *                 example: 1
 *               message:
 *                 type: string
 *                 description: The question or prompt for the AI
 *                 example: "How can I manage stress effectively?"
 *     responses:
 *       200:
 *         description: AI response received successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 reply:
 *                   type: string
 *                   description: The AI's answer
 *                   example: "To manage stress, try practicing mindfulness, deep breathing, and regular physical activity. If needed, consult a professional."
 *       400:
 *         description: Missing message field.
 *       500:
 *         description: Internal server error or AI service failure.
 */
router.post('/ask', chatController.chat);

module.exports = router;
