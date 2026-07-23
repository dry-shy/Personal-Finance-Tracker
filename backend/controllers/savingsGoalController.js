const SavingsGoal = require('../models/SavingsGoal');

exports.getSavingsGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, count: goals.length, data: goals });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.createSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.create({ ...req.body, user: req.user.id });
    return res.status(201).json({ success: true, data: goal });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateSavingsGoal = async (req, res) => {
  try {
    let goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, error: 'No savings goal found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    goal = await SavingsGoal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({ success: true, data: goal });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteSavingsGoal = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);

    if (!goal) {
      return res.status(404).json({ success: false, error: 'No savings goal found' });
    }

    if (goal.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    await goal.deleteOne();
    return res.status(200).json({ success: true, data: {}, id: req.params.id });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
