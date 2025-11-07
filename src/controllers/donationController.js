// src/controllers/donationController.js
const { Donation, TreatmentCase } = require('../models');


exports.createDonation = async (req, res) => {
    try {
        const { donorId, treatmentCaseId, amount } = req.body;


        const donation = await Donation.create({
            donorId,
            treatmentCaseId,
            amount: parseFloat(amount),
            status: 'completed'
        });

        const treatmentCase = await TreatmentCase.findByPk(treatmentCaseId);
        const newAmountRaised = parseFloat(treatmentCase.amountRaised) + parseFloat(amount);

        await treatmentCase.update({
            amountRaised: newAmountRaised,
            amountNeeded: treatmentCase.totalCost - newAmountRaised
        });

        res.status(201).json({
            success: true,
            message: 'Donation successful! 🎉',
            donation: donation
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};