import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import CashFreeProvider from '../api/cashFreeProvider';

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
  userInfo: {},
};

// Async Thunks getHomeDataSlice
export const getPaymentSlice = createAsyncThunk(
  'paymentGetway/getPaymentSlice',
  async (amount, {rejectWithValue}) => {
    try {
      const response = await CashFreeProvider.getPaymentByCashFree(amount);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const getPaymentSubscriptionSlice = createAsyncThunk(
  'paymentGetway/getPaymentSubscriptionSlice',
  async (planData, {rejectWithValue}) => {
    try {
      const response = await CashFreeProvider.getPaymentSubscription(planData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const paymentGetwaySlice = createSlice({
  name: 'paymentGetway',
  initialState,
  reducers: {},
});

export const {} = paymentGetwaySlice.actions;

export default paymentGetwaySlice.reducer;
