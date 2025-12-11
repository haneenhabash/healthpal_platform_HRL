const { Appointment, Availability, Patient, Doctor } = require('../models'); // استيراد النماذج

exports.requestAppointment = async (req, res) => {
    const { doctorId, patientId, availabilityId } = req.body;

    try {
        
        const availability = await Availability.findOne({
            where: { id: availabilityId, doctorId, status: 'available' }
        });

        if (!availability) {
            return res.status(400).json({ message: 'Availability is not available or already booked' });
        }

       
        const appointment = await Appointment.create({
            doctorId,
            patientId,
            availabilityId,
            status: 'pending'
        });

        availability.status = 'booked';
        await availability.save();

        res.status(201).json({ message: 'Appointment requested successfully', appointment });
    } catch (error) {
        res.status(500).json({ message: 'Error requesting appointment', error: error.message });
    }
};


exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            include: [Doctor, Patient, Availability] 
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments', error: error.message });
    }
};


exports.getAppointmentById = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findOne({
            where: { id },
            include: [Doctor, Patient, Availability] 
        });

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointment by ID', error: error.message });
    }
};


exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    
    const allowedStatuses = ['pending', 'confirmed', 'cancelled'];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value',
        allowedStatuses
      });
    }

    
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json({
      message: `Appointment status updated to ${status}`,
      appointment
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating appointment status',
      error: error.message
    });
  }
};

exports.getAppointmentsByCriteria = async (req, res) => {
    const { doctorId, patientId, status } = req.query;

    const filters = {};

    if (doctorId) filters.doctorId = doctorId;
    if (patientId) filters.patientId = patientId;
    if (status) filters.status = status;

    try {
        const appointments = await Appointment.findAll({
            where: filters,
            include: [Doctor, Patient, Availability]
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments by criteria', error: error.message });
    }
};



