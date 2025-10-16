import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CouponProvider from '../api/CouponProvider';

export const allCouponData = createAsyncThunk(
  'couponData/getAllData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CouponProvider.getCouponData();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);



export const couponApplyData = createAsyncThunk(
  'couponData/applyCouponsubmitDoubt',
  async (formData, { rejectWithValue }) => {
   
    try {
      const response = await CouponProvider.postCouponData(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);