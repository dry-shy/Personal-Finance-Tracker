import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBudget, resetBudgetState } from '../redux/budgetSlice';
import { getTransactions } from '../redux/transactionSlice';
import BudgetForm from '../components/BudgetForm';
import { formatCurrency } from '../utils/format';

const Budget = () => {
  const dispatch = useDispatch();

  const { budget, isLoading, isError, message } = useSelector(
    (state) => state.budget
  );

  const { transactions } = useSelector((state) => state.transactions);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    dispatch(getBudget());
    dispatch(getTransactions());

    return () => {
      dispatch(resetBudgetState());
    };
  }, [isError, message, dispatch]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  // Calculate expenses to compare against budget
  const totalExpense = transactions
    .filter((t) => t.amount < 0)
    .reduce((acc, t) => acc + Math.abs(t.amount), 0);
  
  const budgetGoal = budget ? budget.amount : 0;
  const remaining = budgetGoal - totalExpense;
  const progressPercentage = budgetGoal > 0 ? (totalExpense / budgetGoal) * 100 : 0;

  // Determine progress bar color based on spending
  let progressColor = 'var(--success-color)'; // Default: good
  if (progressPercentage > 75) progressColor = 'orange'; // Warning
  if (progressPercentage > 95) progressColor = 'var(--danger-color)'; // Danger

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <h1>Monthly Budget</h1>
        <p>Set and track your monthly spending limit</p>
      </header>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="card budget-overview">
            <h2>Current Status</h2>
            <div className="budget-stats">
              <div className="stat">
                <h4>Budget Goal</h4>
                <h1 style={{ color: 'var(--primary-color)' }}>{formatCurrency(budgetGoal)}</h1>
              </div>
              <div className="stat">
                <h4>Remaining</h4>
                <h1 style={{ color: remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)' }}>
                  {formatCurrency(remaining)}
                </h1>
              </div>
            </div>
            
            <div className="progress-container" style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span>0%</span>
                <span>{progressPercentage > 100 ? 100 : Math.round(progressPercentage)}%</span>
              </div>
              <div style={{ width: '100%', height: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    width: `${progressPercentage > 100 ? 100 : progressPercentage}%`, 
                    height: '100%', 
                    backgroundColor: progressColor,
                    transition: 'width 0.5s ease-in-out'
                  }} 
                />
              </div>
              {progressPercentage > 100 && (
                <p style={{ color: 'var(--danger-color)', marginTop: '10px', fontWeight: 'bold' }}>
                  You have exceeded your monthly budget!
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="side-col">
          <BudgetForm currentBudget={budget} />
        </div>
      </div>
    </div>
  );
};

export default Budget;
