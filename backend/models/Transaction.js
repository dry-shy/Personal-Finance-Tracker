const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  text: {
    type: String,
    trim: true,
    required: [true, 'Please add some text']
  },
  amount: {
    type: Number,
    required: [true, 'Please add a positive or negative number']
  },
  category: {
    type: String,
    trim: true,
    default: 'General'
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

TransactionSchema.pre('save', function() {
  if (!this.type) {
    this.type = this.amount >= 0 ? 'income' : 'expense';
  }
});

module.exports = mongoose.model('Transaction', TransactionSchema);
