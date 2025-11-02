const { HealthGuide } = require('../models');
const { Op } = require('sequelize');

exports.searchGuides = async (req, res) => {
  try {
    const { title, category, language, source } = req.query;

    const where = {};

    if (title) where.title = { [Op.like]: `%${title}%` }; 
    if (category) where.category = category;
    if (language) where.language = language;
    if (source) where.source = { [Op.like]: `%${source}%` };

    const guides = await HealthGuide.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    if (guides.length === 0)
      return res.status(404).json({ message: 'No health guides found matching your criteria' });

    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: 'Error searching guides', error: error.message });
  }
};












exports.createGuide = async (req, res) => {
  try {
    const { title, category, content, imageUrl, source, language } = req.body;

    const guide = await HealthGuide.create({
      title,
      category,
      content,
      imageUrl,
      source,
      language
    });

    res.status(201).json({ message: 'Health guide created successfully', guide });
  } catch (error) {
    res.status(500).json({ message: 'Error creating health guide', error: error.message });
  }
};


exports.getAllGuides = async (req, res) => {
  try {
    const guides = await HealthGuide.findAll({ order: [['createdAt', 'DESC']] });
    res.json(guides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guides', error: error.message });
  }
};

exports.getGuideById = async (req, res) => {
  try {
    const guide = await HealthGuide.findByPk(req.params.id);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });
    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching guide', error: error.message });
  }
};

exports.updateGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, content, imageUrl, source, language } = req.body;

    const guide = await HealthGuide.findByPk(id);
    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    await guide.update({
      title,
      category,
      content,
      imageUrl,
      source,
      language
    });

    res.json({ message: 'Health guide updated successfully', guide });
  } catch (error) {
    res.status(500).json({ message: 'Error updating guide', error: error.message });
  }
};
exports.deleteGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const guide = await HealthGuide.findByPk(id);

    if (!guide) return res.status(404).json({ message: 'Guide not found' });

    await guide.destroy();
    res.json({ message: 'Health guide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting guide', error: error.message });
  }
};


