// src/controllers/donorController.js
const { Donor } = require('../models');

exports.createDonor = async (req, res) => {
    try {
        const { name, email, password, phone, address, donorType } = req.body;


        const donor = await Donor.create({
            name,
            email,
            password,
            phone,
            address,
            donorType
        });

        res.status(201).json({
            success: true,
            message: 'Donor created successfully!',
            donor: {
                id: donor.id,
                name: donor.name,
                email: donor.email,
                phone: donor.phone,
                donorType: donor.donorType
            }
        });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};