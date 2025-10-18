const express = require('express');
const router = express.Router();
const { Patient } = require('../models');

router.get('/', async (req, res) => {
  const patients = await Patient.findAll();
  res.json(patients);
});

module.exports = router;
