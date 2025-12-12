// controllers/ngoActivityController.js
const NGOActivity = require("../models/NGOActivity");
const NGO = require("../models/NGO");
const Patient = require('../models/Patient');      
const sendEmail = require('../utils/sendEmail');  


exports.createActivity = async (req, res) => {
  try {
    const activity = await NGOActivity.create(req.body);

    const patients = await Patient.findAll({
  attributes: ['email']   // ناخذ بس الإيميل
});


    const sendResults = await Promise.all(
      patients.map(async (patient) => {
        try {
          await sendEmail(
            patient.email,
            "New Upcoming Activity",
            `
              <h3>📢 New Activity Added</h3>
              <p><strong>${activity.title}</strong></p>
              <p>${activity.description}</p>
              <p><b>Date:</b> ${activity.startDate}</p>
              <p><b>Location:</b> ${activity.country}, ${activity.city}</p>
              <p><b>Media:</b> <a href="${activity.mediaUrl}">${activity.mediaUrl}</a></p>
            `
          );
          return { email: patient.email, status: 'sent' };
        } catch (err) {
          return { email: patient.email, status: 'failed', error: err.message };
        }
      })
    );

    res.status(201).json({
      message: "Activity created and emails sent.",
      activity,
      emailResults: sendResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating activity", error: error.message });
  }
};



exports.getActivitiesByNGO = async (req, res) => {
  try {
    const { ngoId } = req.params;

    const activities = await NGOActivity.findAll({
      where: { ngoId },
      include: { model: NGO }
    });

    res.json(activities);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateActivityStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['planned', 'in_progress', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const activity = await NGOActivity.findByPk(id);
    if (!activity) return res.status(404).json({ message: "Activity not found" });

    activity.status = status;
    await activity.save();

    res.json({ message: "Activity status updated", activity });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating status" });
  }
};

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await NGOActivity.findAll({
      include: { model: NGO }
    });

    res.json(activities);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
