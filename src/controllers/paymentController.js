require('dotenv').config();

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const sequelize = require('../config/db');
const PDFDocument = require('pdfkit');

const { Donation, TreatmentCase } = require('../models');

exports.createCheckoutSession = async (req, res) => {
    try {
        const { treatmentCaseId, donorId, amount } = req.body;

        const treatmentCase = await TreatmentCase.findByPk(treatmentCaseId);
        if (!treatmentCase) return res.status(404).json({ error: 'Case not found' });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Donation for: ${treatmentCase.title}`,
                        description: 'Medical Treatment Donation',
                    },
                    unit_amount: Math.round(amount * 100), // المبلغ بالسنت
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `http://localhost:3000/api/payments/success?session_id={CHECKOUT_SESSION_ID}&caseId=${treatmentCaseId}&donorId=${donorId}&amount=${amount}`,
            cancel_url: `http://localhost:3000/api/payments/cancel`,
        });

        res.json({
            message: "Click the link below to pay",
            paymentUrl: session.url
        });

    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.handlePaymentSuccess = async (req, res) => {

    const t = await sequelize.transaction();

    try {
        const { session_id, caseId, donorId, amount } = req.query;


        if (!session_id || !caseId) {
            await t.rollback();
            return res.status(400).send('Invalid Request: Missing parameters');
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (session.payment_status !== 'paid') {
            await t.rollback();
            return res.status(400).send('Payment not paid yet');
        }


        const donation = await Donation.create({
            donorId: donorId,
            treatmentCaseId: caseId,
            amount: amount,
            transactionId: session.payment_intent,
            status: 'completed'
        }, { transaction: t });

        const treatmentCase = await TreatmentCase.findByPk(caseId, { transaction: t });

        if (!treatmentCase) {
            await t.rollback();
            return res.status(404).send('Treatment case not found');
        }

        const currentRaised = parseFloat(treatmentCase.amountRaised) || 0;
        const donationAmount = parseFloat(amount);
        const newRaised = currentRaised + donationAmount;

        await treatmentCase.update({
            amountRaised: newRaised,
            amountNeeded: treatmentCase.totalCost - newRaised
        }, { transaction: t });

        await t.commit();


        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4',
            margin: 50
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=receipt-${donation.id}.pdf`);

        doc.pipe(res);

        const primaryColor = '#2C3E50';
        const accentColor = '#27AE60';

        const borderWidth = 20;
        doc.rect(borderWidth, borderWidth, doc.page.width - (borderWidth * 2), doc.page.height - (borderWidth * 2))
            .strokeColor(primaryColor)
            .lineWidth(3)
            .stroke();

        doc.rect(borderWidth + 5, borderWidth + 5, doc.page.width - (borderWidth * 2) - 10, doc.page.height - (borderWidth * 2) - 10)
            .strokeColor(accentColor)
            .lineWidth(1)
            .stroke();

        doc.moveDown(1);
        doc.font('Helvetica-Bold').fontSize(30).fillColor(primaryColor)
            .text('HealthPal Platform', { align: 'center' });

        doc.font('Helvetica').fontSize(15).fillColor(accentColor)
            .text('Medical Donation Receipt', { align: 'center' });

        doc.moveDown(1);

        const lineY = doc.y;
        doc.moveTo(100, lineY).lineTo(doc.page.width - 100, lineY).strokeColor('#cccccc').lineWidth(1).stroke();

        doc.moveDown(2);

        const contentStartX = 150;
        const valueStartX = 400;
        const startY = doc.y;
        const lineHeight = 30;

        doc.fontSize(14).fillColor('black');

        doc.font('Helvetica-Bold').text('Receipt Number:', contentStartX, startY);
        doc.font('Helvetica').text(`#${donation.id}`, valueStartX, startY);

        doc.font('Helvetica-Bold').text('Date:', contentStartX, startY + lineHeight);
        const today = new Date().toLocaleDateString('en-US');
        doc.font('Helvetica').text(today, valueStartX, startY + lineHeight);

        doc.font('Helvetica-Bold').text('Transaction ID:', contentStartX, startY + (lineHeight * 2));
        doc.font('Helvetica').fontSize(10).text(session.payment_intent, valueStartX, startY + (lineHeight * 2) + 3);

        doc.fontSize(16).fillColor(primaryColor);
        doc.font('Helvetica-Bold').text('Donation Amount:', contentStartX, startY + (lineHeight * 3.5));
        doc.fontSize(18).fillColor(accentColor).text(`$${amount} USD`, valueStartX, startY + (lineHeight * 3.5));

        doc.fontSize(14).fillColor('black');
        doc.font('Helvetica-Bold').text('Donated To:', contentStartX, startY + (lineHeight * 5));
        doc.font('Helvetica').text(treatmentCase.title || 'Medical Case', valueStartX, startY + (lineHeight * 5));

        const footerY = doc.page.height - 130;
        doc.fontSize(16).font('Helvetica-Oblique').fillColor(primaryColor)
            .text('"Thank you for making a difference!"', { align: 'center', at: footerY });

        const signatureX = doc.page.width - 250;
        const signatureY = doc.page.height - 80;
        doc.moveTo(signatureX, signatureY).lineTo(signatureX + 150, signatureY).strokeColor('black').lineWidth(1).stroke();
        doc.fontSize(10).fillColor('black').text('Eng.HaneenHabash ', signatureX + 30, signatureY + 5);

        doc.save();
        doc.rotate(-45, { origin: [doc.page.width / 2, doc.page.height / 2] });
        doc.fontSize(60).fillColor('grey').opacity(0.1)
            .text('PAID', doc.page.width / 2 - 100, doc.page.height / 2);
        doc.restore();

        doc.end();

    } catch (error) {
        console.error("Payment Process Error:", error);

        if (!t.finished) {
            await t.rollback();
        }

        if (!res.headersSent) {
            res.status(500).send('Error processing payment or generating receipt: ' + error.message);
        }
    }
};