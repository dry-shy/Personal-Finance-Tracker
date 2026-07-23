import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';

// Helper function to format with commas
export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const Balance = () => {
  const { transactions } = useContext(GlobalContext);

  const amounts = transactions.map(transaction => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  return (
    <div className="balance-container">
      <h4>Your Balance</h4>
      <h1 id="balance">₹{numberWithCommas(total)}</h1>
    </div>
  )
}
