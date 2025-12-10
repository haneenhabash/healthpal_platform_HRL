const { Consultation, Patient, Doctor } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const consultationSchema = Joi.object({
  date: Joi.date().required(),
  type: Joi.string().valid('video', 'audio', 'message').required(),
  PatientId: Joi.number().integer().required(),
  DoctorId: Joi.number().integer().required(),
  notes: Joi.string().allow('', null)
});

exports.createConsultation = async (req, res) => {
  try {
    const { error, value } = consultationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { date, type, PatientId, DoctorId, notes } = value;

    const patient = await Patient.findByPk(PatientId);
    const doctor = await Doctor.findByPk(DoctorId);
    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Doctor or Patient not found' });
    }

    const conflict = await Consultation.findOne({
      where: {
        date,
        [Op.or]: [{ DoctorId }, { PatientId }]
      }
    });

    if (conflict) {
      return res.status(400).json({
        message: 'Time conflict: either the doctor or the patient already has a consultation at this time'
      });
    }

    const consultation = await Consultation.create({
      date,
      type,
      PatientId,
      DoctorId,
      notes,
      status: 'pending'
    });

    res.status(201).json({ message: 'Consultation booked successfully', consultation });

  } catch (error) {
    res.status(500).json({ message: 'Error creating consultation', error: error.message });
  }
};

exports.getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      include: [Patient, Doctor],
      order: [['date', 'DESC']]
    });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations', error: error.message });
  }
};

exports.getByPatient = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      where: { PatientId: req.params.id },
      include: [Doctor]
    });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patient consultations', error: error.message });
  }
};

exports.getByDoctor = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      where: { DoctorId: req.params.id },
      include: [Patient]
    });
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor consultations', error: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    consultation.status = status;
    await consultation.save();

    res.json({ message: 'Status updated', consultation });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

exports.deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) return res.status(404).json({ message: 'Consultation not found' });

    await consultation.destroy();
    res.json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation', error: error.message });
  }
};
