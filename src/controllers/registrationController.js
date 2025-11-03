const { Workshop, Registration, Patient } = require('../models');

exports.registerForWorkshop = async (req, res) => {
  try {
    const { WorkshopId, PatientId, name, email, phone } = req.body;

    const workshop = await Workshop.findByPk(WorkshopId, {
      include: [Registration]
    });
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    const count = workshop.Registrations.length;
    if (count >= workshop.maxParticipants)
      return res.status(400).json({ message: 'Workshop is full' });

    const alreadyRegistered = await Registration.findOne({
      where: { WorkshopId, email }
    });
    if (alreadyRegistered)
      return res.status(400).json({ message: 'You are already registered for this workshop' });

    const registration = await Registration.create({
      WorkshopId,
      PatientId: PatientId || null,
      name,
      email,
      phone
    });

    res.status(201).json({ message: 'Registered successfully', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error registering', error: error.message });
  }
};

exports.updateRegistration = async (req, res) => {
  try {
    const registration = await Registration.findByPk(req.params.id);
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    await registration.update(req.body);

    if (req.body.rating) {
      const allRegs = await Registration.findAll({
        where: { WorkshopId: registration.WorkshopId, rating: { [require('sequelize').Op.not]: null } }
      });
      const avg =
        allRegs.reduce((sum, r) => sum + r.rating, 0) / allRegs.length;
      const workshop = await Workshop.findByPk(registration.WorkshopId);
      workshop.averageRating = parseFloat(avg.toFixed(2));
      await workshop.save();
    }

    res.json({ message: 'Registration updated', registration });
  } catch (error) {
    res.status(500).json({ message: 'Error updating registration', error: error.message });
  }
};
