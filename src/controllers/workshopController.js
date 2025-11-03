const { Workshop, Registration } = require('../models');
const { Op } = require('sequelize');

exports.createWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json({ message: 'Workshop created successfully', workshop });
  } catch (error) {
    res.status(500).json({ message: 'Error creating workshop', error: error.message });
  }
};

exports.getAllWorkshops = async (req, res) => {
  try {
    const { category, language, status, date } = req.query;
    const where = {};

    if (category) where.category = category;
    if (language) where.language = language;
    if (status) where.status = status;
    if (date) where.date = { [Op.gte]: new Date(date) };

    const workshops = await Workshop.findAll({
      where,
      order: [['date', 'ASC']],
      include: [{ model: Registration }]
    });

    res.json(workshops);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workshops', error: error.message });
  }
};

exports.getWorkshopById = async (req, res) => {
  try {
    const workshop = await Workshop.findByPk(req.params.id, {
      include: [{ model: Registration }]
    });

    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json(workshop);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workshop', error: error.message });
  }
};

exports.updateWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByPk(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    await workshop.update(req.body);
    res.json({ message: 'Workshop updated successfully', workshop });
  } catch (error) {
    res.status(500).json({ message: 'Error updating workshop', error: error.message });
  }
};

exports.deleteWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.findByPk(req.params.id);
    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

    await workshop.destroy();
    res.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting workshop', error: error.message });
  }
};

exports.getAttendees = async (req, res) => {
  try {
    const workshop = await Workshop.findByPk(req.params.id, {
      include: [{ model: Registration }]
    });

    if (!workshop) return res.status(404).json({ message: 'Workshop not found' });
    res.json(workshop.Registrations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendees', error: error.message });
  }
};
