const { Request } = require('../models');

exports.getMatchedRequests = async (req, res) => {
  try {
    const matchedRequests = await Request.findAll({
      where: { status: 'matched' }
    });
    res.json(matchedRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch matched requests' });
  }
};


exports.markRequestDelivered = async (req, res) => {
  try {
    const request = await Request.findByPk(req.params.id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    console.log('Request before update:', request.toJSON()); 

    if (request.status !== 'matched') {
      return res.status(400).json({ error: 'Only matched requests can be delivered' });
    }

    await request.update({ status: 'delivered', lastEdited: new Date() });

    console.log('Request after update:', request.toJSON()); 

    res.json({ message: 'Request marked as delivered', request });
  } catch (err) {
    console.error('Error details:', err);  
    res.status(500).json({ error: 'Failed to update request' });
  }
};

