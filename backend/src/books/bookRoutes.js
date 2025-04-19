// books/bookRoutes.js
const express = require('express');
const router = express.Router();
const { getAllBooks } = require('../books/bookController');

router.get('/books', getAllBooks); // GET /api/books

module.exports = router;
