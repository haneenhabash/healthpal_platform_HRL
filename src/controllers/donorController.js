// src/controllers/donorController.js
const { Donor } = require('../models');

// 1. Create Donor (Registration)
exports.createDonor = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Check if email exists
        const existingDonor = await Donor.findOne({ where: { email } });
        if (existingDonor) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const donor = await Donor.create({ name, email, password, phone, address });

        res.status(201).json({
            success: true,
            message: 'Donor created successfully!',
            donor: { id: donor.id, name: donor.name, email: donor.email }
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 2. Get All Donors (For Admin Dashboard)
exports.getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.findAll({
            attributes: { exclude: ['password'] } // Hide passwords
        });
        res.json(donors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get Single Donor Profile
exports.getDonorById = async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!donor) return res.status(404).json({ error: 'Donor not found' });
        res.json(donor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update Donor Profile (For Donor or Admin)
exports.updateDonor = async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const donor = await Donor.findByPk(req.params.id);

        if (!donor) return res.status(404).json({ error: 'Donor not found' });

        // Update fields
        donor.name = name || donor.name;
        donor.phone = phone || donor.phone;
        donor.address = address || donor.address;

        await donor.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            donor: { id: donor.id, name: donor.name, phone: donor.phone }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Delete Donor (Admin control)
exports.deleteDonor = async (req, res) => {
    try {
        const donor = await Donor.findByPk(req.params.id);
        if (!donor) return res.status(404).json({ error: 'Donor not found' });

        await donor.destroy(); // Hard delete (or use soft delete if configured)

        res.json({ success: true, message: 'Donor account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};