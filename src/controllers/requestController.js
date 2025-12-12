// src/controllers/requestController.js
const { Request, Patient } = require('../models');


exports.createRequest = async (req, res) => {
  try {
    const { patientId, type, itemId, itemName, quantity } = req.body;

    const newRequest = await Request.create({
      patientId,
      type,
      itemId: itemId || null,
      itemName,
      quantity
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create request' });
  }
};


exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.findAll({
      include: [{ model: Patient, as: 'patient' }]
    });
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};


exports.getRequestById = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id, {
      include: [{ model: Patient, as: 'patient' }]
    });

    if (!request) return res.status(404).json({ error: 'Request not found' });

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch request' });
  }
};

exports.getRequestsByStatus = async (req, res) => {
  try {
    const { status } = req.params; 

    const requests = await Request.findAll({
      where: { status },
      include: [{ model: Patient, as: 'patient' }]
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests by status' });
  }
};

exports.getRequestsByType = async (req, res) => {
  try {
    const { type } = req.params; 

    const requests = await Request.findAll({
      where: { type },
      include: [{ model: Patient, as: 'patient' }]
    });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests by type' });
  }
};


exports.updateRequest = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const { type, itemId, itemName, quantity, status } = req.body;

    await request.update({
      type: type || request.type,
      itemId: itemId !== undefined ? itemId : request.itemId,
      itemName: itemName || request.itemName,
      quantity: quantity || request.quantity,
      status: status || request.status,
      lastEdited: new Date()
    });

    res.json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update request' });
  }
};


exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    await request.destroy();
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete request' });
  }
};
