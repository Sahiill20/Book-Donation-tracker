const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('./dashBoardController');

router.get('/stats', getDashboardStats);

module.exports = router;
