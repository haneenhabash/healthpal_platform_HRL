const { ItemDonation } = require('../models');
const { Medicine, Equipment, Request } = require('../models');

exports.createDonation = async (req, res) => {
  try {
    const { donorId, itemType, itemId, itemName, quantity, donationType, requestId } = req.body;

    const newDonation = await ItemDonation.create({
      donorId,
      itemType,
      itemId: itemId || null,
      itemName,
      quantity,
      donationType,
      requestId: requestId || null
    });

    if (itemType === 'medicine') {
      if (itemId) {
        const med = await Medicine.findByPk(itemId);
        if (med) await med.update({ quantity: med.quantity + quantity });
      } else {
        await Medicine.create({
          name: itemName,
          quantity,
          expiryDate: null,
          category: null
        });
      }
    } else if (itemType === 'equipment') {
      if (itemId) {
        const equip = await Equipment.findByPk(itemId);
        if (equip) await equip.update({ quantity: equip.quantity + quantity });
      } else {
        await Equipment.create({
          name: itemName,
          quantity
        });
      }
    }

    if (requestId) {
      const request = await Request.findByPk(requestId);
      if (request) await request.update({ status: 'matched', lastEdited: new Date() });
    }

    res.status(201).json({ message: 'Donation created successfully', donation: newDonation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating donation', error: err.message });
  }
};

exports.getAllDonations = async (req, res) => {
  try {
    const donations = await ItemDonation.findAll();
    res.json(donations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donations', error: error.message });
  }
};

exports.getDonationById = async (req, res) => {
  try {
    const donation = await ItemDonation.findByPk(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });
    res.json(donation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching donation', error: error.message });
  }
};

exports.getDonationsByFilters = async (req, res) => {
  const { donorId, itemType, itemId, itemName, donationType, requestId } = req.query;
  try {
    const whereClause = {};

     console.log('FILTER ROUTE CALLED');
  console.log('Query params:', req.query); 
    if (donorId) whereClause.donorId = donorId;
    if (itemType) whereClause.itemType = itemType;
    if (itemId) whereClause.itemId = itemId;
    if (itemName) whereClause.itemName = itemName;
    if (donationType) whereClause.donationType = donationType;
    if (requestId) whereClause.requestId = requestId;

    console.log('Where clause:', whereClause);

    const donations = await ItemDonation.findAll({ where: whereClause });
    res.json(donations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch donations' });
  }
};

exports.updateDonation = async (req, res) => {
  try {
    const donation = await ItemDonation.findByPk(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    const { donorId, itemType, itemId, itemName, quantity, donationType, requestId } = req.body;

    await donation.update({
      donorId: donorId || donation.donorId,
      itemType: itemType || donation.itemType,
      itemId: itemId !== undefined ? itemId : donation.itemId,
      itemName: itemName || donation.itemName,
      quantity: quantity || donation.quantity,
      donationType: donationType || donation.donationType,
      requestId: requestId !== undefined ? requestId : donation.requestId
    });

    res.json({ message: 'Donation updated successfully', donation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating donation', error: err.message });
  }
};

exports.deleteDonation = async (req, res) => {
  try {
    const donation = await ItemDonation.findByPk(req.params.id);
    if (!donation) return res.status(404).json({ message: 'Donation not found' });

    await donation.destroy();
    res.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting donation', error: error.message });
  }
};
