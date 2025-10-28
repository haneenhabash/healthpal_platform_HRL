const { Consultation, Patient, Doctor } = require('../models');

exports.createConsultation = async (req, res) => {
  try {
    const { date, type, PatientId, DoctorId, notes } = req.body;
    const patient = await Patient.findByPk(PatientId);
    const doctor = await Doctor.findByPk(DoctorId);
    if (!patient || !doctor) {
      return res.status(404).json({ message: 'Doctor or Patient not found' });
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
