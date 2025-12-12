const { Equipment } = require('../models');

exports.createEquipment = async (req, res) => {
  try {
    const { name, description, category, quantity, status } = req.body;

    const newEquipment = await Equipment.create({
      name,
      description,
      category,
      quantity: quantity || 0,
      status: status || 'available',
    });

    res.status(201).json({ message: 'Equipment created successfully', equipment: newEquipment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating equipment', error: error.message });
  }
};

exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.findAll();
    res.json(equipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching equipments', error: error.message });
  }
};

exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
    res.json(equipment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching equipment', error: error.message });
  }
};

exports.getEquipmentsByName = async (req, res) => {
  try {
    const { name } = req.params;
    const equipments = await Equipment.findAll();
    const filtered = equipments.filter(e =>
      e.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching equipments by name', error: error.message });
  }
};

exports.getEquipmentsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const equipments = await Equipment.findAll({ where: { category } });
    res.json(equipments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching equipments by category', error: error.message });
  }
};

exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

    await equipment.update(req.body);
    res.json({ message: 'Equipment updated successfully', equipment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating equipment', error: error.message });
  }
};

exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByPk(req.params.id);
    if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

    await equipment.destroy();
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting equipment', error: error.message });
  }
};
