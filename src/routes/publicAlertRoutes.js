/**
 * @swagger
 * tags:
 *   name: PublicAlerts
 *   description: Public health alerts, outbreaks, emergencies, and warnings
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PublicAlert:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *           example: "Flu outbreak in Amman"
 *         type:
 *           type: string
 *           enum: [outbreak, air-quality, emergency, awareness]
 *           description: Type of alert
 *           example: "outbreak"
 *         region:
 *           type: string
 *           description: Affected region or 'national'
 *           example: "Amman"
 *         severity:
 *           type: string
 *           enum: [low, moderate, high, critical]
 *           description: Severity level
 *           example: "high"
 *         status:
 *           type: string
 *           enum: [active, resolved]
 *           description: Current status of the alert
 *           example: "active"
 *         content:
 *           type: string
 *           description: Detailed description of the alert
 *           example: "Increasing flu cases reported. Wear masks."
 *         issuedBy:
 *           type: string
 *           description: Issuing authority
 *           example: "Health Authority"
 *         validUntil:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Optional expiry time of the alert
 *           example: "2025-12-20T00:00:00Z"
 *
 *     PublicAlertCreateRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - type
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         type:
 *           type: string
 *           enum: [outbreak, air-quality, emergency, awareness]
 *         region:
 *           type: string
 *         severity:
 *           type: string
 *           enum: [low, moderate, high, critical]
 *         status:
 *           type: string
 *           enum: [active, resolved]
 *         issuedBy:
 *           type: string
 *         validUntil:
 *           type: string
 *           format: date-time
 *
 *     PublicAlertUpdateRequest:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - type
 *         - region
 *         - severity
 *         - status
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         type:
 *           type: string
 *           enum: [outbreak, air-quality, emergency, awareness]
 *         region:
 *           type: string
 *         severity:
 *           type: string
 *           enum: [low, moderate, high, critical]
 *         status:
 *           type: string
 *           enum: [active, resolved]
 *         issuedBy:
 *           type: string
 *         validUntil:
 *           type: string
 *           format: date-time
 */



/**
 * @swagger
 * /api/alerts:
 *   get:
 *     summary: Get all public alerts (with optional filters)
 *     tags: [PublicAlerts]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: severity
 *         schema:
 *           type: string
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of alerts (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PublicAlert'
 *       500:
 *         description: Error fetching alerts
 *
 *   post:
 *     summary: Create a public alert
 *     tags: [PublicAlerts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PublicAlertCreateRequest'
 *     responses:
 *       201:
 *         description: Alert created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Public health alert created successfully"
 *                 alert:
 *                   $ref: '#/components/schemas/PublicAlert'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating alert
 */

/**
 * @swagger
 * /api/alerts/{id}:
 *   get:
 *     summary: Get alert by ID
 *     tags: [PublicAlerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Alert found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicAlert'
 *       404:
 *         description: Alert not found
 *       500:
 *         description: Error fetching alert
 *
 *   put:
 *     summary: Update a public alert
 *     tags: [PublicAlerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PublicAlertUpdateRequest'
 *     responses:
 *       200:
 *         description: Alert updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Public health alert updated successfully"
 *                 alert:
 *                   $ref: '#/components/schemas/PublicAlert'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Alert not found
 *       500:
 *         description: Error updating alert
 *
 *   delete:
 *     summary: Delete a public alert
 *     tags: [PublicAlerts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Alert deleted
 *       404:
 *         description: Alert not found
 *       500:
 *         description: Error deleting alert
 */
const express = require('express');
const router = express.Router();
const publicAlertController = require('../controllers/publicAlertController');

// POST /api/alerts
router.post('/', publicAlertController.createAlert);

router.get('/', publicAlertController.searchAlerts);

// GET /api/alerts/:id
router.get('/:id', publicAlertController.getAlertById);

// PUT /api/alerts/:id
router.put('/:id', publicAlertController.updateAlert);

// DELETE /api/alerts/:id
router.delete('/:id', publicAlertController.deleteAlert);

module.exports = router;
