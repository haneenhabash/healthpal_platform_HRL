// src/controllers/assessmentController.js
const { MentalAssessment, Patient } = require('../models');
const tests = require('../utils/medicalTests');

exports.getAvailableTests = (req, res) => {
    res.json(tests);
};

exports.submitAssessment = async (req, res) => {
    try {
        const { patientId, testType, answers } = req.body;

        const patient = await Patient.findByPk(patientId);
        if (!patient) return res.status(404).json({ msg: 'Patient not found' });

        const testTemplate = tests[testType];
        if (!testTemplate) return res.status(400).json({ msg: 'Invalid test type' });

        let totalScore = 0;


        testTemplate.questions.forEach(q => {
            const patientAnswer = answers[q.id];
            if (patientAnswer === 'yes' || patientAnswer === true) {
                totalScore += q.weight;
            }
        });

        const riskLevel = testTemplate.calculateRisk(totalScore);

        const newAssessment = await MentalAssessment.create({
            patientId,
            type: testType,
            score: totalScore,
            riskLevel,
            answers,
            status: riskLevel === 'Critical' ? 'Pending' : 'Reviewed'
        });

        res.status(201).json({
            msg: 'Assessment submitted successfully',
            riskLevel: riskLevel,
            data: newAssessment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};

exports.getPatientHistory = async (req, res) => {
    try {
        const { patientId } = req.params;

        const history = await MentalAssessment.findAll({
            where: { patientId },
            order: [['createdAt', 'DESC']]
        });

        res.json(history);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error', error: error.message });
    }
};