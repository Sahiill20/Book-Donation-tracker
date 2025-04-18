const express = require('express');
const registerUser = require('./userController');

const router = express.Router();

// POST /api/users
router.post('/register', registerUser);

module.exports = router;
