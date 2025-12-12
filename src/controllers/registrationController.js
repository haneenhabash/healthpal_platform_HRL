const { Workshop, Registration, Patient } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const registerSchema = Joi.object({
  WorkshopId: Joi.number().integer().positive().required(),
  PatientId: Joi.number().integer().positive().allow(null),
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(6).max(30).required()
});

const updateRegistrationSchema = Joi.object({
  WorkshopId: Joi.number().integer().positive(),
  PatientId: Joi.number().integer().positive().allow(null),
  name: Joi.string().min(3).max(255),
  email: Joi.string().email(),
  phone: Joi.string().min(6).max(30),
  attendance: Joi.boolean(),
  rating: Joi.number().integer().min(1).max(5),
  feedback: Joi.string().max(1000)
}).min(1);

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

exports.registerForWorkshop = async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { WorkshopId, PatientId, name, email, phone } = value;

    const workshop = await Workshop.findByPk(WorkshopId);
    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
    }

    const currentCount = await Registration.count({ where: { WorkshopId } });
    if (currentCount >= workshop.maxParticipants) {
      return res.status(400).json({ message: 'Workshop is full' });
    }

    const alreadyRegistered = await Registration.findOne({
      where: { WorkshopId, email }
    });
    if (alreadyRegistered) {
      return res
        .status(400)
        .json({ message: 'You are already registered for this workshop' });
    }

    const registration = await Registration.create({
      WorkshopId,
      PatientId: PatientId || null,
      name,
      email,
      phone
    });

    return res
      .status(201)
      .json({ message: 'Registered successfully', registration });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((e) => e.message)
      });
    }

    console.error('Error registering:', error.message);
    return res
      .status(500)
      .json({ message: 'Error registering', error: error.message });
  }
};

exports.updateRegistration = async (req, res) => {
  try {
    const { error: idError, value: idValue } = idSchema.validate(req.params);
    if (idError) {
      return res.status(400).json({ message: idError.details[0].message });
    }

    const { error, value } = updateRegistrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const registration = await Registration.findByPk(idValue.id, {
      include: [Workshop]
    });

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    await registration.update(value);

    if (value.attendance === true) {
      const workshop = registration.Workshop;

      // ✅ نخزن الشهادات في src/certificates (نطلع من controllers لمجلد src ثم certificates)
      const certDir = path.join(__dirname, '..', 'certificates');
      if (!fs.existsSync(certDir)) fs.mkdirSync(certDir, { recursive: true });

      const certPath = path.join(
        certDir,
        `certificate_${registration.id}_${registration.name.replace(/\s+/g, '_')}.pdf`
      );

      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const stream = fs.createWriteStream(certPath);
      doc.pipe(stream);

      doc.rect(25, 25, 545, 792).stroke('#6AB7FF');
      doc.font('Helvetica-Bold').fillColor('#2B4C7E');
      doc.moveDown(4);
      doc
        .fontSize(26)
        .fillColor('#0D47A1')
        .text('Certificate of Attendance', { align: 'center' });
      doc.moveDown(2);
      doc
        .fontSize(16)
        .fillColor('#000')
        .text('This is to certify that', { align: 'center' });
      doc.moveDown(1.5);
      doc
        .fontSize(22)
        .fillColor('#1565C0')
        .text(`${registration.name}`, { align: 'center' });
      doc.moveDown(1.5);
      doc
        .fontSize(15)
        .fillColor('#333')
        .text(
          `has successfully attended the workshop "${workshop.title}"`,
          { align: 'center' }
        )
        .moveDown(0.5)
        .text(`conducted by ${workshop.speaker}`, { align: 'center' });
      doc.moveDown(2);
      doc
        .fontSize(12)
        .fillColor('#444')
        .text(`Date: ${new Date(workshop.date).toDateString()}`, {
          align: 'center'
        });

      const certId = `HP-${String(workshop.id).padStart(3, '0')}-${String(
        registration.id
      ).padStart(4, '0')}`;
      doc.moveDown(1);
      doc
        .fontSize(11)
        .fillColor('#777')
        .text(`Certificate ID: ${certId}`, { align: 'center' });

      doc.moveDown(5);
      doc
        .fontSize(12)
        .fillColor('#2B4C7E')
        .text('_____________________________', { align: 'center' });
      doc.text('HealthPal Team', { align: 'center' });
      doc.end();

      // ✅ URL للمتصفح (ما في ../)
      registration.certificateUrl = `/certificates/${path.basename(certPath)}`;
      await registration.save();

      const { sendEmail } = require('../utils/emailService');
      await sendEmail(
        registration.email,
        'Your HealthPal Workshop Certificate 🎓',
        `Hi ${registration.name},\n\nHere is your certificate for attending "${workshop.title}".\n\nBest regards,\nHealthPal Team`,
        [
          {
            filename: path.basename(certPath),
            path: certPath
          }
        ]
      );
    }

    return res.json({ message: 'Registration updated', registration });
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors.map((e) => e.message)
      });
    }

    console.error('Error updating registration:', error.message);
    return res.status(500).json({
      message: 'Error updating registration',
      error: error.message
    });
  }
};
