const express = require('express');
const router = express.Router();
const healthGuideController = require('../controllers/healthGuideController');

router.get('/search', healthGuideController.searchGuides);

router.post('/', healthGuideController.createGuide);

router.get('/', healthGuideController.getAllGuides);

router.get('/:id', healthGuideController.getGuideById);

router.put('/:id', healthGuideController.updateGuide);

router.delete('/:id', healthGuideController.deleteGuide);


module.exports = router;
