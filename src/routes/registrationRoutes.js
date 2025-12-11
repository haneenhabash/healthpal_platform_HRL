// src/routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

/**
 * @swagger
 * tags:
 *   name: WorkshopRegistrations
 *   description: Register attendees for workshops and manage attendance & certificates
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
 *           example: 12
 *         WorkshopId:
 *           type: integer
 *           example: 3
 *         PatientId:
 *           type: integer
 *           nullable: true
 *           example: 5
 *         name:
 *           type: string
 *           example: "Ragad Khaled"
 *         email:
 *           type: string
 *           format: email
 *           example: "ragad@example.com"
 *         phone:
 *           type: string
 *           example: "+962790000000"
 *         attendance:
 *           type: boolean
 *           example: true
 *         feedback:
 *           type: string
 *           example: "Very helpful and clear workshop"
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           example: 5
 *         certificateUrl:
 *           type: string
 *           nullable: true
 *           example: "/certificates/certificate_12_Ragad_Khaled.pdf"
 *
 *     RegistrationCreateRequest:
 *       type: object
 *       required:
 *         - WorkshopId
 *         - name
 *         - email
 *       properties:
 *         WorkshopId:
 *           type: integer
 *           description: ID of the workshop the user is registering for
 *         PatientId:
 *           type: integer
 *           nullable: true
 *           description: Optional linked patient record ID
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *           example: "+962790000000"
 *
 *     RegistrationUpdateRequest:
 *       type: object
 *       properties:
 *         attendance:
 *           type: boolean
 *           description: Mark true when the user actually attended
 *         feedback:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         phone:
 *           type: string
 */

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Register for a workshop
 *     tags: [WorkshopRegistrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationCreateRequest'
 *     responses:
 *       201:
 *         description: Registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Validation error, workshop full, or already registered
 *       404:
 *         description: Workshop not found
 */

/**
 * @swagger
 * /api/registrations/{id}:
 *   patch:
 *     summary: Update a registration (attendance, feedback, rating...)
 *     tags: [WorkshopRegistrations]
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
 *             $ref: '#/components/schemas/RegistrationUpdateRequest'
 *     responses:
 *       200:
 *         description: Registration updated (and certificate generated if attendance is true)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Registration not found
 */

router.post('/', registrationController.registerForWorkshop);
router.patch('/:id', registrationController.updateRegistration);

module.exports = router;
