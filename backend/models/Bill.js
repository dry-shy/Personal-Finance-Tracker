const mongoose = require('mongoose');

const BillSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    trim: true,
    required: [true, 'Please add a bill name']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a bill amount'],
    min: [0, 'Bill amount cannot be negative']
  },
  dueDate: {
    type: Date,
    required: [true, 'Please add a due date']
  },
  category: {
    type: String,
    trim: true,
    default: 'Bills'
  },
  recurring: {
    type: String,
    enum: ['none', 'monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bill', BillSchema);
