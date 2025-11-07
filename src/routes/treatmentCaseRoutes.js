// src/routes/treatmentCaseRoutes.js
const express = require('express');
const router = express.Router();
const treatmentCaseController = require('../controllers/treatmentCaseController');

// ◀─── Routes الثابتة أولاً ───▶
router.get('/active', treatmentCaseController.getActiveCases);
router.get('/pending', treatmentCaseController.getPendingCases); // ◀─── قبل /:id
router.post('/', treatmentCaseController.createCase);

// ◀─── Routes الديناميكية أخيراً ───▶
router.get('/:id', treatmentCaseController.getCaseById);
router.patch('/:id/verify', treatmentCaseController.verifyCase);

module.exports = router;