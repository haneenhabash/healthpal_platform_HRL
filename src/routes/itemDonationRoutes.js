const express = require('express');
const router = express.Router();

const itemDonationController = require('../controllers/itemDonationController');

/**
 * @swagger
 * /item-donations:
 *   post:
 *     summary: Create a new item donation (either crowdsourced or matched to a patient request)
 *     tags:
 *       - Item Donations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               donorId:
 *                 type: integer
 *                 description: "ID of the donor making the donation"
 *               itemType:
 *                 type: string
 *                 enum: [medicine, equipment, other]
 *                 description: Type of item being donated
 *               itemId:
 *                 type: integer
 *                 description: "Optional: ID of the specific item if already exists in inventory"
 *               itemName:
 *                 type: string
 *                 description: Name of the donated item
 *               quantity:
 *                 type: integer
 *                 default: 1
 *                 description: Number of items being donated
 *               donationType:
 *                 type: string
 *                 enum: [matched request, crowdsourced inventory]
 *                 description: Type of donation
 *               requestId:
 *                 type: integer
 *                 description: "Optional: ID of a patient request to match this donation to"
 *             required:
 *               - donorId
 *               - itemType
 *               - itemName
 *               - donationType
 *     responses:
 *       201:
 *         description: Donation created successfully (and matched if requestId provided)
 *       400:
 *         description: Invalid input
 */
router.post('/', itemDonationController.createDonation);

router.get('/', itemDonationController.getAllDonations);

router.get('/filter', itemDonationController.getDonationsByFilters);

router.get('/:id', itemDonationController.getDonationById);

router.put('/:id', itemDonationController.updateDonation);

router.delete('/:id', itemDonationController.deleteDonation);

module.exports = router;