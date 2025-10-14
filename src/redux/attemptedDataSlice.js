import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import AttemptedData from "../api/AttemtedData";


// Async Thunks getattemptedDataSlice
export const getattemptedData = createAsyncThunk(
  "getAttemptedTestData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await AttemptedData.getAttemptedTestData();
   
      return response.data; // Should be array of magazines
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);