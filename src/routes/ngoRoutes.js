// و ngoRoutes.js
const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');


/**
 * @swagger
 * tags:
 *   name: NGO
 *   description: Integrate with medical NGOs doing fieldwork
 */
/**
 * @swagger
 * /api/ngos:
 *   post:
 *     summary: Register a new NGO (creates donor + NGO record)
 *     tags: [NGO]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - phone
 *               - address
 *               - ngoName
 *             properties:
 *               name:
 *                 type: string
 *                 description: Donor full name
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               ngoName:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *               website:
 *                 type: string
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               documentsUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: NGO registered successfully (pending verification)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 donor:
 *                   $ref: '#/components/schemas/Donor'
 *                 ngo:
 *                   $ref: '#/components/schemas/NGO'
 *       400:
 *         description: Email already registered
 *       500:
 *         description: Server error
 */
router.post('/',ngoController.registerNGO);


/**
 * @swagger
 * /api/ngos/{id}/verify:
 *   put:
 *     summary: Verify or update verification status of an NGO
 *     tags: [NGO]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: NGO ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected, pending]
 *               notes:
 *                 type: string
 *                 description: Optional verification notes
 *     responses:
 *       200:
 *         description: NGO verification status updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 ngo:
 *                   $ref: '#/components/schemas/NGO'
 *       400:
 *         description: Invalid verification status
 *       404:
 *         description: NGO not found
 *       500:
 *         description: Server error
 */

router.put('/:id/verify',ngoController.verifyNgo);

router.get("/ngos", ngoController.getAllNGOs);

router.get("/ngos", ngoController.getAllNGOs);

router.get('/id/:id', ngoController.getNgoById);

router.get('/name/:name', ngoController.getNgoByName);

router.get('/status/:status', ngoController.getNgoByStatus);
module.exports = router;
