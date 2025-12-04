// src/routes/dashboardRoutes.js
const express = require('express');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const {
  getUserDashboard,
  getAdminDashboard,
} = require('../controllers/dashboardController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: User & Admin dashboard endpoints
 */

/**
 * @swagger
 * /api/dashboard/me:
 *   get:
 *     summary: Get dashboard links for the current logged-in user
 *     description: Returns only URIs (links) that the current user can use to access their resources.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User dashboard links
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dashboard:
 *                   type: object
 *                   properties:
 *                     links:
 *                       type: object
 *                       properties:
 *                         profile:
 *                           type: string
 *                           example: "/api/users/me"
 *                         myConsultations:
 *                           type: string
 *                           example: "/api/consultations/my"
 *                         myWorkshops:
 *                           type: string
 *                           example: "/api/workshops/my"
 *                         recommendedGuides:
 *                           type: string
 *                           example: "/api/education/guides/recommended"
 *                         alerts:
 *                           type: string
 *                           example: "/api/alerts"
 *                         environment:
 *                           type: string
 *                           example: "/api/environment"
 *                         messages:
 *                           type: string
 *                           example: "/api/messages/my"
 *       401:
 *         description: Not authorized
 */
router.get('/me', protect, getUserDashboard);

/**
 * @swagger
 * /api/dashboard/admin:
 *   get:
 *     summary: Get admin dashboard links and basic statistics
 *     description: Returns URIs (links) for admin resources plus basic system statistics (totals).
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard links and stats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 dashboard:
 *                   type: object
 *                   properties:
 *                     links:
 *                       type: object
 *                       properties:
 *                         adminProfile:
 *                           type: string
 *                           example: "/api/users/me"
 *                         adminsList:
 *                           type: string
 *                           example: "/api/users/admins"
 *                         users:
 *                           type: string
 *                           example: "/api/users"
 *                         patients:
 *                           type: string
 *                           example: "/api/patients"
 *                         doctors:
 *                           type: string
 *                           example: "/api/doctors"
 *                         consultations:
 *                           type: string
 *                           example: "/api/consultations"
 *                         workshops:
 *                           type: string
 *                           example: "/api/workshops"
 *                         healthGuides:
 *                           type: string
 *                           example: "/api/education/guides"
 *                         publicAlerts:
 *                           type: string
 *                           example: "/api/alerts/public"
 *                         statistics:
 *                           type: string
 *                           example: "/api/admin/statistics"
 *                     stats:
 *                       type: object
 *                       properties:
 *                         totalUsers:
 *                           type: integer
 *                           example: 120
 *                         totalPatients:
 *                           type: integer
 *                           example: 80
 *                         totalDoctors:
 *                           type: integer
 *                           example: 10
 *                         totalConsultations:
 *                           type: integer
 *                           example: 300
 *                         totalWorkshops:
 *                           type: integer
 *                           example: 5
 *                         totalHealthGuides:
 *                           type: integer
 *                           example: 20
 *                         totalPublicAlerts:
 *                           type: integer
 *                           example: 3
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden - not admin
 */
router.get('/admin', protect, restrictTo('admin'), getAdminDashboard);

module.exports = router;
