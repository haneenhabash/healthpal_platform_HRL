const { Donation, TreatmentCase, Donor, sequelize } = require('../models');

// 1. Create a new donation (Secure Transaction)
exports.createDonation = async (req, res) => {
    // Start a transaction to ensure data integrity
    const t = await sequelize.transaction();

    try {
        const { donorId, treatmentCaseId, amount } = req.body;
        const donationAmount = parseFloat(amount);

        if (donationAmount <= 0) {
            return res.status(400).json({ error: 'Amount must be greater than 0' });
        }

        // Check if case exists
        const treatmentCase = await TreatmentCase.findByPk(treatmentCaseId, { transaction: t });
        if (!treatmentCase) {
            await t.rollback();
            return res.status(404).json({ error: 'Treatment case not found' });
        }

        // Check if case is already funded or cancelled
        if (treatmentCase.status === 'fully_funded' || treatmentCase.status === 'cancelled') {
            await t.rollback();
            return res.status(400).json({ error: 'This case is already fully funded or cancelled' });
        }

        // Create Donation Record
        const donation = await Donation.create({
            donorId,
            treatmentCaseId,
            amount: donationAmount,
            status: 'completed',
            date: new Date()
        }, { transaction: t });

        // Update Treatment Case Totals
        const currentRaised = parseFloat(treatmentCase.amountRaised);
        const newAmountRaised = currentRaised + donationAmount;
        let newAmountNeeded = parseFloat(treatmentCase.totalCost) - newAmountRaised;

        // Determine new status
        let newStatus = treatmentCase.status;
        if (newAmountNeeded <= 0) {
            newAmountNeeded = 0;
            newStatus = 'fully_funded';
        }

        await treatmentCase.update({
            amountRaised: newAmountRaised,
            amountNeeded: newAmountNeeded,
            status: newStatus
        }, { transaction: t });

        // Commit the transaction (save changes)
        await t.commit();

        res.status(201).json({
            success: true,
            message: 'Donation successful! Thank you for your support. 🎉',
            data: {
                donationId: donation.id,
                amountDonated: donationAmount,
                caseTitle: treatmentCase.title,
                caseStatus: newStatus,
                remainingNeeded: newAmountNeeded
            }
        });

    } catch (error) {
        // If anything goes wrong, rollback changes
        await t.rollback();
        res.status(500).json({ error: error.message });
    }
};

// 2. Get All Donations (Admin Dashboard)
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.findAll({
            include: [
                { model: Donor, attributes: ['name', 'email'] },
                { model: TreatmentCase, attributes: ['title', 'status'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Donations by Donor ID (Donor History)
exports.getDonationsByDonor = async (req, res) => {
    try {
        const { donorId } = req.params;
        const donations = await Donation.findAll({
            where: { donorId },
            include: [{ model: TreatmentCase, attributes: ['title', 'totalCost', 'status'] }]
        });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Get Donations by Case ID (Case Transparency)
exports.getDonationsByCase = async (req, res) => {
    try {
        const { caseId } = req.params;
        const donations = await Donation.findAll({
            where: { treatmentCaseId: caseId },
            include: [{ model: Donor, attributes: ['name'] }] // Show donor names (or hide if anonymous)
        });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};