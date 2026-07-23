import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import reportService from '../services/reportService';

const initialState = {
  monthlySummary: [],
  summary: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

export const getMonthlySummary = createAsyncThunk('reports/monthly', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await reportService.getMonthlySummary(token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getSummary = createAsyncThunk('reports/summary', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await reportService.getSummary(token);
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    resetReportState: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMonthlySummary.pending, (state) => { state.isLoading = true; })
      .addCase(getMonthlySummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.monthlySummary = action.payload;
      })
      .addCase(getMonthlySummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getSummary.pending, (state) => { state.isLoading = true; })
      .addCase(getSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.summary = action.payload;
      })
      .addCase(getSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetReportState } = reportSlice.actions;
export default reportSlice.reducer;
