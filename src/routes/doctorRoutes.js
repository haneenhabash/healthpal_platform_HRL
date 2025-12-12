/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Doctors operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - name
 *         - phone
 *         - specialty
 *         - language
 *         - locationType
 *         - experienceYears
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Dr. Ahmad Ali
 *         email:
 *           type: string
 *           example: doctor@mail.com
 *         phone:
 *           type: string
 *           example: "+962799999999"
 *         specialty:
 *           type: string
 *           example: cardiology
 *         language:
 *           type: string
 *           example: Arabic
 *         locationType:
 *           type: string
 *           example: local
 *         experienceYears:
 *           type: integer
 *           example: 7
 *         bio:
 *           type: string
 *           example: Experienced heart specialist
 *         gender:
 *           type: string
 *           enum: [male, female]
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of doctors
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Doctor found
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Doctor not found
 */

/**
 * @swagger
 * /api/doctors:
 *   post:
 *     summary: Create a new doctor
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Doctor'
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctors/{id}:
 *   put:
 *     summary: Update doctor by ID
 *     tags: [Doctors]
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
 *               specialty:
 *                 type: string
 *               language:
 *                 type: string
 *               locationType:
 *                 type: string
 *               experienceYears:
 *                 type: integer
 *               bio:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctors/{id}:
 *   delete:
 *     summary: Delete doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/doctors/search:
 *   get:
 *     summary: Search doctors with filters
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: locationType
 *         schema:
 *           type: string
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Doctors found
 *       404:
 *         description: No doctors found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
const express = require('express');
const router = express.Router();
const { Doctor } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

const searchSchema = Joi.object({
  locationType: Joi.string(),
  specialty: Joi.string(),
  language: Joi.string(),
  minExperience: Joi.number().integer().min(0)
});

const createDoctorSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().min(6).max(30).required(),
  specialty: Joi.string().min(2).max(100).required(),
  language: Joi.string().min(2).max(20).required(),
  locationType: Joi.string().min(2).max(50).required(),
  experienceYears: Joi.number().integer().min(0).required(),
  bio: Joi.string().allow(null, ''),
  gender: Joi.string().valid('male', 'female').allow(null)
});

const updateDoctorSchema = Joi.object({
  name: Joi.string().min(3).max(255),
  email: Joi.string().email().allow(null, ''),
  phone: Joi.string().min(6).max(30),
  specialty: Joi.string().min(2).max(100),
  language: Joi.string().min(2).max(20),
  locationType: Joi.string().min(2).max(50),
  experienceYears: Joi.number().integer().min(0),
  bio: Joi.string().allow(null, ''),
  gender: Joi.string().valid('male', 'female').allow(null)
}).min(1);

router.get('/search', async (req, res) => {
  console.log('✅ Search endpoint hit');
  try {
    const { error, value } = searchSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { locationType, specialty, language, minExperience } = value;
    const where = {};
    
    if (locationType) where.locationType = locationType;
    if (specialty) where.specialty = specialty;
    if (language) where.language = language;
    if (minExperience !== undefined) where.experienceYears = { [Op.gte]: minExperience };
    
    console.log('Search criteria:', where);
    
    const doctors = await Doctor.findAll({ where });
    
    console.log('Found doctors:', doctors.length);
    
    if (doctors.length === 0) {
      return res.status(404).json({ 
        message: 'No doctors found matching your criteria' 
      });
    }
    
    res.json(doctors);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Error searching doctors', 
      error: error.message 
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { error, value } = createDoctorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const doctor = await Doctor.create(value);
    res.status(201).json({ message: 'Doctor created successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const doctor = await Doctor.findByPk(value.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { error: idError, value: idValue } = idSchema.validate(req.params);
    if (idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    const { error, value } = updateDoctorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const doctor = await Doctor.findByPk(idValue.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    await doctor.update(value);
    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const doctor = await Doctor.findByPk(value.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    await doctor.destroy();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
});

module.exports = router;
