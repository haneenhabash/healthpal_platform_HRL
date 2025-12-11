const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');


router.put('/test', (req, res) => {
  res.json({ message: "PUT TEST WORKS" });
});


/**
 * @swagger
 * /appointments/{id}/status:
 *   put:
 *     summary: Update the status of an appointment
 *     tags:
 *       - Appointments
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the appointment to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 description: New status of the appointment
 *             required:
 *               - status
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *       400:
 *         description: Invalid status value
 *       404:
 *         description: Appointment not found
 */
router.put('/:id/status', appointmentController.updateAppointmentStatus);

// GETs
router.get('/search', appointmentController.getAppointmentsByCriteria);
router.get('/:id', appointmentController.getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Request a new appointment between a patient and a doctor
 *     tags:
 *       - Appointments
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
 *               patientId:
 *                 type: integer
 *                 description: ID of the patient
 *               availabilityId:
 *                 type: integer
 *                 description: ID of the selected availability slot
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 default: pending
 *                 description: Status of the appointment
 *             required:
 *               - doctorId
 *               - patientId
 *               - availabilityId
 *     responses:
 *       201:
 *         description: Appointment requested successfully
 *       400:
 *         description: Invalid input or missing fields
 *       404:
 *         description: Doctor, Patient, or Availability not found
 */
router.post('/', appointmentController.requestAppointment);

module.exports = router;
