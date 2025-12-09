const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

/**
 * @swagger
 * tags:
 *   name: Donations
 *   description: Handling financial contributions and transaction history
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DonationInput:
 *       type: object
 *       required:
 *         - donorId
 *         - treatmentCaseId
 *         - amount
 *       properties:
 *         donorId:
 *           type: integer
 *           description: ID of the donor making the payment
 *           example: 1
 *         treatmentCaseId:
 *           type: integer
 *           description: ID of the medical case being funded
 *           example: 5
 *         amount:
 *           type: number
 *           format: float
 *           description: Amount to donate
 *           example: 150.00
 *
 *     DonationResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         amount:
 *           type: string
 *         status:
 *           type: string
 *         date:
 *           type: string
 *           format: date-time
 *         Donor:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *         TreatmentCase:
 *           type: object
 *           properties:
 *             title:
 *               type: string
 */

/**
 * @swagger
 * /api/donations:
 *   post:
 *     summary: Make a new donation
 *     description: Processes a donation, updates the case total amount, and marks case as fully funded if target is reached.
 *     tags: [Donations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationInput'
 *     responses:
 *       201:
 *         description: Donation successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Donation successful! Thank you for your support. 🎉"
 *                 data:
 *                   type: object
 *                   properties:
 *                     amountDonated:
 *                       type: number
 *                     caseStatus:
 *                       type: string
 *       400:
 *         description: Invalid amount or case already funded
 *       404:
 *         description: Case not found
 */
router.post('/', donationController.createDonation);

/**
 * @swagger
 * /api/donations:
 *   get:
 *     summary: Get all donations (Admin)
 *     tags: [Donations]
 *     responses:
 *       200:
 *         description: List of all system donations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DonationResponse'
 */
router.get('/', donationController.getAllDonations);

/**
 * @swagger
 * /api/donations/donor/{donorId}:
 *   get:
 *     summary: Get donation history for a specific donor
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: donorId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Donor's history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DonationResponse'
 */
router.get('/donor/:donorId', donationController.getDonationsByDonor);

/**
 * @swagger
 * /api/donations/case/{caseId}:
 *   get:
 *     summary: Get all donations for a specific medical case
 *     tags: [Donations]
 *     parameters:
 *       - in: path
 *         name: caseId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of donations for the case
 */
router.get('/case/:caseId', donationController.getDonationsByCase);

module.exports = router;