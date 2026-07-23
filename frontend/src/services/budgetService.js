import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/budget/';

// Get user budget
const getBudget = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  const response = await axios.get(API_URL, config);
  return response.data.data;
};

// Set or update user budget
const setBudget = async (budgetData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.post(API_URL, budgetData, config);
  return response.data.data;
};

const budgetService = {
  getBudget,
  setBudget,
};

export default budgetService;
