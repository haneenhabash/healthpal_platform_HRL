// src/routes/registrationRoutes.js
const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

router.post('/', registrationController.registerForWorkshop);
router.patch('/:id', registrationController.updateRegistration);

module.exports = router;
