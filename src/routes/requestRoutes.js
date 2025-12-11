// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');
/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new patient request
 *     tags:
 *       - Requests
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *                 description: ID of the patient making the request
 *               type:
 *                 type: string
 *                 enum: [medicine, equipment, other]
 *                 description: Type of item requested
 *               itemId:
 *                 type: integer
 *                 description: Optional: ID of the specific item if already exists in inventory
 *               itemName:
 *                 type: string
 *                 description: Name of the requested item
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 description: Quantity requested
 *             required:
 *               - patientId
 *               - type
 *               - itemName
 *     responses:
 *       201:
 *         description: Request created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/', requestController.createRequest);

router.get('/', requestController.getAllRequests);

router.get('/:id', requestController.getRequestById);

router.get('/status/:status', requestController.getRequestsByStatus);

router.get('/type/:type', requestController.getRequestsByType);

router.put('/:id', requestController.updateRequest);

router.delete('/:id', requestController.deleteRequest);

module.exports = router;
