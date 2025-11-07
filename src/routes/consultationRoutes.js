/**
 * @swagger
 * tags:
 *   name: Consultations
 *   description: Manage doctor-patient consultations (booking, listing, and updates)
 */

/**
 * @swagger
 * /api/consultations:
 *   post:
 *     summary: Book a new consultation
 *     tags: [Consultations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 example: "2025-11-01T10:00:00Z"
 *               type:
 *                 type: string
 *                 enum: [video, audio, message]
 *                 example: "message"
 *               PatientId:
 *                 type: integer
 *                 example: 1
 *               DoctorId:
 *                 type: integer
 *                 example: 2
 *               notes:
 *                 type: string
 *                 example: "Follow-up in chat mode"
 *     responses:
 *       201:
 *         description: Consultation booked successfully
 *       400:
 *         description: Validation or conflict error
 */
const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

router.post('/', consultationController.createConsultation);

router.get('/', consultationController.getAllConsultations);

router.get('/patient/:id', consultationController.getByPatient);

router.get('/doctor/:id', consultationController.getByDoctor);

router.patch('/:id', consultationController.updateStatus);

router.delete('/:id', consultationController.deleteConsultation);


module.exports = router;
