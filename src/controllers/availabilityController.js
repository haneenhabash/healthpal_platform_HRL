const { Availability, Doctor } = require('../models'); 

exports.addAvailability = async (req, res) => {
    const { doctorId, startTime, endTime, locationType } = req.body;

    try {
        const availability = await Availability.create({
            doctorId,
            startTime,
            endTime,
            locationType,
            status: 'available', 
        });

        res.status(201).json({ message: 'Availability created successfully', availability });
    } catch (error) {
        res.status(500).json({ message: 'Error creating availability', error: error.message });
    }
};

exports.getAllAvailabilities = async (req, res) => {
    try {
        const availabilities = await Availability.findAll({
            include: Doctor, 
        });

        res.status(200).json(availabilities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availabilities', error: error.message });
    }
};

exports.getAvailabilityById = async (req, res) => {
    const { id } = req.params;

    try {
        const availability = await Availability.findOne({
            where: { id },
            include: Doctor, 
        });

        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }

        res.status(200).json(availability);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availability by ID', error: error.message });
    }
};

exports.getAvailabilitiesByCriteria = async (req, res) => {
    const { doctorId, locationType, startTime, endTime } = req.query;

    const filters = {};

    if (doctorId) filters.doctorId = doctorId;
    if (locationType) filters.locationType = locationType;
    if (startTime && endTime) {
        filters.startTime = { [Op.gte]: new Date(startTime) };
        filters.endTime = { [Op.lte]: new Date(endTime) };
    }

    try {
        const availabilities = await Availability.findAll({
            where: filters,
            include: Doctor,
        });

        res.status(200).json(availabilities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching availabilities by criteria', error: error.message });
    }
};
