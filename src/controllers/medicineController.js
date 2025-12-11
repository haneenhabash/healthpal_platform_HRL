const { Medicine } = require('../models');


exports.createMedicine = async (req, res) => {
  try {
    const { name, description, expiryDate, category, quantity } = req.body;

    const newMedicine = await Medicine.create({
      name,
      description,
      expiryDate,
      category,
      quantity: quantity || 0
    });

    res.status(201).json({ message: 'Medicine created successfully', medicine: newMedicine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating medicine', error: error.message });
  }
};

exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll();
    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medicines', error: error.message });
  }
};


exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });
    res.json(medicine);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medicine', error: error.message });
  }
};

exports.getMedicinesByName = async (req, res) => {
  try {
    const { name } = req.params;
    const medicines = await Medicine.findAll();
    const filtered = medicines.filter(m => 
      m.name.toLowerCase().includes(name.toLowerCase())
    );
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicines by name22', error: error.message });
  }
};



exports.getMedicinesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const medicines = await Medicine.findAll({
      where: { category }
    });

    res.json(medicines);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching medicines by category', error: error.message });
  }
};


exports.updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

    await medicine.update(req.body);
    res.json({ message: 'Medicine updated successfully', medicine });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating medicine', error: error.message });
  }
};


exports.deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) return res.status(404).json({ message: 'Medicine not found' });

    await medicine.destroy();
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting medicine', error: error.message });
  }
};
