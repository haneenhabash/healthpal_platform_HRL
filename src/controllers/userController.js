const { User, Doctor, Patient, Donor } = require('../models');

exports.getMe = async (req, res) => {
  try {
    const user = req.user;

    let profile = null;

    if (user.role === 'doctor') {
      profile = await Doctor.findOne({ where: { email: user.email } });
    } 
    else if (user.role === 'patient') {
      profile = await Patient.findOne({ where: { email: user.email } });
    } 
    else if (user.role === 'donor') {
      profile = await Donor.findOne({ where: { email: user.email } });
    }

    return res.status(200).json({
      message: "User profile fetched successfully",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      profile: profile || null
    });

  } catch (err) {
    console.error("getMe Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'email', 'role', 'createdAt'],
    });

    const fullData = [];

    for (const u of users) {
      let profile = null;

      if (u.role === 'doctor') {
        profile = await Doctor.findOne({ where: { email: u.email } });
      } 
      else if (u.role === 'patient') {
        profile = await Patient.findOne({ where: { email: u.email } });
      } 
      else if (u.role === 'donor') {
        profile = await Donor.findOne({ where: { email: u.email } });
      }

      fullData.push({
        user: u,
        profile: profile || null
      });
    }

    return res.status(200).json({
      count: fullData.length,
      users: fullData
    });

  } catch (err) {
    console.error("getAllUsers Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
      where: { role: 'admin' },
      attributes: ['id', 'email', 'role', 'createdAt'],
    });

    return res.status(200).json({
      count: admins.length,
      admins
    });

  } catch (err) {
    console.error("getAdmins Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
