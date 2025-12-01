// controllers/userController.js
const User = require('../models/User');

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
