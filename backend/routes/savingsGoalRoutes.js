const express = require('express');
const {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal
} = require('../controllers/savingsGoalController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getSavingsGoals).post(protect, createSavingsGoal);
router.route('/:id').put(protect, updateSavingsGoal).delete(protect, deleteSavingsGoal);

module.exports = router;
