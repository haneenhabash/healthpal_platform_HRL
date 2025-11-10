// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.post('/', requestController.createRequest);

router.get('/', requestController.getAllRequests);

router.get('/:id', requestController.getRequestById);

router.get('/status/:status', requestController.getRequestsByStatus);

router.get('/type/:type', requestController.getRequestsByType);

router.put('/:id', requestController.updateRequest);

router.delete('/:id', requestController.deleteRequest);

module.exports = router;
