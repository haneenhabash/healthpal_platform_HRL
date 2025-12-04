// src/routes/adminRoutes.js
const express = require('express');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { getAdminStatistics } = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin specific endpoints
 */

/**
 * @swagger
 * /api/admin/statistics:
 *   get:
 *     summary: Get detailed admin statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detailed system statistics for admin
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.get('/statistics', protect, restrictTo('admin'), getAdminStatistics);

module.exports = router;
