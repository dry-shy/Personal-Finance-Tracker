import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/transactions/';

// Get user transactions
const getTransactions = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(API_URL, config);
  return response.data.data;
};

// Add transaction
const addTransaction = async (transactionData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.post(API_URL, transactionData, config);
  return response.data.data;
};

// Delete transaction
const deleteTransaction = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  await axios.delete(API_URL + id, config);
  return { id };
};

const transactionService = {
  getTransactions,
  addTransaction,
  deleteTransaction,
};

export default transactionService;
