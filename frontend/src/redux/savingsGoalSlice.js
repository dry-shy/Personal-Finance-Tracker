import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import savingsGoalService from '../services/savingsGoalService';

const initialState = {
  goals: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const getMessage = (error) => (
  (error.response && error.response.data && error.response.data.error) ||
  error.message ||
  error.toString()
);

export const getSavingsGoals = createAsyncThunk('savingsGoals/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await savingsGoalService.getSavingsGoals(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const createSavingsGoal = createAsyncThunk('savingsGoals/create', async (goalData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await savingsGoalService.createSavingsGoal(goalData, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const updateSavingsGoal = createAsyncThunk('savingsGoals/update', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await savingsGoalService.updateSavingsGoal(payload, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const deleteSavingsGoal = createAsyncThunk('savingsGoals/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await savingsGoalService.deleteSavingsGoal(id, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const savingsGoalSlice = createSlice({
  name: 'savingsGoals',
  initialState,
  reducers: {
    resetSavingsGoalState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSavingsGoals.pending, (state) => { state.isLoading = true; })
      .addCase(getSavingsGoals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.goals = action.payload;
      })
      .addCase(getSavingsGoals.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createSavingsGoal.fulfilled, (state, action) => {
        state.goals.unshift(action.payload);
      })
      .addCase(updateSavingsGoal.fulfilled, (state, action) => {
        state.goals = state.goals.map((goal) => (
          goal._id === action.payload._id ? action.payload : goal
        ));
      })
      .addCase(deleteSavingsGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((goal) => goal._id !== action.payload.id);
      });
  },
});

export const { resetSavingsGoalState } = savingsGoalSlice.actions;
export default savingsGoalSlice.reducer;
