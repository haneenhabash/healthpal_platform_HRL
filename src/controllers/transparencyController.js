// src/controllers/transparencyController.js
const { TreatmentCase, Invoice, Donation, Patient, Donor } = require('../models');

// لوحة التحكم الشاملة للحالة
exports.getCaseDashboard = async (req, res) => {
    try {
        const { caseId } = req.params;

        const treatmentCase = await TreatmentCase.findByPk(caseId, {
            include: [
                {
                    model: Patient,
                    attributes: ['id', 'name', 'age', 'gender', 'medicalHistory']
                },
                {
                    model: Donation,
                    include: [{
                        model: Donor,
                        attributes: ['id', 'name', 'isAnonymous']
                    }]
                },
                {
                    model: Invoice
                }
            ]
        });

        if (!treatmentCase) {
            return res.status(404).json({ error: 'Treatment case not found' });
        }

        // تجميع بيانات الشفافية
        const dashboardData = {
            caseInfo: {
                id: treatmentCase.id,
                title: treatmentCase.title,
                treatmentType: treatmentCase.treatmentType,
                totalCost: treatmentCase.totalCost,
                amountRaised: treatmentCase.amountRaised,
                amountNeeded: treatmentCase.amountNeeded,
                progress: ((treatmentCase.amountRaised / treatmentCase.totalCost) * 100).toFixed(1),
                status: treatmentCase.status,
                story: treatmentCase.story
            },
            patientInfo: {
                name: treatmentCase.Patient.name,
                age: treatmentCase.Patient.age,
                medicalHistory: treatmentCase.Patient.medicalHistory
            },
            financialTransparency: {
                totalDonations: treatmentCase.Donations.length,
                totalDonated: treatmentCase.Donations.reduce((sum, d) => sum + parseFloat(d.amount), 0),
                totalInvoices: treatmentCase.Invoices.length,
                totalInvoiced: treatmentCase.Invoices.reduce((sum, i) => sum + parseFloat(i.amount), 0),
                balance: treatmentCase.amountRaised - treatmentCase.Invoices.reduce((sum, i) => sum + parseFloat(i.amount), 0),
                invoices: treatmentCase.Invoices.map(invoice => ({
                    id: invoice.id,
                    number: invoice.invoiceNumber,
                    amount: invoice.amount,
                    description: invoice.description,
                    type: invoice.invoiceType,
                    status: invoice.status,
                    date: invoice.dateIssued,
                    receiptUrl: invoice.receiptUrl
                }))
            },
            donations: treatmentCase.Donations.map(donation => ({
                id: donation.id,
                amount: donation.amount,
                date: donation.donationDate,
                donor: donation.isAnonymous ? 'Anonymous Donor' : donation.Donor.name,
                message: donation.message
            })),
            recoveryUpdates: treatmentCase.recoveryUpdates || [],
            summary: {
                fundsUtilized: (treatmentCase.Invoices.reduce((sum, i) => sum + parseFloat(i.amount), 0) / treatmentCase.amountRaised * 100).toFixed(1),
                treatmentProgress: treatmentCase.recoveryUpdates ? treatmentCase.recoveryUpdates.length > 2 ? 'Advanced' : 'In Progress' : 'Not Started'
            }
        };

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// إضافة فاتورة جديدة
exports.createInvoice = async (req, res) => {
    try {
        const { caseId } = req.params;
        const { amount, description, invoiceType, donationId } = req.body;

        const treatmentCase = await TreatmentCase.findByPk(caseId);
        if (!treatmentCase) {
            return res.status(404).json({ error: 'Treatment case not found' });
        }

        const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        const invoice = await Invoice.create({
            treatmentCaseId: caseId,
            donationId: donationId || null,
            invoiceNumber,
            amount: parseFloat(amount),
            description,
            invoiceType: invoiceType || 'other',
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Invoice created successfully!',
            invoice: {
                id: invoice.id,
                number: invoice.invoiceNumber,
                amount: invoice.amount,
                description: invoice.description,
                type: invoice.invoiceType
            }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// إضافة تحديث تعافي
exports.addRecoveryUpdate = async (req, res) => {
    try {
        const { caseId } = req.params;
        const { update, photos = [] } = req.body;

        const treatmentCase = await TreatmentCase.findByPk(caseId);
        if (!treatmentCase) {
            return res.status(404).json({ error: 'Treatment case not found' });
        }

        const newUpdate = {
            id: Date.now(),
            date: new Date().toISOString(),
            update,
            photos
        };

        const currentUpdates = treatmentCase.recoveryUpdates || [];
        currentUpdates.unshift(newUpdate); // Add to beginning

        await treatmentCase.update({
            recoveryUpdates: currentUpdates
        });

        res.json({
            success: true,
            message: 'Recovery update added successfully!',
            update: newUpdate
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.addPatientFeedback = async (req, res) => {
    try {
        const { caseId } = req.params;
        const { rating, comment } = req.body;

        const treatmentCase = await TreatmentCase.findByPk(caseId);

        const feedback = {
            rating: parseInt(rating),
            comment
        };

        const currentFeedback = treatmentCase.patientFeedback || [];
        currentFeedback.unshift(feedback);

        await treatmentCase.update({
            patientFeedback: currentFeedback  // ◀─── نخزن في الحقل الجديد
        });

        res.json({
            success: true,
            message: 'Patient feedback added successfully!',
            feedback
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};