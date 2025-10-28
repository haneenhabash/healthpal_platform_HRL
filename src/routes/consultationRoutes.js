const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');

router.post('/', consultationController.createConsultation);

router.get('/', consultationController.getAllConsultations);

router.get('/patient/:id', consultationController.getByPatient);

router.get('/doctor/:id', consultationController.getByDoctor);

router.patch('/:id', consultationController.updateStatus);

module.exports = router;
