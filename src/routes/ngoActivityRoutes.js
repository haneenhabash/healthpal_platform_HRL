// routes/ngoActivityRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/ngoActivityController");


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
 *                 description: Title of the activity
 *               description:
 *                 type: string
 *                 description: Detailed description of the activity
 *               activityType:
 *                 type: string
 *                 enum: [medical_mission, mobile_clinic, aid_drop, volunteer_event, awareness_campaign, emergency_response]
 *                 description: Type of activity
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
 *                 description: Link to image or media related to the activity
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
router.get("/ngo/:ngoId", controller.getActivitiesByNGO);
router.put("/:id/status", controller.updateActivityStatus);
router.get("/", controller.getAllActivities);

module.exports = router;
