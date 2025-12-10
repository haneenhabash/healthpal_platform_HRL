const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS 
  }
});

exports.sendEmail = async (to, subject, text, attachments = []) => {
  try {
    const mailOptions = {
      from: `"HealthPal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
  } catch (err) {
    console.error('Email failed:', err.message);
  }
};
