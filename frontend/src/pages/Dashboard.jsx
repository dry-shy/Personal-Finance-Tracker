import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactions, reset } from '../redux/transactionSlice';
import Cards from '../components/Cards';
import Charts from '../components/Charts';
import { AddTransaction } from '../components/AddTransaction';
import { TransactionList } from '../components/TransactionList';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { transactions, isLoading, isError, message } = useSelector(
    (state) => state.transactions
  );

  useEffect(() => {
    if (isError) {
      console.log(message);
    }

    if (!user) {
      navigate('/login');
    } else {
      dispatch(getTransactions());
    }

    return () => {
      dispatch(reset());
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user && user.name}</h1>
        <p>Here is your financial overview</p>
      </header>

      <Cards transactions={transactions} />
      
      <div className="dashboard-grid">
        <div className="main-col">
          <Charts transactions={transactions} />
          <TransactionList transactions={transactions} />
        </div>
        <div className="side-col">
          <AddTransaction />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
