const cron = require('node-cron');
const { Op } = require('sequelize');
const Patient = require('../models/Patient');
const NGOActivity = require('../models/NGOActivity');
const sendEmail = require('../utils/sendEmail');

cron.schedule("0 8 * * *", async () => {
  try {
    console.log("⏳ Checking for activities happening tomorrow...");

    const now = new Date();

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(tomorrow.getDate() + 1);
    dayAfterTomorrow.setHours(0, 0, 0, 0);

    const activities = await NGOActivity.findAll({
      where: {
        status: "planned",
        startDate: {
          [Op.gte]: tomorrow,
          [Op.lt]: dayAfterTomorrow
        }
      }
    });

    if (activities.length === 0) {
      console.log("No activities for tomorrow.");
      return;
    }

    const patients = await Patient.findAll();

    for (const activity of activities) {
      await Promise.all(
        patients.map(patient =>
          sendEmail(
            patient.email,
            "⏰ Reminder: Activity Tomorrow",
            `
              <h3>📢 Reminder: Upcoming Activity</h3>
              <p><strong>${activity.title}</strong></p>
              <p>${activity.description}</p>
              <p><b>Date:</b> ${activity.startDate.toDateString()}</p>
              <p><b>Location:</b> ${activity.country}, ${activity.city}</p>
              <p><b>Media:</b> <a href="${activity.mediaUrl}">${activity.mediaUrl}</a></p>
            `
          )
        )
      );

      console.log(`Reminder emails sent for activity ID: ${activity.id}`);
    }

  } catch (error) {
    console.error("Error in activityNotifier cron job:", error);
  }
});

