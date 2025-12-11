const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * /api/payments/checkout:
 *   post:
 *     summary: Get Stripe Payment Link (No Frontend Needed)
 *     tags: [Payments]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [treatmentCaseId, donorId, amount]
 *             properties:
 *               treatmentCaseId:
 *                 type: integer
 *               donorId:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Returns a URL to pay on Stripe
 */
router.post('/checkout', paymentController.createCheckoutSession);

router.get('/success', paymentController.handlePaymentSuccess);


module.exports = router;