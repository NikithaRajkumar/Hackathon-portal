const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

const sendMail = (to, subject, html) => {
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_email@gmail.com') return;
    transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html }).catch(console.error);
};

exports.sendWelcome = (email, name) =>
    sendMail(email, 'Welcome to Hackathon Platform!', `<h2>Hi ${name}!</h2><p>Your account has been created successfully.</p>`);

exports.sendSubmissionConfirm = (email, title) =>
    sendMail(email, 'Submission Received', `<h2>Submission Confirmed</h2><p>Your project "<strong>${title}</strong>" has been submitted successfully.</p>`);

exports.sendEvaluationResult = (email, title, score) =>
    sendMail(email, 'Your Submission Has Been Evaluated', `<h2>Evaluation Result</h2><p>Your project "<strong>${title}</strong>" received a score of <strong>${score}/100</strong>.</p>`);
