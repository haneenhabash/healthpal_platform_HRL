const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.get('/matched-requests', volunteerController.getMatchedRequests);
/**
 * @swagger
 * tags:
 *   name: Volunteers
 *   description: Volunteers fulfill the matched requests to deliver them to patients
 */

/**
 * @swagger
 * /api/volunteers/deliver/{id}:
 *   put:
 *     summary: Mark a request as delivered
 *     tags:
 *       - Volunteers
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the request to mark as delivered
 *     responses:
 *       200:
 *         description: Request marked as delivered successfully
 *       404:
 *         description: Request not found
 */
router.put('/deliver/:id', volunteerController.markRequestDelivered);

module.exports = router;
