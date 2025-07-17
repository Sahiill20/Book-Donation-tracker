// books/bookRoutes.js
const express = require('express');
const router = express.Router();
const { getAllBooks, getBookById } = require('../books/bookController');

// Existing route to get all books
router.get('/books', getAllBooks);

// New route to get a book by its ID
router.get('/books/:bookId', getBookById); // Use :bookId for a specific book

module.exports = router;
