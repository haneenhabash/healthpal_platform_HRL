const { PublicAlert } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const createAlertSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  type: Joi.string().min(2).max(100).required(),
  region: Joi.string().min(2).max(100).required(),
  status: Joi.string().min(2).max(50).required(),
  severity: Joi.string().min(2).max(50).required(),
  description: Joi.string().min(5).allow('', null),
});

const updateAlertSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  type: Joi.string().min(2).max(100),
  region: Joi.string().min(2).max(100),
  status: Joi.string().min(2).max(50),
  severity: Joi.string().min(2).max(50),
  description: Joi.string().min(5).allow('', null),
}).min(1);

const querySchema = Joi.object({
  type: Joi.string(),
  region: Joi.string(),
  status: Joi.string(),
  severity: Joi.string(),
  title: Joi.string(),
});

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

exports.createAlert = async (req, res) => {
  try {
    const { error, value } = createAlertSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const alert = await PublicAlert.create(value);
    return res
      .status(201)
      .json({ message: 'Public health alert created successfully', alert });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((e) => e.message)
      });
    }

    return res
      .status(500)
      .json({ message: 'Error creating alert', error: error.message });
  }
};

exports.searchAlerts = async (req, res) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { type, region, status, severity, title } = value;
    const where = {};

    if (title) where.title = { [Op.like]: `%${title}%` };
    if (type) where.type = type;
    if (region) where.region = region;
    if (status) where.status = status;
    if (severity) where.severity = severity;

    const alerts = await PublicAlert.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return res.json(alerts);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error searching alerts', error: error.message });
  }
};

exports.getAlertById = async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const alert = await PublicAlert.findByPk(value.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    return res.json(alert);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching alert', error: error.message });
  }
};

exports.updateAlert = async (req, res) => {
  try {
    const { error: idError, value: idValue } = idSchema.validate(req.params);
    if (idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    const { error, value } = updateAlertSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const alert = await PublicAlert.findByPk(idValue.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await alert.update(value);

    return res.json({
      message: 'Public health alert updated successfully',
      alert
    });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((e) => e.message)
      });
    }

    return res
      .status(500)
      .json({ message: 'Error updating alert', error: error.message });
  }
};

exports.deleteAlert = async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const alert = await PublicAlert.findByPk(value.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }
    await alert.destroy();
    return res.json({ message: 'Public health alert deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error deleting alert', error: error.message });
  }
};
