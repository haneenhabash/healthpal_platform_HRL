// routes/ngoActivityRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/ngoActivityController");


/**
 * @swagger
 * tags:
 *   name: NGO Activities
 *   description: Activities management and notification
 */

/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Create a new NGO activity
 *     tags:
 *       - NGO Activities
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ngoId:
 *                 type: integer
 *                 description: ID of the NGO creating the activity
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               activityType:
 *                 type: string
 *                 enum: [medical_mission, mobile_clinic, aid_drop, volunteer_event, awareness_campaign, emergency_response]
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: [planned, in_progress, completed, cancelled]
 *               mediaUrl:
 *                 type: string
 *             required:
 *               - ngoId
 *               - title
 *               - activityType
 *     responses:
 *       201:
 *         description: Activity created successfully
 *       400:
 *         description: Invalid input data
 */
router.post("/", controller.createActivity);
/**
 * @swagger
 * /activities/ngo/{ngoId}:
 *   get:
 *     summary: Get all activities for a specific NGO
 *     tags:
 *       - NGO Activities
 *     parameters:
 *       - in: path
 *         name: ngoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the NGO
 *     responses:
 *       200:
 *         description: List of NGO activities retrieved successfully
 *       404:
 *         description: NGO not found
 */
router.get("/ngo/:ngoId", controller.getActivitiesByNGO);
router.put("/:id/status", controller.updateActivityStatus);

/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Get all NGO activities
 *     tags:
 *       - NGO Activities
 *     description: Returns a list of all activities, including NGO info.
 *     responses:
 *       200:
 *         description: List of activities retrieved successfully
 *       500:
 *         description: Server error
 */

router.get("/", controller.getAllActivities);

module.exports = router;
