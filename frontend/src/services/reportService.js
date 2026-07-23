import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/reports/';

const getMonthlySummary = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'monthly', config);
  return response.data.data;
};

const getSummary = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'summary', config);
  return response.data.data;
};

const reportService = { getMonthlySummary, getSummary };
export default reportService;
