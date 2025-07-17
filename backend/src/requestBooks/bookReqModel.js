// models/BookRequest.js
const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema({
bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation' },
donorId: { type: String },  // Changed from ObjectId to String
requesterId: { type: String },
requesterEmail: String,
status: { type: String, default: 'pending' },
createdAt: { type: Date, default: Date.now }

});

module.exports = mongoose.model('BookRequest', bookRequestSchema);
