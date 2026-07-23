import React from 'react';
import { numberWithCommas } from '../utils/format';

const Cards = ({ transactions }) => {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  const income = amounts
    .filter(item => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  return (
    <div className="cards-container">
      <div className="card balance-card">
        <h4>Total Balance</h4>
        <h1>₹{numberWithCommas(total)}</h1>
      </div>
      <div className="card income-card">
        <h4>Total Income</h4>
        <p className="money plus">+₹{numberWithCommas(income)}</p>
      </div>
      <div className="card expense-card">
        <h4>Total Expense</h4>
        <p className="money minus">-₹{numberWithCommas(expense)}</p>
      </div>
    </div>
  );
};

export default Cards;
