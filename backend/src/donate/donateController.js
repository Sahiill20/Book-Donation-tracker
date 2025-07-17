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
const getDonationCount = async (req, res) => {
  try {
    const donorId = req.query.donorId;
    if (!donorId) {
      return res.status(400).json({ message: 'Missing donorId' });
    }
    // Alternative approach if $toInt doesn't work
    const donations = await Donate.find({ donorId });
    let totalDonated = 0;
    
    donations.forEach(donation => {
      totalDonated += +(donation.quantity) || 0;
    });
    
    res.status(200).json({ totalDonated });
    console.log('Fetching donation count for donorId:', donorId);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
};

const getDonationDates = async (req, res) => {
  try {
    const { donorId } = req.query;
    if (!donorId) {
      return res.status(400).json({ message: 'Missing donorId' });
    }

    const donations = await Donate.find({ donorId, status: 'donated' });

    const dates = donations.map(donation => 
      new Date(donation.createdAt).toISOString().split('T')[0]
    );

    const uniqueDates = [...new Set(dates)];

    res.status(200).json({ donationDates: uniqueDates });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {
  createDonation,
  getDonationCount,
  getDonationDates 

};