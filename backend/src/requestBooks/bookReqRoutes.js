// routes/bookRequestRoutes.js
const express = require('express');
const router = express.Router();
const { createBookRequest } = require('../requestBooks/bookReqController');

router.post('/create', createBookRequest);

module.exports = router;
