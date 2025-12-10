/**
 * @swagger
 * tags:
 *   name: HealthGuides
 *   description: Health education guides and medical awareness content
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HealthGuide:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         title:
 *           type: string
 *           example: "First aid steps for child choking"
 *         category:
 *           type: string
 *           enum: [first-aid, chronic-illness, nutrition, maternal-care, mental-health]
 *           example: "first-aid"
 *         language:
 *           type: string
 *           example: "Arabic"
 *         content:
 *           type: string
 *           example: "If a child is choking, follow these steps..."
 *         imageUrl:
 *           type: string
 *           nullable: true
 *           example: "https://example.com/img/choking-guide.png"
 *         source:
 *           type: string
 *           example: "World Health Organization"
 *
 *     HealthGuideCreateRequest:
 *       type: object
 *       required:
 *         - title
 *         - category
 *         - content
 *       properties:
 *         title:
 *           type: string
 *         category:
 *           type: string
 *           enum: [first-aid, chronic-illness, nutrition, maternal-care, mental-health]
 *         content:
 *           type: string
 *         language:
 *           type: string
 *           example: "Arabic"
 *         imageUrl:
 *           type: string
 *         source:
 *           type: string
 *
 *     HealthGuideUpdateRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         category:
 *           type: string
 *         content:
 *           type: string
 *         imageUrl:
 *           type: string
 *         source:
 *           type: string
 *         language:
 *           type: string
 */

/**
 * @swagger
 * /api/education/guides:
 *   get:
 *     summary: Get all health guides (with optional filters)
 *     tags: [HealthGuides]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title (partial match)
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [first-aid, chronic-illness, nutrition, maternal-care, mental-health]
 *         description: Filter by category
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *         description: Filter by language
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by source (partial match)
 *     responses:
 *       200:
 *         description: List of health guides (can be empty)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthGuide'
 *       500:
 *         description: Server error
 *
 *   post:
 *     summary: Create a health guide
 *     tags: [HealthGuides]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthGuideCreateRequest'
 *     responses:
 *       201:
 *         description: Health guide created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Health guide created successfully"
 *                 guide:
 *                   $ref: '#/components/schemas/HealthGuide'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/education/guides/{id}:
 *   get:
 *     summary: Get a health guide by ID
 *     tags: [HealthGuides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Health guide found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthGuide'
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 *
 *   put:
 *     summary: Update a health guide
 *     tags: [HealthGuides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthGuideUpdateRequest'
 *     responses:
 *       200:
 *         description: Guide updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Health guide updated successfully"
 *                 guide:
 *                   $ref: '#/components/schemas/HealthGuide'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 *
 *   delete:
 *     summary: Delete a health guide
 *     tags: [HealthGuides]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Guide deleted successfully (no content)
 *       404:
 *         description: Guide not found
 *       500:
 *         description: Server error
 */

const express = require('express');
const router = express.Router();
const healthGuideController = require('../controllers/healthGuideController');

// GET /api/education/guides  (list + filters)
router.get('/', healthGuideController.getGuides);

// POST /api/education/guides
router.post('/', healthGuideController.createGuide);

// GET /api/education/guides/:id
router.get('/:id', healthGuideController.getGuideById);

// PUT /api/education/guides/:id
router.put('/:id', healthGuideController.updateGuide);

// DELETE /api/education/guides/:id
router.delete('/:id', healthGuideController.deleteGuide);

module.exports = router;
