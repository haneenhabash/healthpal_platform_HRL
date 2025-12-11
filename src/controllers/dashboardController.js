// src/controllers/dashboardController.js

const { Op } = require('sequelize');
const sequelize = require('../config/db');
const {
  User,
  Patient,
  Doctor,
  Consultation,
  HealthGuide,
  PublicAlert,
  Workshop
} = require('../models');

exports.getUserDashboard = async (req, res) => {
  try {
    return res.status(200).json({
      dashboard: {
        links: {
          profile: "/api/users/me",
          consultations: "/api/consultations",
          workshops: "/api/workshops",
          healthGuides: "/api/education/guides",
          alerts: "/api/alerts",
          environmentWeather: "/api/environment/weather-alert",
          environmentAirQuality: "/api/environment/air-quality",
          messagesByConsultation: "/api/messages/{consultationId}"
        }
      }
    });
  } catch (error) {
    console.error('User Dashboard Error:', error);
    res.status(500).json({
      message: 'Error building user dashboard links',
      error: error.message
    });
  }
};


exports.getAdminDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      totalConsultations,
      totalWorkshops,
      totalHealthGuides,
      totalPublicAlerts
    ] = await Promise.all([
      User.count(),
      Patient.count(),
      Doctor.count(),
      Consultation.count(),
      Workshop.count(),
      HealthGuide.count(),
      PublicAlert.count()
    ]);

    return res.status(200).json({
      dashboard: {
        links: {
          adminProfile: "/api/users/me",           
          adminsList: "/api/users/admins",          
          users: "/api/users",
          patients: "/api/patients",
          doctors: "/api/doctors",
          consultations: "/api/consultations",
          workshops: "/api/workshops",
          healthGuides: "/api/education/guides",
          publicAlerts: "/api/alerts",
          statistics: "/api/admin/statistics" ,   
        messages: "/api/messages",               
         environmentWeather: "/api/environment/weather-alert",
          environmentAirQuality: "/api/environment/air-quality"      
        },
        stats: {
          totalUsers,
          totalPatients,
          totalDoctors,
          totalConsultations,
          totalWorkshops,
          totalHealthGuides,
          totalPublicAlerts
        }
      }
    });
  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({
      message: 'Error building admin dashboard',
      error: error.message
    });
  }
};

/**
 * Admin Statistics: إحصائيات سيستم تفصيلية
 * GET /api/admin/statistics
 */
exports.getAdminStatistics = async (req, res) => {
  try {
    const now = new Date();

    const [
      totalUsers,
      totalPatients,
      totalDoctors,
      totalConsultations,
      totalWorkshops,
      totalHealthGuides,
      totalPublicAlerts,
      consultationsByStatusRaw,
      upcomingWorkshops,
      latestUsers,
      latestConsultations,
      activeAlerts
    ] = await Promise.all([
      User.count(),
      Patient.count(),
      Doctor.count(),
      Consultation.count(),
      Workshop.count(),
      HealthGuide.count(),
      PublicAlert.count(),

      // group by status
      Consultation.findAll({
        attributes: [
          'status',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['status']
      }),

      Workshop.findAll({
        where: { date: { [Op.gte]: now } },
        order: [['date', 'ASC']],
        limit: 5
      }),

      User.findAll({
        attributes: ['id', 'email', 'role', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 5
      }),

      Consultation.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [Patient, Doctor]
      }),

      PublicAlert.findAll({
        where: { status: 'active' },
        order: [['severity', 'DESC'], ['createdAt', 'DESC']],
        limit: 5
      })
    ]);

    const consultationsByStatus = {};
    consultationsByStatusRaw.forEach((row) => {
      const status = row.status;
      const count = Number(row.get('count'));
      consultationsByStatus[status] = count;
    });

    return res.status(200).json({
      totals: {
        users: totalUsers,
        patients: totalPatients,
        doctors: totalDoctors,
        consultations: totalConsultations,
        workshops: totalWorkshops,
        healthGuides: totalHealthGuides,
        publicAlerts: totalPublicAlerts
      },
      consultationsByStatus,
      upcomingWorkshops,
      latestUsers,
      latestConsultations,
      activeAlerts
    });
  } catch (error) {
    console.error('Admin Statistics Error:', error);
    res.status(500).json({
      message: 'Error fetching admin statistics',
      error: error.message
    });
  }
};
