// donateModel.js
const mongoose = require('mongoose');

const donateSchema = new mongoose.Schema({
  title: String,
  genre: String,
  condition: String,
  quantity: Number,
  pickupLocation: String,
  donorEmail: String,
  donorName: String,
}, { timestamps: true });

module.exports = mongoose.model('Donation', donateSchema);
