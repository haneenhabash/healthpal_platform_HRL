// src/controllers/treatmentCaseController.js
const { TreatmentCase, Patient, Donation, Donor, ExpenseRecord } = require('../models');

exports.getActiveCases = async (req, res) => {
    try {
        const { treatmentType, urgency } = req.query;

        let whereClause = { status: 'active', isVerified: true };
        if (treatmentType) whereClause.treatmentType = treatmentType;
        if (urgency) whereClause.urgencyLevel = urgency;

        console.log('🔍 Searching for cases with:', whereClause);

        const cases = await TreatmentCase.findAll({
            where: whereClause,
            include: [{
                model: Patient,
                attributes: ['id', 'name', 'age', 'gender']
            }]
        });

        console.log('📊 Found cases:', cases.length);

        res.json(cases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCase = async (req, res) => {
    try {
        const treatmentCase = await TreatmentCase.create(req.body);
        res.status(201).json(treatmentCase);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getCaseById = async (req, res) => {
    try {
        const treatmentCase = await TreatmentCase.findByPk(req.params.id);
        if (!treatmentCase) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(treatmentCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getPendingCases = async (req, res) => {
    try {

        const cases = await TreatmentCase.findAll({
            where: {
                status: 'pending',
                isVerified: false
            }
        });

        console.log('📊 Raw pending cases:', cases);

        res.json({
            count: cases.length,
            pendingCases: cases
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Verify and activate a treatment case (for admins)
exports.verifyCase = async (req, res) => {
    try {
        const { id } = req.params;

        const treatmentCase = await TreatmentCase.findByPk(id, {
            include: [{
                model: Patient,
                attributes: ['id', 'name', 'age']
            }]
        });

        if (!treatmentCase) {
            return res.status(404).json({ error: 'Treatment case not found' });
        }

        if (treatmentCase.status !== 'pending') {
            return res.status(400).json({
                error: 'Cannot verify a case that is not pending'
            });
        }


        // Update case to active and verified
        await treatmentCase.update({
            status: 'active',
            isVerified: true,
            verifiedAt: new Date()
        });

        res.json({
            success: true,
            message: '✅ Treatment case verified and activated successfully!',
            treatmentCase: {
                id: treatmentCase.id,
                title: treatmentCase.title,
                patientName: treatmentCase.Patient.name,
                status: treatmentCase.status,
                isVerified: treatmentCase.isVerified
            }
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
    // Get Transparency Data for a specific case
    exports.getCaseTransparencyData = async (req, res) => {
        try {
            const { id } = req.params;

            const treatmentCase = await TreatmentCase.findByPk(id, {
                include: [
                    // 1. Get Expenses (Invoices)
                    { model: ExpenseRecord, as: 'expenses' },
                    // 2. Get Patient Feedback (Already in your model as JSON or relation)
                ]
            });

            if (!treatmentCase) return res.status(404).json({ message: 'Case not found' });

            res.json({
                caseTitle: treatmentCase.title,
                totalRaised: treatmentCase.amountRaised,
                expenses: treatmentCase.expenses, // List of invoices
                feedbacks: treatmentCase.patientFeedback, // "Thank you" messages
                recoveryUpdates: treatmentCase.recoveryUpdates // Recovery timeline
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };

    // Admin: Upload Expense Record
    exports.addExpenseRecord = async (req, res) => {
        try {
            const { id } = req.params; // Case ID
            const { title, amount, imageUrl, description } = req.body;

            const expense = await ExpenseRecord.create({
                treatmentCaseId: id,
                title,
                amount,
                imageUrl,
                description
            });

            res.status(201).json({ message: 'Expense record added', expense });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};