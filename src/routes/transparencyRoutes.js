const express = require('express');
const router = express.Router();
const transparencyController = require('../controllers/transparencyController');

/**
 * @swagger
 * tags:
 *   name: Transparency & Impact
 *   description: Tracking funds, invoices, and patient recovery updates (The Trust Layer)
 */

/**

/**
 * @swagger
 * /api/transparency/case/{caseId}/invoices:
 *   post:
 *     summary: Upload a medical invoice (Proof of spending)
 *     description: Adds an expense record/invoice to the case to justify how donations are used.
 *     tags: [Transparency & Impact]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - description
 *               - invoiceType
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1500.50
 *               description:
 *                 type: string
 *                 example: "Emergency Surgery Fee at Al-Shifa Hospital"
 *               invoiceType:
 *                 type: string
 *                 enum: [surgery, medication, tests, hospital, other]
 *                 example: "surgery"
 *               receiptUrl:
 *                 type: string
 *                 example: "https://example.com/receipts/invoice_123.pdf"
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/case/:caseId/invoices', transparencyController.createInvoice);

/**
 * @swagger
 * /api/transparency/case/{caseId}/updates:
 *   post:
 *     summary: Add a medical recovery update
 *     description: Post news about the patient's health progress (e.g., "Surgery Successful").
 *     tags: [Transparency & Impact]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Surgery Successful"
 *               content:
 *                 type: string
 *                 example: "The patient is now in recovery room and vital signs are stable."
 *               status:
 *                 type: string
 *                 example: "Recovering"
 *     responses:
 *       201:
 *         description: Update posted successfully
 */
router.post('/case/:caseId/updates', transparencyController.addRecoveryUpdate);

/**
 * @swagger
 * /api/transparency/case/{caseId}/feedback:
 *   post:
 *     summary: Add patient feedback or Thank You note
 *     description: Allows the patient to send a message of gratitude to donors.
 *     tags: [Transparency & Impact]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Thank you all for saving my life. I can walk again!"
 *               rating:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       201:
 *         description: Feedback added successfully
 */
router.post('/case/:caseId/feedback', transparencyController.addPatientFeedback);

module.exports = router;