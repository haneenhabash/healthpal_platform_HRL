
const Patient = require('./Patient');
const Donor = require('./Donor');
const TreatmentCase = require('./TreatmentCase');
const Donation = require('./Donation');
const Invoice = require('./Invoice');


Patient.hasMany(TreatmentCase, { foreignKey: 'patientId' });
TreatmentCase.belongsTo(Patient, { foreignKey: 'patientId' });

Donor.hasMany(Donation, { foreignKey: 'donorId' });
Donation.belongsTo(Donor, { foreignKey: 'donorId' });

TreatmentCase.hasMany(Donation, { foreignKey: 'treatmentCaseId' });
Donation.belongsTo(TreatmentCase, { foreignKey: 'treatmentCaseId' });

Donation.hasOne(Invoice, { foreignKey: 'donationId' });
Invoice.belongsTo(Donation, { foreignKey: 'donationId' });

TreatmentCase.hasMany(Invoice, { foreignKey: 'treatmentCaseId' });
Invoice.belongsTo(TreatmentCase, { foreignKey: 'treatmentCaseId' });

console.log('✅ All associations defined successfully!');

module.exports = {
    Patient,
    Donor,
    TreatmentCase,
    Donation,
    Invoice
};