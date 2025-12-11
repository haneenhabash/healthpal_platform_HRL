// src/routes/traumaRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const assessmentController = require('../controllers/assessmentController');
const supportGroupController = require('../controllers/supportGroupController');
const journalController = require('../controllers/journalController');

// ==========================================
//(Multer Config)
// ==========================================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

/**
 * @swagger
 * tags:
 *   - name: Mental Assessments
 *     description: PTSD & Trauma screening tests and history
 *   - name: Support Groups
 *     description: Group therapy management for war survivors & children
 *   - name: Trauma Journals
 *     description: Private diaries with drawing/voice support for patients
 */

// ==========================================
//  (Assessments)
// ==========================================

/**
 * @swagger
 * /api/trauma/assessments/tests:
 *   get:
 *     summary: Get available mental health tests (Questions)
 *     tags: [Mental Assessments]
 *     responses:
 *       200:
 *         description: List of available tests with questions
 */
router.get('/assessments/tests', assessmentController.getAvailableTests);

/**
 * @swagger
 * /api/trauma/assessments/submit:
 *   post:
 *     summary: Submit a new assessment (PTSD, Anxiety, etc.)
 *     tags: [Mental Assessments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - patientId
 *               - testType
 *               - answers
 *             properties:
 *               patientId:
 *                 type: integer
 *               testType:
 *                 type: string
 *                 example: "PTSD_Checklist"
 *               answers:
 *                 type: object
 *                 example: { "1": "yes", "2": "no", "3": "yes", "4": "yes" }
 *     responses:
 *       201:
 *         description: Assessment submitted and risk calculated
 */
router.post('/assessments/submit', assessmentController.submitAssessment);

/**
 * @swagger
 * /api/trauma/assessments/history/{patientId}:
 *   get:
 *     summary: Get assessment history for a patient
 *     tags: [Mental Assessments]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: History retrieved successfully
 */
router.get('/assessments/history/:patientId', assessmentController.getPatientHistory);


// ==========================================
// 2. (Support Groups)
// ==========================================

/**
 * @swagger
 * /api/trauma/groups:
 *   get:
 *     summary: Get all active support groups
 *     tags: [Support Groups]
 *     responses:
 *       200:
 *         description: List of groups
 */
router.get('/groups', supportGroupController.getAllGroups);

/**
 * @swagger
 * /api/trauma/groups/create:
 *   post:
 *     summary: Create a new support group (Doctor only)
 *     tags: [Support Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gaza Mothers Support"
 *               topic:
 *                 type: string
 *                 enum: [War_Trauma, Grief_and_Loss, Mothers_Support]
 *               description:
 *                 type: string
 *               moderatorId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Group created successfully
 */
router.post('/groups/create', supportGroupController.createGroup);

/**
 * @swagger
 * /api/trauma/groups/join:
 *   post:
 *     summary: Patient joins a support group
 *     tags: [Support Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: integer
 *               patientId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Joined successfully
 */
router.post('/groups/join', supportGroupController.joinGroup);

/**
 * @swagger
 * /api/trauma/groups/leave:
 *   post:
 *     summary: Patient leaves a support group
 *     tags: [Support Groups]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: integer
 *               patientId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Left group successfully
 */
router.post('/groups/leave', supportGroupController.leaveGroup);

/**
 * @swagger
 * /api/trauma/groups/my-groups/{patientId}:
 *   get:
 *     summary: Get groups that a specific patient has joined
 *     tags: [Support Groups]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of joined groups
 */
router.get('/groups/my-groups/:patientId', supportGroupController.getPatientGroups);


// ==========================================
// 3. (Journals)
// ==========================================

/**
 * @swagger
 * /api/trauma/journal:
 *   post:
 *     summary: Create a journal entry (Text, Audio, or Drawing)
 *     tags: [Trauma Journals]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: integer
 *               mood:
 *                 type: string
 *                 enum: [Happy, Calm, Sad, Angry, Anxious, Panic, Numb]
 *               content:
 *                 type: string
 *                 description: Text content of the diary
 *               isSharedWithDoctor:
 *                 type: boolean
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Upload drawing (image) or voice note (audio)
 *     responses:
 *       201:
 *         description: Journal entry created
 */
router.post('/journal', upload.single('file'), journalController.createEntry);

/**
 * @swagger
 * /api/trauma/journal/{patientId}:
 *   get:
 *     summary: Get all journal entries for a patient
 *     tags: [Trauma Journals]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of entries
 */
router.get('/journal/:patientId', journalController.getPatientEntries);

/**
 * @swagger
 * /api/trauma/journal/doctor-view/{patientId}:
 *   get:
 *     summary: Get ONLY shared journal entries (For Doctor)
 *     tags: [Trauma Journals]
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of shared entries
 */
router.get('/journal/doctor-view/:patientId', journalController.getDoctorView);

/**
 * @swagger
 * /api/trauma/journal/{id}/share:
 *   patch:
 *     summary: Toggle sharing status with doctor
 *     tags: [Trauma Journals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Journal Entry ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Share status updated
 */
router.patch('/journal/:id/share', journalController.toggleShareStatus);

/**
 * @swagger
 * /api/trauma/journal/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Trauma Journals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entry deleted
 */
router.delete('/journal/:id', journalController.deleteEntry);
/**
 * @swagger
 * tags:
 *   - name: Group Chat & Sessions
 *     description: Live interaction and video meetings for support groups
 */

// ==========================================
// 4. (Chat & Sessions)
// ==========================================

/**
 * @swagger
 * /api/trauma/groups/message:
 *   post:
 *     summary: Post a message to the support group chat
 *     tags: [Group Chat & Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: integer
 *               senderId:
 *                 type: integer
 *               senderType:
 *                 type: string
 *                 enum: [Patient, Doctor]
 *               content:
 *                 type: string
 *               isAnonymous:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Message sent
 */
router.post('/groups/message', supportGroupController.postMessage);

/**
 * @swagger
 * /api/trauma/groups/messages/{groupId}:
 *   get:
 *     summary: Get chat history for a group
 *     tags: [Group Chat & Sessions]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of messages
 */
router.get('/groups/messages/:groupId', supportGroupController.getGroupMessages);

/**
 * @swagger
 * /api/trauma/groups/session/schedule:
 *   post:
 *     summary: Schedule a live video session (Doctor/Moderator)
 *     tags: [Group Chat & Sessions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               groupId:
 *                 type: integer
 *               title:
 *                 type: string
 *                 example: "Weekly Anxiety Support"
 *               scheduledAt:
 *                 type: string
 *                 format: date-time
 *               meetingLink:
 *                 type: string
 *                 example: "https://zoom.us/j/123456"
 *     responses:
 *       201:
 *         description: Session scheduled
 */
router.post('/groups/session/schedule', supportGroupController.scheduleSession);

/**
 * @swagger
 * /api/trauma/groups/sessions/{groupId}:
 *   get:
 *     summary: Get upcoming sessions for a group
 *     tags: [Group Chat & Sessions]
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of sessions
 */
router.get('/groups/sessions/:groupId', supportGroupController.getGroupSessions);
module.exports = router;