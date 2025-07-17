const express = require('express');
const sendEmail = require('./mailController'); // correct path
const router = express.Router();

router.get('/test-email', async (req, res) => {
  await sendEmail({
    to: 'recipient@gmail.com',
    subject: 'Test Email 📬',
    text: 'This is a plain text message.',
    html: '<h1>Hello!</h1><p>This is a <b>test</b> email from your Book Donation app.</p>',
  });

  res.send('Test email sent!');
});

module.exports = router;
