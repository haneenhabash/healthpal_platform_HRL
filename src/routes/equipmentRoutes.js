const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

router.post('/', equipmentController.createEquipment);
router.get('/', equipmentController.getAllEquipments);
router.get('/:id', equipmentController.getEquipmentById);
router.get('/name/:name', equipmentController.getEquipmentsByName);
router.get('/category/:category', equipmentController.getEquipmentsByCategory);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
