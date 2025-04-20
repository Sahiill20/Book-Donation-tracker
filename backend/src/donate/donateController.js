const Donate = require('./donateModel');

// Create a new book donation (for multipart/form-data)
const createDonation = async (req, res) => {
  try {
    // Validate required fields
    if (!req.file || !req.body.title) {
      return res.status(400).json({ message: 'Image and title are required' });
    }

    // Create donation with all fields from req.body
    const donation = new Donate({
      ...req.body,
      image: req.file.path.replace(/\\/g, '/'), // Use the path from Multer
      quantity: parseInt(req.body.quantity) || 1,
      donorId: req.body.donorId 
    });

    await donation.save();
    res.status(201).json({ 
      message: 'Donation created!', 
      donation 
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

module.exports = {
  createDonation,
};