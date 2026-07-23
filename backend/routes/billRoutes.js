const express = require('express');
const {
  getBills,
  createBill,
  updateBill,
  deleteBill
} = require('../controllers/billController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getBills).post(protect, createBill);
router.route('/:id').put(protect, updateBill).delete(protect, deleteBill);

module.exports = router;
