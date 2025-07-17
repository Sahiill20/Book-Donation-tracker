// controllers/bookRequestController.js
const BookRequest = require('../requestBooks/bookReqModel');
const mongoose = require('mongoose');
const { createNotification } = require('../notification/notificationController');  // Import the createNotification function

// Handle the creation of a book request and a notification
exports.createBookRequest = async (req, res) => {
  try {
    const { bookId, donorId, requesterId, requesterEmail } = req.body;

    // Create a book request (save to DB or do other necessary steps)
    const newRequest = await BookRequest.create({
      bookId:new mongoose.Types.ObjectId(bookId),
      donorId,
      requesterId,
      requesterEmail,
    });

    // After creating the book request, create the notification for the donor
    await createNotification({
      donorId, 
      requesterId, 
      bookId:new mongoose.Types.ObjectId(bookId),
    });

    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};