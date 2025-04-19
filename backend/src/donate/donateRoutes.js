const express = require('express');
const multer = require('multer');
const router = express.Router();
const { createDonation } = require('./donateController');
const DonateModel = require('./donateModel');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Routes
router.post('/donate', upload.single('image'), createDonation);

// router.get('/books', async (req, res) => {
//   try {
//     const books = await DonateModel.find(req.query.email ? { email: req.query.email } : {});
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ message: 'Error fetching books', error: err.message });
//   }
// });

// router.delete('/book/:id', async (req, res) => {
//   try {
//     const book = await DonateModel.findByIdAndDelete(req.params.id);
//     if (!book) return res.status(404).json({ message: 'Book not found' });
//     res.json({ message: 'Book deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Error deleting book', error: err.message });
//   }
// });

// router.put('/book/:id', async (req, res) => {
//   try {
//     const book = await DonateModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!book) return res.status(404).json({ message: 'Book not found' });
//     res.json({ message: 'Book updated', book });
//   } catch (err) {
//     res.status(500).json({ message: 'Error updating book', error: err.message });
//   }
// });

module.exports = router;