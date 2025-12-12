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
    const requests = await Request.findAll();

    const results = await Promise.all(
      requests.map(async (r) => {
        let patient = null;
        try {
          patient = await Patient.findByPk(r.patientId);
        } catch (err) {
          console.warn(`Patient not found for requestId ${r.id}`);
        }
        return { ...r.dataValues, patient };
      })
    );
    //const requests = await Request.findAll({
      //include: [{ model: Patient, as: 'patient' }]
    //});
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
};


exports.getRequestById = async (req, res) => {
  try {
   const request = await Request.findByPk(req.params.id);
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

    const requests = await Request.findAll({ where: { status } });

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch requests by status' });
  }
};

exports.getRequestsByType = async (req, res) => {
  try {
    const { type } = req.params; 

    const requests = await Request.findAll({ where: { type } });

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
       type: type !== undefined ? type : request.type,
  itemId: itemId !== undefined ? itemId : request.itemId,
  itemName: itemName !== undefined ? itemName : request.itemName,
  quantity: quantity !== undefined ? quantity : request.quantity,
  status: status !== undefined ? status : request.status,
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
