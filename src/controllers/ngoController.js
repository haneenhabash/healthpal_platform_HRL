// controllers/ngoAuthController.js
const bcrypt = require('bcryptjs');
const sequelize = require('../config/db');
const Donor = require('../models/Donor');
const NGO = require('../models/NGO');

exports.registerNGO = async (req, res) => {
  const {
   // Donor
    name,
    email,
    password,
    phone,
    address,

    //  NGO
    ngoName,
    registrationNumber,
    website,
    country,
    city,
    documentsUrl
  } = req.body;

  const t = await sequelize.transaction();

  try {
  
    const existing = await Donor.findOne({ where: { email }, transaction: t });
    if (existing) {
      await t.rollback();
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const donor = await Donor.create({
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      donorType: 'ngo'
    }, { transaction: t });

    const ngo = await NGO.create({
      donorId: donor.id,
      ngoName: ngoName || name,
      registrationNumber,
      website,
      country,
      city,
      documentsUrl,
    }, { transaction: t });

    await t.commit();

    res.status(201).json({
      message: 'NGO registered successfully (pending verification)',
      donor: {
        id: donor.id,
        name: donor.name,
        email: donor.email,
        donorType: donor.donorType
      },
      ngo: {
        id: ngo.id,
        donorId: ngo.donorId,
        ngoName: ngo.ngoName,
        verificationStatus: ngo.verificationStatus,
        isVerified: ngo.isVerified
      }
    });
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).json({ message: 'Error registering NGO', error: error.message });
  }
};


exports.getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.findAll({
      include: {
        model: Donor,
        attributes: ["id", "firstName", "lastName", "email", "phone"]
      }
    });

    res.status(200).json(ngos);
  } catch (error) {
    console.error("Error fetching NGOs:", error);
    res.status(500).json({ message: "Server error while retrieving NGOs" });
  }
};

exports.verifyNgo = async (req, res) => {
  try {
    const { id } = req.params;     
    const { status, notes } = req.body; 

  
    const allowedStatuses = ['approved', 'rejected', 'pending'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

   
    const ngo = await NGO.findByPk(id, {
      include: {
        model: Donor,
        attributes: ['id', 'name', 'email']
      }
    });

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    ngo.verificationStatus = status;
    ngo.isVerified = (status === 'approved');   
    if (notes !== undefined) {
      ngo.verificationNotes = notes;
    }

    await ngo.save();

    return res.json({
      message: `NGO verification status updated to ${status}`,
      ngo
    });
  } catch (error) {
    console.error('Error verifying NGO:', error);
    return res.status(500).json({
      message: 'Error verifying NGO',
      error: error.message
    });
  }
};

exports.getNgoById = async (req, res) => {
  try {
    const { id } = req.params;

    const ngo = await NGO.findByPk(id, {
      include: {
        model: Donor,
        attributes: ['id', 'name', 'email', 'phone']
      }
    });

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    return res.json(ngo);

  } catch (error) {
    console.error('Error fetching NGO by ID:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// 2) Get NGO by Name
exports.getNgoByName = async (req, res) => {
  try {
    const { name } = req.params;

    const ngo = await NGO.findOne({
      where: { ngoName: name },
      include: {
        model: Donor,
        attributes: ['id', 'name', 'email', 'phone']
      }
    });

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found by that name' });
    }

    return res.json(ngo);

  } catch (error) {
    console.error('Error fetching NGO by name:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};



// 3) Get NGOs by Verification Status
exports.getNgoByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const allowedStatuses = ['approved', 'pending', 'rejected'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const ngos = await NGO.findAll({
      where: { verificationStatus: status },
      include: {
        model: Donor,
        attributes: ['id', 'name', 'email', 'phone']
      }
    });

    return res.json(ngos);

  } catch (error) {
    console.error('Error fetching NGOs by status:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};