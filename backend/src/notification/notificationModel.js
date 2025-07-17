const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  donorId: { type: String },  // Changed from ObjectId to String
  requesterId: { type: String },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  status: { type: String, enum: ['pending', 'accepted', 'declined', 'confirmed'], default: 'pending' },
  type: { type: String, enum: ['request', 'confirmation'], default: 'request' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);
