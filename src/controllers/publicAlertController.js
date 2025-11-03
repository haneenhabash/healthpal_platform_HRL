const { PublicAlert } = require('../models');
const { Op } = require('sequelize');

exports.createAlert = async (req, res) => {
  try {
    const alert = await PublicAlert.create(req.body);
    res.status(201).json({ message: 'Public health alert created successfully', alert });
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error: error.message });
  }
};

exports.getAllAlerts = async (req, res) => {
  try {
    const alerts = await PublicAlert.findAll({ order: [['createdAt', 'DESC']] });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error: error.message });
  }
};

exports.searchAlerts = async (req, res) => {
  try {
    const { type, region, status, severity, title } = req.query;
    const where = {};

    if (title) where.title = { [Op.like]: `%${title}%` };
    if (type) where.type = type;
    if (region) where.region = region;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alerts = await PublicAlert.findAll({ where, order: [['createdAt', 'DESC']] });

    if (alerts.length === 0)
      return res.status(404).json({ message: 'No alerts found matching your criteria' });

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching alerts', error: error.message });
  }
};

exports.getAlertById = async (req, res) => {
  try {
    const alert = await PublicAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alert', error: error.message });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const alert = await PublicAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    await alert.update(req.body);
    res.json({ message: 'Public health alert updated successfully', alert });
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert', error: error.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const alert = await PublicAlert.findByPk(req.params.id);
    if (!alert) return res.status(404).json({ message: 'Alert not found' });
    await alert.destroy();
    res.json({ message: 'Public health alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert', error: error.message });
  }
};
