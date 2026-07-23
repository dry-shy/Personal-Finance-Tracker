const Budget = require('../models/Budget');

// @desc    Get user budget
// @route   GET /api/v1/budget
// @access  Private
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ user: req.user.id });

    return res.status(200).json({
      success: true,
      data: budget || null
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}

// @desc    Set or update user budget
// @route   POST /api/v1/budget
// @access  Private
exports.setBudget = async (req, res, next) => {
  try {
    const { amount } = req.body;

    let budget = await Budget.findOne({ user: req.user.id });

    if (budget) {
      // Update existing budget
      budget.amount = amount;
      await budget.save();
    } else {
      // Create new budget
      budget = await Budget.create({
        amount,
        user: req.user.id
      });
    }

    return res.status(200).json({
      success: true,
      data: budget
    });
  } catch (err) {
    if(err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
}
