import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/savings-goals/';

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const getSavingsGoals = async (token) => {
  const response = await axios.get(API_URL, authConfig(token));
  return response.data.data;
};

const createSavingsGoal = async (goalData, token) => {
  const response = await axios.post(API_URL, goalData, authConfig(token));
  return response.data.data;
};

const updateSavingsGoal = async ({ id, goalData }, token) => {
  const response = await axios.put(API_URL + id, goalData, authConfig(token));
  return response.data.data;
};

const deleteSavingsGoal = async (id, token) => {
  await axios.delete(API_URL + id, authConfig(token));
  return { id };
};

export default {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
};
