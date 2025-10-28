// src/routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const { Doctor } = require('../models');
const { Op } = require('sequelize');
router.get('/search', async (req, res) => {
  console.log('✅ Search endpoint hit');
  try {
    const { locationType, specialty, language, minExperience } = req.query;
    const where = {};
    
    if (locationType) where.locationType = locationType;
    if (specialty) where.specialty = specialty;
    if (language) where.language = language;
    if (minExperience) where.experienceYears = { [Op.gte]: parseInt(minExperience) };
    
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
    const doctor = await Doctor.create(req.body);
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
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    await doctor.update(req.body);
    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findByPk(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    await doctor.destroy();
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
  
});


module.exports = router;
