// و ngoRoutes.js
const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');

router.post('/',ngoController.registerNGO);


router.put('/:id/verify',ngoController.verifyNgo);
router.get('/id/:id', ngoController.getNgoById);

router.get('/name/:name', ngoController.getNgoByName);

router.get('/status/:status', ngoController.getNgoByStatus);
module.exports = router;
