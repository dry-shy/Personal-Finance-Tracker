const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/v1/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// @desc    Add transaction
// @route   POST /api/v1/transactions
// @access  Private
exports.addTransaction = async (req, res, next) => {
  try {
    const { text, amount, category, type, createdAt } = req.body;
    const normalizedAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);

    const transaction = await Transaction.create({
      text,
      amount: type ? normalizedAmount : amount,
      category,
      type,
      createdAt,
      user: req.user.id
    });

    return res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (err) {
    console.error('Transaction Error:', err);
    if(err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
      });
    }
  }
}

// @desc    Delete transaction
// @route   DELETE /api/v1/transactions/:id
// @access  Private
exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if(!transaction) {
      return res.status(404).json({
        success: false,
        error: 'No transaction found'
      });
    }

    // Check for user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        error: 'User not authorized'
      });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}
