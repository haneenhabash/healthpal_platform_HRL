// src/routes/requestRoutes.js
const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Users can request critical medications or equipments
 */

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
 *                 description: "ID of the patient making the request"
 *               type:
 *                 type: string
 *                 enum: [medicine, equipment, other]
 *                 description: Type of item requested
 *               itemId:
 *                 type: integer
 *                 description: "Optional: ID of the specific item if already exists in inventory"
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


/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests
 *     tags:
 *       - Requests
 *     description: Retrieves all requests including patient information.
 *     responses:
 *       200:
 *         description: List of requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   patientId:
 *                     type: integer
 *                   type:
 *                     type: string
 *                     description: Type of request (medicine, item, donation, etc.)
 *                   itemId:
 *                     type: integer
 *                     nullable: true
 *                   itemName:
 *                     type: string
 *                   quantity:
 *                     type: integer
 *                   status:
 *                     type: string
 *                     enum: [pending, approved, rejected, completed]
 *                   patient:
 *                     type: object
 *                     description: Related patient information
 *       500:
 *         description: Server error while fetching requests
 */
router.get('/', requestController.getAllRequests);

router.get('/:id', requestController.getRequestById);

/**
 * @swagger
 * /requests/status/{status}:
 *   get:
 *     summary: Get requests by status
 *     tags:
 *       - Requests
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, completed]
 *         description: Status of the request
 *     responses:
 *       200:
 *         description: List of requests with the given status
 *       500:
 *         description: Server error while fetching requests by status
 */

router.get('/status/:status', requestController.getRequestsByStatus);

router.get('/type/:type', requestController.getRequestsByType);

/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Update an existing request status
 *     tags:
 *       - Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               itemId:
 *                 type: integer
 *                 nullable: true
 *               itemName:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, completed]
 *     responses:
 *       200:
 *         description: Request updated successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Failed to update request
 */

router.put('/:id', requestController.updateRequest);

/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete a request
 *     tags:
 *       - Requests
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 *       500:
 *         description: Failed to delete request
 */

router.delete('/:id', requestController.deleteRequest);

module.exports = router;
