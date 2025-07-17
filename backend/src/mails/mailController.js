const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your Gmail
    pass: process.env.EMAIL_PASS 
  },
});

const sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: '"Book Donation Platform" <yourgmail@gmail.com>',
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

module.exports = sendEmail;
