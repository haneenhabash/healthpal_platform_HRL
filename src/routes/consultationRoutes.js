/**
 * @swagger
 * tags:
 *   name: Consultations
 *   description: Manage doctor-patient consultations (booking, listing, and updates)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         age:
 *           type: integer
 *         gender:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         medicalHistory:
 *           type: string
 *         language:
 *           type: string
 *           example: "Arabic"
 *     Doctor:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         specialty:
 *           type: string
 *           example: "pediatrics"
 *         locationType:
 *           type: string
 *           enum: [local, international]
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         language:
 *           type: string
 *           example: "Arabic"
 *         experienceYears:
 *           type: integer
 *     Consultation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         type:
 *           type: string
 *           enum: [video, audio, message]
 *         status:
 *           type: string
 *           enum: [pending, approved, completed, cancelled]
 *         notes:
 *           type: string
 *         PatientId:
 *           type: integer
 *         DoctorId:
 *           type: integer
 *         Patient:
 *           $ref: '#/components/schemas/Patient'
 *         Doctor:
 *           $ref: '#/components/schemas/Doctor'
 *     CreateConsultationRequest:
 *       type: object
 *       required:
 *         - date
 *         - type
 *         - PatientId
 *         - DoctorId
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           example: "2025-11-01T10:00:00Z"
 *         type:
 *           type: string
 *           enum: [video, audio, message]
 *           example: "message"
 *         PatientId:
 *           type: integer
 *           example: 1
 *         DoctorId:
 *           type: integer
 *           example: 2
 *         notes:
 *           type: string
 *           example: "Follow-up in chat mode"
 *     UpdateConsultationStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [pending, approved, completed, cancelled]
 *           example: "completed"
 *     ConsultationWithMessage:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Consultation booked successfully"
 *         consultation:
 *           $ref: '#/components/schemas/Consultation'
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
 *             $ref: '#/components/schemas/CreateConsultationRequest'
 *     responses:
 *       201:
 *         description: Consultation booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultationWithMessage'
 *       400:
 *         description: Validation error or time conflict
 *       404:
 *         description: Doctor or Patient not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/consultations:
 *   get:
 *     summary: Get all consultations (with patient and doctor details)
 *     tags: [Consultations]
 *     responses:
 *       200:
 *         description: List of consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultation'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/consultations/patient/{id}:
 *   get:
 *     summary: Get consultations for a specific patient
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Patient ID
 *     responses:
 *       200:
 *         description: List of consultations for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultation'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/consultations/doctor/{id}:
 *   get:
 *     summary: Get consultations for a specific doctor
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: List of consultations for the doctor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultation'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/consultations/{id}:
 *   patch:
 *     summary: Update consultation status
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Consultation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateConsultationStatusRequest'
 *     responses:
 *       200:
 *         description: Status updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConsultationWithMessage'
 *       404:
 *         description: Consultation not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/consultations/{id}:
 *   delete:
 *     summary: Delete a consultation
 *     tags: [Consultations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Consultation ID
 *     responses:
 *       200:
 *         description: Consultation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Consultation deleted successfully"
 *       404:
 *         description: Consultation not found
 *       500:
 *         description: Server error
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
