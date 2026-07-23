import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/bills/';

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

const getBills = async (token) => {
  const response = await axios.get(API_URL, authConfig(token));
  return response.data.data;
};

const createBill = async (billData, token) => {
  const response = await axios.post(API_URL, billData, authConfig(token));
  return response.data.data;
};

const updateBill = async ({ id, billData }, token) => {
  const response = await axios.put(API_URL + id, billData, authConfig(token));
  return response.data.data;
};

const deleteBill = async (id, token) => {
  await axios.delete(API_URL + id, authConfig(token));
  return { id };
};

export default {
  getBills,
  createBill,
  updateBill,
  deleteBill,
};
