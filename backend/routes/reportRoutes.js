const express = require('express');
const router = express.Router();
const { getMonthlySummary, getSummary } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.get('/monthly', protect, getMonthlySummary);
router.get('/summary', protect, getSummary);

module.exports = router;
