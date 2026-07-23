const mongoose = require('mongoose');

const SavingsGoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a goal name']
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please add a target amount'],
    min: [0, 'Target amount cannot be negative']
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative']
  },
  targetDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('SavingsGoal', SavingsGoalSchema);
