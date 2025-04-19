const mongoose = require('mongoose');

const donateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      enum: ["Fiction", "Non-Fiction", "Science", "History", "Biography", "Other"],
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [/.+\@.+\..+/, "Please enter a valid email"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    image: {
      type: String, // This will store the file path or URL
      required: [true, "Cover image is required"],
    },
    status: {
      type: String,
      enum: ["Available", "Pending", "Donated"],
      default: "Available",
    },
    donorId: {
      type: String,
      ref: "User", // If you have a User model
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donation", donateSchema);