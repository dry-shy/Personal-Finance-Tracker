import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import billService from '../services/billService';

const initialState = {
  bills: [],
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

export const getBills = createAsyncThunk('bills/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await billService.getBills(token);
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const createBill = createAsyncThunk('bills/create', async (billData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await billService.createBill(billData, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const updateBill = createAsyncThunk('bills/update', async (payload, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await billService.updateBill(payload, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const deleteBill = createAsyncThunk('bills/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    return await billService.deleteBill(id, token);
  } catch (error) {
    return thunkAPI.rejectWithValue(getMessage(error));
  }
});

export const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    resetBillState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBills.pending, (state) => { state.isLoading = true; })
      .addCase(getBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.bills = action.payload;
      })
      .addCase(getBills.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.bills.push(action.payload);
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.bills = state.bills.map((bill) => (
          bill._id === action.payload._id ? action.payload : bill
        ));
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.bills = state.bills.filter((bill) => bill._id !== action.payload.id);
      });
  },
});

export const { resetBillState } = billSlice.actions;
export default billSlice.reducer;
