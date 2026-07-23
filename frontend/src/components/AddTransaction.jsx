import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../redux/transactionSlice';

export const AddTransaction = () => {
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('General');
  const [createdAt, setCreatedAt] = useState(new Date().toISOString().slice(0, 10));

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    if (!text || !amount) {
      alert('Please add text and amount');
      return;
    }

    const newTransaction = {
      text,
      amount: +amount,
      type,
      category,
      createdAt,
    };

    dispatch(addTransaction(newTransaction));
    setText('');
    setAmount('');
    setCategory('General');
  };

  return (
    <div className="add-transaction-container">
      <h3>Add new transaction</h3>
      <form onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="text">Description</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter description..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="type">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="category">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Salary, Rent, Food..."
          />
        </div>
        <div className="form-control">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            value={createdAt}
            onChange={(e) => setCreatedAt(e.target.value)}
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">
            Amount
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
          />
        </div>
        <button className="btn">Add transaction</button>
      </form>
    </div>
  );
};
