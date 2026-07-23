const Transaction = require('../models/Transaction');

// @desc    Get monthly summary report
// @route   GET /api/v1/reports/monthly
// @access  Private
exports.getMonthlySummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: 1 });

    // Group transactions by month
    const monthly = {};

    transactions.forEach(t => {
      const date = new Date(t.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthly[key]) {
        monthly[key] = { month: key, income: 0, expense: 0, net: 0 };
      }

      if (t.amount > 0) {
        monthly[key].income += t.amount;
      } else {
        monthly[key].expense += Math.abs(t.amount);
      }
      monthly[key].net += t.amount;
    });

    const result = Object.values(monthly).map(m => ({
      ...m,
      income: parseFloat(m.income.toFixed(2)),
      expense: parseFloat(m.expense.toFixed(2)),
      net: parseFloat(m.net.toFixed(2)),
    }));

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Get overall summary stats
// @route   GET /api/v1/reports/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    const totalIncome = transactions
      .filter(t => t.amount > 0)
      .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.amount < 0)
      .reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const netBalance = totalIncome - totalExpense;
    const avgTransaction = transactions.length > 0
      ? (transactions.reduce((acc, t) => acc + t.amount, 0) / transactions.length)
      : 0;

    const largestExpense = transactions
      .filter(t => t.amount < 0)
      .sort((a, b) => a.amount - b.amount)[0] || null;

    const largestIncome = transactions
      .filter(t => t.amount > 0)
      .sort((a, b) => b.amount - a.amount)[0] || null;

    return res.status(200).json({
      success: true,
      data: {
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpense: parseFloat(totalExpense.toFixed(2)),
        netBalance: parseFloat(netBalance.toFixed(2)),
        totalTransactions: transactions.length,
        avgTransaction: parseFloat(avgTransaction.toFixed(2)),
        largestExpense: largestExpense ? { text: largestExpense.text, amount: largestExpense.amount } : null,
        largestIncome: largestIncome ? { text: largestIncome.text, amount: largestIncome.amount } : null,
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
