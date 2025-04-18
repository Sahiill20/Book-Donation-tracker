// src/donate/donateRoutes.js
const express = require('express');
const router = express.Router();
const { createDonation } = require('./donateController');

router.post('/donate', createDonation); // POST /api/donate/donate

router.get('/books', async (req, res) => {
    const { email } = req.query;
    try {
      const books = await DonateModel.find({ donorEmail: email });
      res.json(books);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching books' });
    }
  });
  
  // DELETE a book
  router.delete('/book/:id', async (req, res) => {
    try {
      await DonateModel.findByIdAndDelete(req.params.id);
      res.json({ message: 'Book deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting book' });
    }
  });
  
  // PUT (update) a book
  router.put('/book/:id', async (req, res) => {
    try {
      await DonateModel.findByIdAndUpdate(req.params.id, req.body);
      res.json({ message: 'Book updated' });
    } catch (err) {
      res.status(500).json({ message: 'Error updating book' });
    }
  });
module.exports = router;
