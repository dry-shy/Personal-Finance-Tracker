import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTransaction } from '../redux/transactionSlice';
import { formatCurrency } from '../utils/format';

export const TransactionList = ({ transactions }) => {
  const dispatch = useDispatch();

  return (
    <div className="transaction-list-container">
      <h3>History</h3>
      <ul className="list">
        {transactions.length > 0 ? (
          transactions.map((transaction) => {
            const sign = transaction.amount < 0 ? '-' : '+';
            return (
              <li key={transaction._id} className={transaction.amount < 0 ? 'minus' : 'plus'}>
                <div className="transaction-main">
                  <strong>{transaction.text}</strong>
                  <small>
                    {transaction.category || 'General'} - {new Date(transaction.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <span>{formatCurrency(transaction.amount, { sign })}</span>
                <button
                  onClick={() => dispatch(deleteTransaction(transaction._id))}
                  className="delete-btn"
                >
                  x
                </button>
              </li>
            );
          })
        ) : (
          <p>No transactions found. Add some!</p>
        )}
      </ul>
    </div>
  );
};
