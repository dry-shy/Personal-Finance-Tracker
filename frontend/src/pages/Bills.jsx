import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';
import { createBill, deleteBill, getBills, updateBill } from '../redux/billSlice';
import { formatCurrency } from '../utils/format';

const initialForm = {
  name: '',
  amount: '',
  dueDate: '',
  category: 'Bills',
  recurring: 'monthly',
};

const getBillStatus = (bill) => {
  if (bill.isPaid) return 'Paid';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(bill.dueDate);
  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return 'Overdue';
  if (diffDays <= 7) return 'Due Soon';
  return 'Upcoming';
};

const Bills = () => {
  const dispatch = useDispatch();
  const { bills, isLoading, isError, message } = useSelector((state) => state.bills);
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getBills());
  }, [dispatch, isError, message]);

  const totals = useMemo(() => bills.reduce((acc, bill) => {
    if (bill.isPaid) return acc;
    return {
      amount: acc.amount + bill.amount,
      dueSoon: acc.dueSoon + (getBillStatus(bill) === 'Due Soon' ? 1 : 0),
      overdue: acc.overdue + (getBillStatus(bill) === 'Overdue' ? 1 : 0),
    };
  }, { amount: 0, dueSoon: 0, overdue: 0 }), [bills]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount || !formData.dueDate) {
      alert('Please add a bill name, amount, and due date');
      return;
    }
    dispatch(createBill({ ...formData, amount: +formData.amount }));
    setFormData(initialForm);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <div>
          <h1>Bills & Reminders</h1>
          <p>Track upcoming bills and mark them paid</p>
        </div>
      </header>

      <div className="feature-summary">
        <div className="card metric-card">
          <span>Unpaid Bills</span>
          <strong>{formatCurrency(totals.amount)}</strong>
        </div>
        <div className="card metric-card">
          <span>Due Soon</span>
          <strong>{totals.dueSoon}</strong>
        </div>
        <div className="card metric-card">
          <span>Overdue</span>
          <strong>{totals.overdue}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="main-col">
          <div className="bill-list">
            {bills.length > 0 ? bills.map((bill) => {
              const status = getBillStatus(bill);
              return (
                <div className={`card bill-card ${status.toLowerCase().replace(' ', '-')}`} key={bill._id}>
                  <div className="item-header">
                    <div>
                      <h3>{bill.name}</h3>
                      <p>{bill.category} - {bill.recurring}</p>
                    </div>
                    <Bell size={22} />
                  </div>
                  <div className="item-row">
                    <span>{formatCurrency(bill.amount)}</span>
                    <span>{new Date(bill.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="action-row">
                    <span className="status-pill">{status}</span>
                    <button
                      className="btn-secondary"
                      onClick={() => dispatch(updateBill({ id: bill._id, billData: { isPaid: !bill.isPaid } }))}
                    >
                      <CheckCircle2 size={16} /> {bill.isPaid ? 'Reopen' : 'Mark Paid'}
                    </button>
                    <button className="icon-action" onClick={() => dispatch(deleteBill(bill._id))} aria-label="Delete bill">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            }) : (
              <div className="card empty-state">No bills yet.</div>
            )}
          </div>
        </div>
        <div className="side-col">
          <div className="card">
            <h3>New Bill</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label htmlFor="name">Bill Name</label>
                <input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Rent" />
              </div>
              <div className="form-control">
                <label htmlFor="amount">Amount</label>
                <input id="amount" name="amount" type="number" min="0" step="0.01" value={formData.amount} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label htmlFor="dueDate">Due Date</label>
                <input id="dueDate" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label htmlFor="category">Category</label>
                <input id="category" name="category" value={formData.category} onChange={handleChange} />
              </div>
              <div className="form-control">
                <label htmlFor="recurring">Repeats</label>
                <select id="recurring" name="recurring" value={formData.recurring} onChange={handleChange}>
                  <option value="none">None</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
              <button className="btn">Create Bill</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bills;
