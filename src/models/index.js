const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// ===============================================
// 1. Import All Models
// ===============================================

// Users & Profiles
const Patient = require('./Patient');
const Doctor = require('./Doctor');

const Donor = require('./Donor');

// Mental Health & Logs
const MentalAssessment = require('./MentalAssessment');
const Journal = require('./Journal');

// Chat & Communication
const AnonymousChat = require('./AnonymousChat');
const PrivateMessage = require('./PrivateMessage');
const Consultation = require('./Consultation');
const Message = require('./message');
const HealthGuide=require('./HealthGuide');
const PublicAlert = require('./PublicAlert');
const Workshop=require('./Workshop');
const Registration=require('./Registration');
const User = require('./User');

// Community & Groups
const SupportGroup = require('./SupportGroup');
const GroupSession = require('./GroupSession');
const GroupMessage = require('./GroupMessage');

// Financial & Crowdfunding
const TreatmentCase = require('./TreatmentCase');
const Donation = require('./Donation');
const ExpenseRecord = require('./ExpenseRecord');
const Invoice = require('./Invoice');

const Medicine = require('./Medicine');
const Equipment = require('./Equipment');
const Request = require('./Request');
const ItemDonation = require('./ItemDonation');

const NGO = require('./NGO');
const NGOActivity = require('./NGOActivity');
const Availability = require('./Availability');
const Appointment = require('./Appointment');






// Patient <-> Mental Assessments (One-to-Many)
Patient.hasMany(MentalAssessment, { foreignKey: 'patientId', as: 'assessments' });
MentalAssessment.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });

// Patient <-> Journals (One-to-Many)
Patient.hasMany(Journal, { foreignKey: 'patientId', as: 'journals' });
Journal.belongsTo(Patient, { foreignKey: 'patientId', as: 'patient' });


// Doctor <-> Anonymous Chat (One-to-Many)
Doctor.hasMany(AnonymousChat, { foreignKey: 'doctorId' });
AnonymousChat.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Patient <-> Anonymous Chat (One-to-Many)
Patient.hasMany(AnonymousChat, { foreignKey: 'patientId' });
AnonymousChat.belongsTo(Patient, { foreignKey: 'patientId' });

// Chat <-> Private Messages (One-to-Many)
AnonymousChat.hasMany(PrivateMessage, { foreignKey: 'chatId' });
PrivateMessage.belongsTo(AnonymousChat, { foreignKey: 'chatId' });

// ------------------------------------
// C. Support Groups (Community)
// ------------------------------------

// Patient <-> Support Groups (Many-to-Many)
// Creates a junction table named 'GroupMembers'
Patient.belongsToMany(SupportGroup, { through: 'GroupMembers', foreignKey: 'patientId' });
SupportGroup.belongsToMany(Patient, { through: 'GroupMembers', foreignKey: 'groupId' });

// (Optional) Group <-> Group Messages
SupportGroup.hasMany(GroupMessage, { foreignKey: 'groupId' });
GroupMessage.belongsTo(SupportGroup, { foreignKey: 'groupId' });

// ------------------------------------
// D. Financial & Crowdfunding Module
// ------------------------------------

// Patient <-> Treatment Case (One-to-Many)
// A patient can have multiple treatment cases (fundraisers)
Patient.hasMany(TreatmentCase, { foreignKey: 'patientId' });
TreatmentCase.belongsTo(Patient, { foreignKey: 'patientId' });

// Treatment Case <-> Expense Records (One-to-Many)
TreatmentCase.hasMany(ExpenseRecord, { foreignKey: 'treatmentCaseId', as: 'expenses' });
ExpenseRecord.belongsTo(TreatmentCase, { foreignKey: 'treatmentCaseId' });

// Treatment Case <-> Donations (One-to-Many)
TreatmentCase.hasMany(Donation, { foreignKey: 'treatmentCaseId' });
Donation.belongsTo(TreatmentCase, { foreignKey: 'treatmentCaseId' });

// Donor <-> Donations (One-to-Many)
Donor.hasMany(Donation, { foreignKey: 'donorId' });
Donation.belongsTo(Donor, { foreignKey: 'donorId' });

// Donation <-> Invoice (One-to-One)
// Each donation generates one invoice/receipt
Donation.hasOne(Invoice, { foreignKey: 'donationId' });
Invoice.belongsTo(Donation, { foreignKey: 'donationId' });

// Treatment Case <-> Invoice (One-to-Many)
// A case has many invoices generated from its donations
TreatmentCase.hasMany(Invoice, { foreignKey: 'treatmentCaseId' });
Invoice.belongsTo(TreatmentCase, { foreignKey: 'treatmentCaseId' });

// ------------------------------------
// E. Consultations & Appointments
// ------------------------------------

// Doctor <-> Consultation
Doctor.hasMany(Consultation, { foreignKey: 'doctorId' });
Consultation.belongsTo(Doctor, { foreignKey: 'doctorId' });

// Patient <-> Consultation
Patient.hasMany(Consultation, { foreignKey: 'patientId' });
Consultation.belongsTo(Patient, { foreignKey: 'patientId' });


// ===============================================
// 3. Export Models
// ===============================================

console.log('✅ All model associations defined successfully!');

module.exports = {
    sequelize,
    Patient,
    Doctor,
    MentalAssessment,
    Journal,
    AnonymousChat,
    PrivateMessage,
    SupportGroup,
    GroupSession,
    GroupMessage,
    Consultation,
    Donor,
    TreatmentCase,
    Donation,
    Invoice,
    ExpenseRecord,
      Message,
  HealthGuide,
  PublicAlert ,
  Workshop,
  Registration,
   User,
    Medicine,
      Equipment,
      Request,
      ItemDonation,
      Availability,
      Appointment,
      NGO,
      NGOActivity
  
};

