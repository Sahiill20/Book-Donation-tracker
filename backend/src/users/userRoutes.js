const express = require('express');
const {registerUser, getUserById} = require('./userController');

const router = express.Router();

// POST /api/users
router.post('/register', registerUser);
router.get('/register/:uid', getUserById);

module.exports = router;
