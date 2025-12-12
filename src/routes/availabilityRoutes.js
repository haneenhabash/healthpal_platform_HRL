const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');

/**
 * @swagger
 * tags:
 *   name: Availability
 *   description: Doctor availability management APIs
 */


/**
 * @swagger
 * /api/availabilities:
 *   post:
 *     summary: Add a new availability slot for a doctor
 *     tags:
 *       - Availability
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 description: ID of the doctor
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Start time of the availability slot
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: End time of the availability slot
 *               locationType:
 *                 type: string
 *                 enum: [local, international]
 *                 description: Type of location for the availability
 *               status:
 *                 type: string
 *                 enum: [available, booked]
 *                 default: available
 *                 description: Status of the availability slot
 *             required:
 *               - doctorId
 *               - startTime
 *               - endTime
 *               - locationType
 *     responses:
 *       201:
 *         description: Availability slot added successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', availabilityController.addAvailability);


/**
 * @swagger
 * /api/availabilities:
 *   get:
 *     summary: Get all doctor availabilities
 *     tags: [Availability]
 *     responses:
 *       200:
 *         description: List of all availabilities with doctor info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Availability'
 */
router.get('/', availabilityController.getAllAvailabilities);
router.get('/:id', availabilityController.getAvailabilityById);
router.get('/search', availabilityController.getAvailabilitiesByCriteria);

module.exports = router;
