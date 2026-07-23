const Bill = require('../models/Bill');

exports.getBills = async (req, res) => {
  try {
    const bills = await Bill.find({ user: req.user.id }).sort({ dueDate: 1 });
    return res.status(200).json({ success: true, count: bills.length, data: bills });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.createBill = async (req, res) => {
  try {
    const bill = await Bill.create({ ...req.body, user: req.user.id });
    return res.status(201).json({ success: true, data: bill });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({ success: false, error: messages });
    }
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.updateBill = async (req, res) => {
  try {
    let bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ success: false, error: 'No bill found' });
    }

    if (bill.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({ success: true, data: bill });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.deleteBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({ success: false, error: 'No bill found' });
    }

    if (bill.user.toString() !== req.user.id) {
      return res.status(401).json({ success: false, error: 'User not authorized' });
    }

    await bill.deleteOne();
    return res.status(200).json({ success: true, data: {}, id: req.params.id });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
