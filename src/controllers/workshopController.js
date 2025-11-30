const { Workshop, Registration } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const createWorkshopSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(5).allow('', null),
  category: Joi.string().min(2).max(100).required(),
  language: Joi.string().min(2).max(20).required(),
  status: Joi.string().min(2).max(50).required(),
  date: Joi.date().required(),
  maxParticipants: Joi.number().integer().positive().required(),
  speaker: Joi.string().min(3).max(255).required(),
  location: Joi.string().min(2).max(255).allow('', null)
});

const updateWorkshopSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().min(5).allow('', null),
  category: Joi.string().min(2).max(100),
  language: Joi.string().min(2).max(20),
  status: Joi.string().min(2).max(50),
  date: Joi.date(),
  maxParticipants: Joi.number().integer().positive(),
  speaker: Joi.string().min(3).max(255),
  location: Joi.string().min(2).max(255).allow('', null)
}).min(1);

const querySchema = Joi.object({
  category: Joi.string(),
  language: Joi.string(),
  status: Joi.string(),
  date: Joi.date()
});

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

exports.createWorkshop = async (req, res) => {
  try {
    const { error, value } = createWorkshopSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const workshop = await Workshop.create(value);
    return res
      .status(201)
      .json({ message: 'Workshop created successfully', workshop });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }

    return res
      .status(500)
      .json({ message: 'Error creating workshop', error: error.message });
  }
};

exports.getAllWorkshops = async (req, res) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { category, language, status, date } = value || {};
    const where = {};

    if (category) where.category = category;
    if (language) where.language = language;
    if (status) where.status = status;
    if (date) where.date = { [Op.gte]: date };

    const workshops = await Workshop.findAll({
      where,
      order: [['date', 'ASC']],
      include: [{ model: Registration }]
    });

    return res.json(workshops);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching workshops', error: error.message });
  }
};

exports.getWorkshopById = async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const workshop = await Workshop.findByPk(value.id, {
      include: [{ model: Registration }]
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    return res.json(workshop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching workshop', error: error.message });
  }
};

exports.updateWorkshop = async (req, res) => {
  try {
    const { error: idError, value: idValue } = idSchema.validate(req.params);
    if (idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    const { error, value } = updateWorkshopSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const workshop = await Workshop.findByPk(idValue.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    await workshop.update(value);

    return res.json({ message: 'Workshop updated successfully', workshop });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }

    return res
      .status(500)
      .json({ message: 'Error updating workshop', error: error.message });
  }
};

exports.deleteWorkshop = async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const workshop = await Workshop.findByPk(value.id);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    await workshop.destroy();
    return res.json({ message: 'Workshop deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error deleting workshop', error: error.message });
  }
};

exports.getAttendees = async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const workshop = await Workshop.findByPk(value.id, {
      include: [{ model: Registration }]
    });

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    return res.json(workshop.Registrations);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching attendees', error: error.message });
  }
};
