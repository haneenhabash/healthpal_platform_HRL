/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Patients operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - age
 *         - gender
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Sara Ahmad
 *         email:
 *           type: string
 *           example: sara@mail.com
 *         phone:
 *           type: string
 *           example: "+962788888888"
 *         age:
 *           type: integer
 *           example: 30
 *         gender:
 *           type: string
 *           enum: [male, female]
 *         language:
 *           type: string
 *           example: Arabic
 *         medicalHistory:
 *           type: string
 *           example: Diabetes, hypertension
 */

/**
 * @swagger
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: List of patients
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Patient found
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Patient not found
 */

/**
 * @swagger
 * /api/patients:
 *   post:
 *     summary: Create a new patient
 *     tags: [Patients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Patient'
 *     responses:
 *       201:
 *         description: Patient created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               age:
 *                 type: integer
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *               language:
 *                 type: string
 *               medicalHistory:
 *                 type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Patient not found
 *       500:
 *         description: Server error
 */
const express = require('express');
const router = express.Router();
const { Patient } = require('../models');
const Joi = require('joi');

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const createPatientSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().min(6).max(30).required(),
  age: Joi.number().integer().min(0).max(120).required(),
  gender: Joi.string().valid('male', 'female').required(),
  language: Joi.string().min(2).max(10).allow(null, ''),
  medicalHistory: Joi.string().allow(null, '')
});

const updatePatientSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().min(6).max(30),
  age: Joi.number().integer().min(0).max(120),
  gender: Joi.string().valid('male', 'female'),
  language: Joi.string().min(2).max(10).allow(null, ''),
  medicalHistory: Joi.string().allow(null, '')
}).min(1);

router.get('/', async (req, res) => {
  try {
    const patients = await Patient.findAll({
      attributes: { exclude: ['medicalHistory'] }
    });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const patient = await Patient.findByPk(value.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = createPatientSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const patient = await Patient.create(value);
    res.status(201).json({ message: 'Patient created successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error: idError, value: idValue } = idSchema.validate(req.params);
    if (idError) return res.status(400).json({ message: idError.details[0].message });

    const { error, value } = updatePatientSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const patient = await Patient.findByPk(idValue.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patient.update(value);

    res.json({ message: 'Patient updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const patient = await Patient.findByPk(value.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    await patient.destroy();
    res.json({ message: 'Patient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
});

module.exports = router;
