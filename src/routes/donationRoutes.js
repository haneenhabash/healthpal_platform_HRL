// src/routes/donationRoutes.js
const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');


router.post('/', donationController.createDonation);

module.exports = router;