// controllers/userController.js
const { User } = require('../models'); 

exports.getMe = async (req, res) => {
  const user = req.user;

  res.status(200).json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ['id', 'email', 'role', 'createdAt'],
  });

  res.status(200).json({
    count: users.length,
    users,
  });
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.findAll({
    where: { role: 'admin' },
    attributes: ['id', 'email', 'role', 'createdAt'],
    });

    res.status(200).json({
      count: admins.length,
      admins,
    });
  } catch (err) {
    console.error('Error in getAdmins:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
