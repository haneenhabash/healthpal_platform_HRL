// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

  // شوف الهيدر كيف واصل
    console.log('AUTH HEADERS:', req.headers);
    console.log('AUTH HEADER AUTHORIZATION:', req.headers.authorization);





    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, token is missing',
      });
    }

    // 2) نتحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3) نجيب اليوزر من الداتابيس
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: 'User belonging to this token no longer exists',
      });
    }

    // 4) نخزّنه في req.user عشان نستخدمه بعدين
    req.user = user;
    next();
  } catch (err) {
    console.error('Protect middleware error:', err);
    return res.status(401).json({
      message: 'Not authorized, invalid or expired token',
    });
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // لازم يكون protect اشتغل قبلها، عشان req.user يكون موجود
    if (!req.user) {
      return res.status(401).json({
        message: 'Not authorized, user not found in request',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'You do not have permission to perform this action',
      });
    }

    next();
  };
};
