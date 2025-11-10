const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

router.get('/matched-requests', volunteerController.getMatchedRequests);
router.put('/deliver/:id', volunteerController.markRequestDelivered);

module.exports = router;
