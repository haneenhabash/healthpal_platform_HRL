const { Consultation, Patient, Doctor } = require('../models');
const { Op } = require('sequelize');

exports.createConsultation = async (req, res) => {
  try {
    const { date, type, PatientId, DoctorId, notes } = req.body;
    const patient = await Patient.findByPk(PatientId);
    const doctor = await Doctor.findByPk(DoctorId);
    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Doctor or Patient not found' });
    }
const conflict = await Consultation.findOne({
  where: {
    date,
    [Op.or]: [
      { DoctorId },
      { PatientId }
    ]
  }
});
const validTypes = ['video', 'audio', 'message'];
if (!validTypes.includes(type)) {
  return res.status(400).json({ message: 'Invalid consultation type. Must be video, audio, or message.' });
}
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
    console.error(error);
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
    if (!consultation)
      return res.status(404).json({ message: 'Consultation not found' });

    await consultation.destroy();
    res.json({ message: 'Consultation deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting consultation', error: error.message });
  }
};

