import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transactionReducer from './transactionSlice';
import budgetReducer from './budgetSlice';
import reportReducer from './reportSlice';
import savingsGoalReducer from './savingsGoalSlice';
import billReducer from './billSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    budget: budgetReducer,
    reports: reportReducer,
    savingsGoals: savingsGoalReducer,
    bills: billReducer,
  },
});
