// books/bookModel.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    genre: String,
    condition: String,
    location: String,
    name: String,
    email: String,
    quantity: Number,
    image: String,
    status: {
      type: String,
      enum: ["Available", "Pending", "Donated"],
      default: "Available",
    },
    donorId: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
