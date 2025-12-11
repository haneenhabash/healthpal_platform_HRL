// routes/userRoutes.js
const express = require('express');
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { getMe, getAllUsers, getAdmins } = require('../controllers/userController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User related endpoints
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current logged-in user
 *     description: Returns the profile of the currently authenticated user.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 role:
 *                   type: string
 *                   example: patient
 *       401:
 *         description: Not authorized
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     description: Returns a list of all users. Accessible only by admins.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.get('/', protect, restrictTo('admin'), getAllUsers);

/**
 * @swagger
 * /api/users/admin-only:
 *   get:
 *     summary: Admin-only route
 *     description: Accessible only by users with the admin role.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin-only data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome admin, this is protected admin-only data.
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.get(
  '/admin-only',
  protect,
  restrictTo('admin'),
  (req, res) => {
    res.status(200).json({
      message: 'Welcome admin, this is protected admin-only data.',
    });
  }
);

/**
 * @swagger
 * /api/users/admins:
 *   get:
 *     summary: Get all admins (admin only)
 *     description: Returns a list of users with role = admin.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admins
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 */
router.get('/admins', protect, restrictTo('admin'), getAdmins);

module.exports = router;
