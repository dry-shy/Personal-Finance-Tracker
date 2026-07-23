import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import budgetService from '../services/budgetService';

const initialState = {
  budget: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Get user budget
export const getBudget = createAsyncThunk('budget/get', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await budgetService.getBudget(token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Set or update budget
export const setBudget = createAsyncThunk('budget/set', async (budgetData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await budgetService.setBudget(budgetData, token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    resetBudgetState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBudget.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budget = action.payload;
      })
      .addCase(getBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(setBudget.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(setBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.budget = action.payload;
      })
      .addCase(setBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  }
});

export const { resetBudgetState } = budgetSlice.actions;
export default budgetSlice.reducer;
