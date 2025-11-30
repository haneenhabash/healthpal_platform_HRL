const { HealthGuide } = require('../models');
const { Op } = require('sequelize');
const Joi = require('joi');

const querySchema = Joi.object({
  title: Joi.string(),
  category: Joi.string(),
  language: Joi.string(),
  source: Joi.string()
});

const createGuideSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  category: Joi.string().min(2).max(100).required(),
  content: Joi.string().min(10).required(),
  imageUrl: Joi.string().uri().allow(null, ''),
  source: Joi.string().allow(null, ''),
  language: Joi.string().min(2).max(10).required()
});

const updateGuideSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  category: Joi.string().min(2).max(100),
  content: Joi.string().min(10),
  imageUrl: Joi.string().uri().allow(null, ''),
  source: Joi.string().allow(null, ''),
  language: Joi.string().min(2).max(10)
}).min(1);

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

exports.getGuides = async (req, res) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { title, category, language, source } = value;
    const where = {};

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }
    if (category) {
      where.category = category;
    }
    if (language) {
      where.language = language;
    }
    if (source) {
      where.source = { [Op.like]: `%${source}%` };
    }

    const guides = await HealthGuide.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    return res.json(guides);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching guides', error: error.message });
  }
};

exports.createGuide = async (req, res) => {
  try {
    const { error, value } = createGuideSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const guide = await HealthGuide.create(value);

    return res
      .status(201)
      .json({ message: 'Health guide created successfully', guide });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((e) => e.message)
      });
    }

    return res
      .status(500)
      .json({ message: 'Error creating health guide', error: error.message });
  }
};

exports.getGuideById = async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const guide = await HealthGuide.findByPk(value.id);

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    return res.json(guide);
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error fetching guide', error: error.message });
  }
};

exports.updateGuide = async (req, res) => {
  try {
    const { error: idError, value: idValue } = idSchema.validate(req.params);
    if (idError) return res.status(400).json({ message: idError.details[0].message });

    const { error, value } = updateGuideSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const guide = await HealthGuide.findByPk(idValue.id);

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    await guide.update(value);

    return res.json({ message: 'Health guide updated successfully', guide });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((e) => e.message)
      });
    }

    return res
      .status(500)
      .json({ message: 'Error updating guide', error: error.message });
  }
};

exports.deleteGuide = async (req, res) => {
  try {
    const { error, value } = idSchema.validate(req.params);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const guide = await HealthGuide.findByPk(value.id);

    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }

    await guide.destroy();

    return res.status(204).send();
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Error deleting guide', error: error.message });
  }
};
