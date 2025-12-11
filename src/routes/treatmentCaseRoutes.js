const express = require('express');
const router = express.Router();
const treatmentCaseController = require('../controllers/treatmentCaseController');

/**
 * @swagger
 * tags:
 *   name: Treatment Cases
 *   description: Management of patient treatment cases
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TreatmentCaseInput:
 *       type: object
 *       required:
 *         - patientId
 *         - title
 *         - treatmentType
 *         - description
 *         - totalCost
 *         - amountNeeded
 *       properties:
 *         patientId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Urgent Open Heart Surgery"
 *         treatmentType:
 *           type: string
 *           enum: [surgery, cancer_treatment, dialysis, rehabilitation]
 *           example: "surgery"
 *         description:
 *           type: string
 *           example: "Needs heart surgery due to a congenital valve defect"
 *         totalCost:
 *           type: number
 *           example: 15000
 *         story:
 *           type: string
 *           example: "Ahmad, 35 years old, suffers from heart failure..."
 *         medicalHistory:
 *           type: string
 *           example: "Diagnosed with congenital heart failure, requires urgent surgery"
 *         urgencyLevel:
 *           type: string
 *           enum: [low, medium, high, critical]
 *           example: "critical"
 *         consentGiven:
 *           type: boolean
 *           example: true
 *         amountNeeded:
 *           type: number
 *           example: 5000
 *
 *     TreatmentCaseResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         patientId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "Urgent Open Heart Surgery"
 *         treatmentType:
 *           type: string
 *           example: "surgery"
 *         description:
 *           type: string
 *           example: "Needs heart surgery due to a congenital valve defect"
 *         totalCost:
 *           type: string
 *           example: "15000.00"
 *         amountRaised:
 *           type: string
 *           example: "5000.00"
 *         amountNeeded:
 *           type: string
 *           example: "10000.00"
 *         status:
 *           type: string
 *           example: "active"
 *         urgencyLevel:
 *           type: string
 *           example: "critical"
 *         story:
 *           type: string
 *           example: "Ahmad, 35 years old, suffers from heart failure..."
 *         medicalHistory:
 *           type: string
 *           example: "Diagnosed with congenital heart failure, requires urgent surgery"
 *         consentGiven:
 *           type: boolean
 *           example: true
 *         isVerified:
 *           type: boolean
 *           example: true
 *         patientFeedback:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: number
 *               date:
 *                 type: string
 *               rating:
 *                 type: integer
 *               comment:
 *                 type: string
 *           example:
 *             - id: 1762443728845
 *               date: "2025-11-06T15:42:08.845Z"
 *               rating: 5
 *               comment: "God bless you! Thanks to all donors"
 *         recoveryUpdates:
 *           type: array
 *           nullable: true
 *           example: null
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T13:12:56.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2025-11-06T15:42:08.000Z"
 */

/**
 * @swagger
 * /api/TreatmentCase/active:
 *   get:
 *     summary: Get all active treatment cases
 *     tags: [Treatment Cases]
 *     parameters:
 *       - in: query
 *         name: treatmentType
 *         schema:
 *           type: string
 *           enum: [surgery, cancer_treatment, dialysis, rehabilitation]
 *       - in: query
 *         name: urgency
 *         schema:
 *           type: string
 *           enum: [low, medium, high, critical]
 *     responses:
 *       200:
 *         description: List of active cases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TreatmentCaseResponse'
 */
router.get('/active', treatmentCaseController.getActiveCases);

/**
 * @swagger
 * /api/TreatmentCase/pending:
 *   get:
 *     summary: Get pending treatment cases (Admin)
 *     tags: [Treatment Cases]
 *     responses:
 *       200:
 *         description: List of pending cases
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 pendingCases:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TreatmentCaseResponse'
 */
router.get('/pending', treatmentCaseController.getPendingCases);

/**
 * @swagger
 * /api/TreatmentCase:
 *   post:
 *     summary: Create a new treatment case
 *     tags: [Treatment Cases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TreatmentCaseInput'
 *     responses:
 *       201:
 *         description: Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TreatmentCaseResponse'
 */
router.post('/', treatmentCaseController.createCase);

/**
 * @swagger
 * /api/TreatmentCase/{id}:
 *   get:
 *     summary: Get treatment case by ID
 *     tags: [Treatment Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Case details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TreatmentCaseResponse'
 *       404:
 *         description: Not found
 */
router.get('/:id', treatmentCaseController.getCaseById);

/**
 * @swagger
 * /api/TreatmentCase/{id}/verify:
 *   patch:
 *     summary: Verify and activate a treatment case (Admin)
 *     tags: [Treatment Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Case verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Treatment case verified and activated successfully!"
 *                 treatmentCase:
 *                   $ref: '#/components/schemas/TreatmentCaseResponse'
 *       404:
 *         description: Not found
 */
router.patch('/:id/verify', treatmentCaseController.verifyCase);

module.exports = router;