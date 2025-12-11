const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

/**
 * @swagger
 * tags:
 *   name: Donors
 *   description: Donor account management and administration
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DonorInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: "John Doe"
 *         email:
 *           type: string
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           example: "Secret123!"
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         address:
 *           type: string
 *           example: "123 Main St"
 *     
 *     DonorUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 * 
 *     DonorResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         address:
 *           type: string
 */

/**
 * @swagger
 * /api/donors:
 *   post:
 *     summary: Register a new donor
 *     tags: [Donors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonorInput'
 *     responses:
 *       201:
 *         description: Created successfully
 *       400:
 *         description: Validation error
 */
router.post('/', donorController.createDonor);

/**
 * @swagger
 * /api/donors:
 *   get:
 *     summary: Get all donors (Admin)
 *     tags: [Donors]
 *     responses:
 *       200:
 *         description: List of all donors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DonorResponse'
 */
router.get('/', donorController.getAllDonors);

/**
 * @swagger
 * /api/donors/{id}:
 *   get:
 *     summary: Get donor profile by ID
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Donor profile data
 *       404:
 *         description: Not found
 */
router.get('/:id', donorController.getDonorById);

/**
 * @swagger
 * /api/donors/{id}:
 *   put:
 *     summary: Update donor profile
 *     tags: [Donors]
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
 *             $ref: '#/components/schemas/DonorUpdateInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/:id', donorController.updateDonor);

/**
 * @swagger
 * /api/donors/{id}:
 *   delete:
 *     summary: Delete donor account (Admin)
 *     tags: [Donors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/:id', donorController.deleteDonor);

module.exports = router;