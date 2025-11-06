// src/routes/donorRoutes.js
const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

router.post('/', donorController.createDonor);

module.exports = router;