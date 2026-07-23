import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBudget } from '../redux/budgetSlice';

const BudgetForm = ({ currentBudget }) => {
  const [amount, setAmount] = useState(currentBudget ? currentBudget.amount : '');
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    if (!amount) {
      alert('Please enter a budget amount');
      return;
    }

    dispatch(setBudget({ amount: +amount }));
  };

  return (
    <div className="budget-form-container card">
      <h3>{currentBudget ? 'Update Monthly Budget' : 'Set Monthly Budget'}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="amount">Budget Goal Amount</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 5000"
          />
        </div>
        <button type="submit" className="btn">
          {currentBudget ? 'Update Goal' : 'Save Goal'}
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;
