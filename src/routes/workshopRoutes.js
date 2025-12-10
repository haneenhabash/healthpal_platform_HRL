/**
 * @swagger
 * tags:
 *   name: Workshops
 *   description: Health education workshops and training sessions
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Workshop:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *           example: "Basics of First Aid for Parents"
 *         description:
 *           type: string
 *           example: "A practical workshop teaching essential first aid skills for parents."
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-12-10T16:00:00Z"
 *         locationType:
 *           type: string
 *           enum: [online, onsite]
 *           example: "online"
 *         locationDetails:
 *           type: string
 *           example: "Zoom link will be sent by email"
 *         category:
 *           type: string
 *           enum: [nutrition, mental-health, first-aid, maternal-care, chronic-illness, general-health]
 *           example: "first-aid"
 *         language:
 *           type: string
 *           example: "Arabic"
 *         speaker:
 *           type: string
 *           example: "Dr. Ahmad Saleh"
 *         maxParticipants:
 *           type: integer
 *           example: 50
 *         status:
 *           type: string
 *           enum: [upcoming, completed, cancelled]
 *           example: "upcoming"
 *         averageRating:
 *           type: number
 *           format: float
 *           example: 4.5
 *
 *     WorkshopCreateRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - date
 *         - locationType
 *         - locationDetails
 *         - category
 *         - speaker
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         locationType:
 *           type: string
 *           enum: [online, onsite]
 *         locationDetails:
 *           type: string
 *         category:
 *           type: string
 *           enum: [nutrition, mental-health, first-aid, maternal-care, chronic-illness, general-health]
 *         language:
 *           type: string
 *           example: "Arabic"
 *         speaker:
 *           type: string
 *         maxParticipants:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [upcoming, completed, cancelled]
 *
 *     WorkshopUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         locationType:
 *           type: string
 *           enum: [online, onsite]
 *         locationDetails:
 *           type: string
 *         category:
 *           type: string
 *           enum: [nutrition, mental-health, first-aid, maternal-care, chronic-illness, general-health]
 *         language:
 *           type: string
 *         speaker:
 *           type: string
 *         maxParticipants:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [upcoming, completed, cancelled]
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Registration:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         WorkshopId:
 *           type: integer
 *         PatientId:
 *           type: integer
 *           nullable: true
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         attendance:
 *           type: boolean
 *         certificateUrl:
 *           type: string
 *           nullable: true
 */


/**
 * @swagger
 * /api/workshops:
 *   get:
 *     summary: Get all workshops (with optional filters)
 *     tags: [Workshops]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [nutrition, mental-health, first-aid, maternal-care, chronic-illness, general-health]
 *         description: Filter by workshop category
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, completed, cancelled]
 *         description: Filter by workshop status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Show workshops on or after this date
 *     responses:
 *       200:
 *         description: List of workshops (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workshop'
 *       500:
 *         description: Error fetching workshops
 *
 *   post:
 *     summary: Create a new workshop
 *     tags: [Workshops]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkshopCreateRequest'
 *     responses:
 *       201:
 *         description: Workshop created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Workshop created successfully"
 *                 workshop:
 *                   $ref: '#/components/schemas/Workshop'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Error creating workshop
 */

/**
 * @swagger
 * /api/workshops/{id}:
 *   get:
 *     summary: Get workshop by ID
 *     tags: [Workshops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Workshop found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workshop'
 *       404:
 *         description: Workshop not found
 *       500:
 *         description: Error fetching workshop
 *
 *   put:
 *     summary: Update a workshop
 *     tags: [Workshops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WorkshopUpdateRequest'
 *     responses:
 *       200:
 *         description: Workshop updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Workshop updated successfully"
 *                 workshop:
 *                   $ref: '#/components/schemas/Workshop'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Workshop not found
 *       500:
 *         description: Error updating workshop
 *
 *   delete:
 *     summary: Delete a workshop
 *     tags: [Workshops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Workshop deleted
 *       404:
 *         description: Workshop not found
 *       500:
 *         description: Error deleting workshop
 */

/**
 * @swagger
 * /api/workshops/{id}/attendees:
 *   get:
 *     summary: Get attendees of a specific workshop
 *     tags: [Workshops]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of workshop attendees (registrations)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Registration'
 *       404:
 *         description: Workshop not found
 *       500:
 *         description: Error fetching attendees
 */


const express = require('express');
const router = express.Router();
const workshopController = require('../controllers/workshopController');

router.post('/', workshopController.createWorkshop);
router.get('/', workshopController.getAllWorkshops);
router.get('/:id', workshopController.getWorkshopById);
router.put('/:id', workshopController.updateWorkshop);
router.delete('/:id', workshopController.deleteWorkshop);
router.get('/:id/attendees', workshopController.getAttendees);

module.exports = router;
