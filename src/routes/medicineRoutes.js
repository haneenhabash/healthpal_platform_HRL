const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');

// CRUD routes for medicines
router.post('/', medicineController.createMedicine);       
router.get('/', medicineController.getAllMedicines);       
 
router.get('/name/:name', medicineController.getMedicinesByName);
router.get('/category/:category', medicineController.getMedicinesByCategory);
router.get('/:id', medicineController.getMedicineById);  
router.put('/:id', medicineController.updateMedicine);     
router.delete('/:id', medicineController.deleteMedicine);  

module.exports = router;
