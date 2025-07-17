const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createDonation, getDonationCount, getDonationDates } = require('./donateController');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post('/donate', upload.single('image'), createDonation);
router.get('/count', getDonationCount);
router.get('/donation-dates', getDonationDates);


module.exports = router;