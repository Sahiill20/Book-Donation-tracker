// src/donate/donateController.js
const Donate = require('./donateModel');

// Create a new book donation
const createDonation = async (req, res) => {
  try {
    const { title, condition, category, pickupLocation, donorEmail } = req.body;

    const donation = new Donate({
      title,
      condition,
      category,
      pickupLocation,
      donorEmail,
    });

    await donation.save();
    res.status(201).json({ message: 'Donation posted successfully!', donation });
  } catch (error) {
    res.status(500).json({ message: 'Error creating donation', error });
  }
};

module.exports = {
  createDonation,
};
