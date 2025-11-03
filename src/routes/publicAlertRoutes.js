const express = require('express');
const router = express.Router();
const publicAlertController = require('../controllers/publicAlertController');

router.post('/', publicAlertController.createAlert);

router.get('/', publicAlertController.getAllAlerts);

router.get('/search', publicAlertController.searchAlerts);

router.get('/:id', publicAlertController.getAlertById);

router.put('/:id', publicAlertController.updateAlert);

router.delete('/:id', publicAlertController.deleteAlert);

module.exports = router;
