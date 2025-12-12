const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
/**
 * @swagger
 * tags:
 *   name: Equipment
 *   description: Essential Equipment Tracker
 */

/**
 * @swagger
 * /api/equipments:
 *   get:
 *     summary: Get all equipment items
 *     tags: [Equipment]
 *     responses:
 *       200:
 *         description: List of all equipment
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 */
router.get('/', equipmentController.getAllEquipments);

/**
 * @swagger
 * /api/equipments/{id}:
 *   get:
 *     summary: Get equipment by ID
 *     tags: [Equipment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: Equipment ID
 *     responses:
 *       200:
 *         description: Equipment data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Equipment'
 *       404:
 *         description: Equipment not found
 */
router.get('/:id', equipmentController.getEquipmentById);

/**
 * @swagger
 * /api/equipments/name/{name}:
 *   get:
 *     summary: Search equipment by name
 *     tags: [Equipment]
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Part of the equipment name
 *     responses:
 *       200:
 *         description: Equipments matching the name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 */
router.get('/name/:name', equipmentController.getEquipmentsByName);

/**
 * @swagger
 * /api/equipments/category/{category}:
 *   get:
 *     summary: Get equipment by category
 *     tags: [Equipment]
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Equipment category
 *     responses:
 *       200:
 *         description: Equipment under this category
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Equipment'
 */
router.get('/category/:category', equipmentController.getEquipmentsByCategory);



router.post('/', equipmentController.createEquipment);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
