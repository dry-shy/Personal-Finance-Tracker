import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PiggyBank, Trash2 } from 'lucide-react';
import {
  createSavingsGoal,
  deleteSavingsGoal,
  getSavingsGoals,
  updateSavingsGoal
} from '../redux/savingsGoalSlice';
import { formatCurrency } from '../utils/format';

const initialForm = {
  name: '',
  targetAmount: '',
  currentAmount: '',
  targetDate: '',
};

const SavingsGoals = () => {
  const dispatch = useDispatch();
  const { goals, isLoading, isError, message } = useSelector((state) => state.savingsGoals);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getSavingsGoals());
  }, [dispatch, isError, message]);

  const totals = useMemo(() => goals.reduce((acc, goal) => ({
    target: acc.target + goal.targetAmount,
    saved: acc.saved + goal.currentAmount,
  }), { target: 0, saved: 0 }), [goals]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) {
      alert('Please add a goal name and target amount');
      return;
    }
    dispatch(createSavingsGoal({
      ...formData,
      targetAmount: +formData.targetAmount,
      currentAmount: +formData.currentAmount || 0,
    }));
    setFormData(initialForm);
  };

  const addContribution = (goal) => {
    const rawAmount = window.prompt('Contribution amount');
    const contribution = Number(rawAmount);
    if (!contribution || contribution <= 0) return;

    dispatch(updateSavingsGoal({
      id: goal._id,
      goalData: { currentAmount: goal.currentAmount + contribution },
    }));
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <div>
          <h1>Savings Goals</h1>
          <p>Plan targets and track how much you have set aside</p>
        </div>
      </header>

      <div className="feature-summary">
        <div className="card metric-card">
          <span>Total Saved</span>
          <strong>{formatCurrency(totals.saved)}</strong>
        </div>
        <div className="card metric-card">
          <span>Target Amount</span>
          <strong>{formatCurrency(totals.target)}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="goal-grid">
            {goals.length > 0 ? goals.map((goal) => {
              const progress = goal.targetAmount > 0
                ? Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                : 0;
              return (
                <div className="card goal-card" key={goal._id}>
                  <div className="item-header">
                    <div>
                      <h3>{goal.name}</h3>
                      <p>{goal.targetDate ? `Target ${new Date(goal.targetDate).toLocaleDateString()}` : 'No target date'}</p>
                    </div>
                    <PiggyBank size={22} />
                  </div>
                  <div className="progress-container">
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                  <div className="item-row">
                    <span>{formatCurrency(goal.currentAmount)}</span>
                    <span>{formatCurrency(goal.targetAmount)}</span>
                  </div>
                  <div className="action-row">
                    <button className="btn-secondary" onClick={() => addContribution(goal)}>Add Saved</button>
                    <button className="icon-action" onClick={() => dispatch(deleteSavingsGoal(goal._id))} aria-label="Delete goal">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="card empty-state">No savings goals yet.</div>
            )}
          </div>
        </div>
        <div className="side-col">
          <div className="card">
            <h3>New Goal</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label htmlFor="name">Goal Name</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Emergency fund" />
              </div>
              <div className="form-control">
                <label htmlFor="targetAmount">Target Amount</label>
                <input id="targetAmount" name="targetAmount" type="number" min="0" step="0.01" value={formData.targetAmount} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label htmlFor="currentAmount">Already Saved</label>
                <input id="currentAmount" name="currentAmount" type="number" min="0" step="0.01" value={formData.currentAmount} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label htmlFor="targetDate">Target Date</label>
                <input id="targetDate" name="targetDate" type="date" value={formData.targetDate} onChange={handleChange} />
              </div>
              <button className="btn">Create Goal</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SavingsGoals;
