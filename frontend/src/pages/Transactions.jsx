import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions } from '../redux/transactionSlice';
import { TransactionList } from '../components/TransactionList';

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions, isLoading, isError, message } = useSelector(
    (state) => state.transactions
  );
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [category, setCategory] = useState('all');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
    dispatch(getTransactions());
  }, [isError, message, dispatch]);

  const categories = useMemo(() => {
    const values = transactions.map((transaction) => transaction.category || 'General');
    return ['all', ...new Set(values)];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    return transactions.filter((transaction) => {
      const transactionType = transaction.amount < 0 ? 'expense' : 'income';
      const transactionDate = new Date(transaction.createdAt);
      const matchesQuery = !normalizedQuery ||
        transaction.text.toLowerCase().includes(normalizedQuery) ||
        (transaction.category || 'General').toLowerCase().includes(normalizedQuery);
      const matchesType = type === 'all' || transactionType === type;
      const matchesCategory = category === 'all' || (transaction.category || 'General') === category;
      const matchesFrom = !from || transactionDate >= from;
      const matchesTo = !to || transactionDate <= to;

      return matchesQuery && matchesType && matchesCategory && matchesFrom && matchesTo;
    });
  }, [transactions, query, type, category, fromDate, toDate]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      <header className="dashboard-header">
        <div>
          <h1>Transactions</h1>
          <p>Search, filter, and review every income and expense entry</p>
        </div>
      </header>

      <div className="card filter-panel">
        <div className="form-control">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Description or category"
          />
        </div>
        <div className="form-control">
          <label htmlFor="type">Type</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => (
              <option value={item} key={item}>{item === 'all' ? 'All' : item}</option>
            ))}
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="fromDate">From</label>
          <input id="fromDate" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
        </div>
        <div className="form-control">
          <label htmlFor="toDate">To</label>
          <input id="toDate" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      <div className="card">
        <TransactionList transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default Transactions;
