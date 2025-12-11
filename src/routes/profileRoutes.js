const express = require('express');
const router = express.Router();
const { User, Doctor, Patient, Donor } = require('../models');
const { protect } = require('../middlewares/authMiddleware');

/**
 * COMPLETE PROFILE for doctor, patient, donor
 * الربط يتم بالإيميل فقط وليس userId
 */
router.post('/complete-profile', protect, async (req, res) => {
  try {
    const user = req.user; // from token
    const data = req.body;

    if (!user || !user.role || !user.email) {
      return res.status(400).json({ message: "User data missing in token" });
    }

    let profile;

    // ============================
    // 📌 Doctor Profile
    // ============================
    if (user.role === 'doctor') {

      profile = await Doctor.create({
        name: data.name,
        specialty: data.specialty,
        locationType: data.locationType,
        email: user.email,
        phone: data.phone,
        language: data.language,
        experienceYears: data.experienceYears
      });
    }

    // ============================
    // 📌 Patient Profile
    // ============================
    else if (user.role === 'patient') {

      profile = await Patient.create({
        name: data.name,
        age: data.age,
        gender: data.gender,
        email: user.email,
        phone: data.phone,
        medicalHistory: data.medicalHistory,
        language: data.language,
        nickname: data.nickname,
        isAnonymousMode: data.isAnonymousMode ?? false
      });
    }

    // ============================
    // 📌 Donor Profile  
    // ============================
    else if (user.role === 'donor') {

      profile = await Donor.create({
        name: data.name,
        email: user.email,
        password: user.passwordHash, // نستخدم نفس باسورد الحساب
        phone: data.phone,
        address: data.address,
        donorType: data.donorType ?? "private donor",
        isActive: data.isActive ?? true
      });
    }

    // ============================
    // No profile for admin
    // ============================
    else {
      return res.status(400).json({
        message: "Admins do not have profiles"
      });
    }

    return res.status(201).json({
      message: "Profile created successfully",
      profile
    });

  } catch (error) {
    console.error("Profile Error:", error);
    return res.status(500).json({
      message: "Server error while creating profile",
      error: error.message
    });
  }
});

module.exports = router;
