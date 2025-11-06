// src/routes/transparencyRoutes.js
const express = require('express');
const router = express.Router();
const transparencyController = require('../controllers/transparencyController');


router.get('/case/:caseId', transparencyController.getCaseDashboard);


router.post('/case/:caseId/invoices', transparencyController.createInvoice);


router.post('/case/:caseId/updates', transparencyController.addRecoveryUpdate);
router.post('/case/:caseId/feedback', transparencyController.addPatientFeedback);

module.exports = router;