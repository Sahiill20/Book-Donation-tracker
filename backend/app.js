const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const donateRoutes = require('./src/donate/donateRoutes');
const userRoutes = require('./src/users/userRoutes');

const app = express();

// Ensure 'uploads' directory exists
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

require('dotenv').config();

// Routes
app.use('/api/donate', donateRoutes);
app.use('/api/users', userRoutes);

async function main() {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log("MongoDB connected");

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (err) {
    console.error("Connection error:", err);
  }
}

main();