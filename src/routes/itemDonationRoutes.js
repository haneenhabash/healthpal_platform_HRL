const express = require('express');
const router = express.Router();

const itemDonationController = require('../controllers/itemDonationController');


router.post('/', itemDonationController.createDonation);

router.get('/', itemDonationController.getAllDonations);

router.get('/filter', itemDonationController.getDonationsByFilters);

router.get('/:id', itemDonationController.getDonationById);

router.put('/:id', itemDonationController.updateDonation);

router.delete('/:id', itemDonationController.deleteDonation);

module.exports = router;
