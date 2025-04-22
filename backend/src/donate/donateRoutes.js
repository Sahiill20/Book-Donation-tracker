const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createDonation, getDonationCount } = require('./donateController');

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

module.exports = router;