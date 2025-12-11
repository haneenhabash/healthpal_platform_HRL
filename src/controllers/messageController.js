const { Message, Consultation, Doctor, Patient } = require('../models');
const dns = require('dns').promises;
const Joi = require('joi');

async function checkInternetConnection() {
  try {
    await dns.lookup('google.com');
    return true;
  } catch {
    return false;
  }
}

async function translateOnline(text, fromLang, toLang) {
  try {
    const translatorModule = await import('@vitalets/google-translate-api');
    const translate =
      translatorModule.default?.translate ||
      translatorModule.default ||
      translatorModule;

    const res = await translate(text, {
      from: fromLang.slice(0, 2).toLowerCase(),
      to: toLang.slice(0, 2).toLowerCase()
    });

    return res.text;
  } catch (err) {
    console.error('Google Translate failed:', err.message);
    return null;
  }
}

async function translateOffline(text, fromLang, toLang) {
  return `[${toLang} translation of: ${text}]`;
}

const sendMessageSchema = Joi.object({
  content: Joi.string().min(1).required(),
  senderType: Joi.string().valid('patient', 'doctor').required(),
  ConsultationId: Joi.number().integer().positive().required()
});

const consultationIdSchema = Joi.object({
  consultationId: Joi.number().integer().positive().required()
});

exports.sendMessage = async (req, res) => {
  try {
    const { error, value } = sendMessageSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { content, senderType, ConsultationId } = value;

    const consultation = await Consultation.findByPk(ConsultationId, {
      include: [Doctor, Patient]
    });

    if (!consultation)
      return res.status(404).json({ message: 'Consultation not found' });

    if (consultation.type !== 'message')
      return res
        .status(400)
        .json({ message: 'This consultation is not a messaging type' });

    const doctorLang = consultation.Doctor.language || 'Arabic';
    const patientLang = consultation.Patient.language || 'Arabic';

    let translatedContent = null;
    const hasInternet = await checkInternetConnection();

    if (senderType === 'patient' && doctorLang !== patientLang) {
      translatedContent = hasInternet
        ? await translateOnline(content, patientLang, doctorLang)
        : await translateOffline(content, patientLang, doctorLang);
    } else if (senderType === 'doctor' && doctorLang !== patientLang) {
      translatedContent = hasInternet
        ? await translateOnline(content, doctorLang, patientLang)
        : await translateOffline(content, doctorLang, patientLang);
    }

    const message = await Message.create({
      content,
      translatedContent,
      senderType,
      ConsultationId
    });

    console.log(
      hasInternet
        ? 'Online translation used (Google Translate)'
        : 'Offline translation used (no internet)'
    );

    res.status(201).json({
      message: 'Message sent successfully',
      data: message,
      mode: hasInternet ? 'online translation' : 'offline fallback'
    });
  } catch (error) {
    console.error('Error in sendMessage:', error.message);
    res
      .status(500)
      .json({ message: 'Error sending message', error: error.message });
  }
};

exports.getMessagesByConsultation = async (req, res) => {
  try {
    const { error, value } = consultationIdSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const messages = await Message.findAll({
      where: { ConsultationId: value.consultationId },
      order: [['timestamp', 'ASC']]
    });
    res.json(messages);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching messages', error: error.message });
  }
};
