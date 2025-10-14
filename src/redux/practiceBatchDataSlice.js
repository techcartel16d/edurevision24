import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import PracticeBatch from "../api/PracticeBatch";

// Async Thunks getpracticeBatchData
export const getpracticeBatchData = createAsyncThunk(
  "getpracticeBatchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await PracticeBatch.getPracticeBatchData();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunks getPracticeBatchPurchaseSlice
export const purchasePracticeBatchSlice = createAsyncThunk(
  'user/purchasePracticeBatchSlice',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await PracticeBatch.purchasePracticeBatch(purchaseData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// ✅ Async Thunks get Batch videos Data
export const getBatchVideosSlice = createAsyncThunk(
  "getBatchVideosData",
  async (slug, { rejectWithValue }) => {
    try {
      const response = await PracticeBatch.getBatchVideos(slug);
      console.log('✅ Response from slice:', response);
      return response;
    } catch (error) {
      console.error('❌ Error in slice:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ UPDATED: Initial state with batchVideos
const initialState = {
  batches: [],
  loading: false,
  error: null,
  message: null,
  // Purchase states
  purchasing: false,
  purchaseError: null,
  purchaseSuccess: false,
  // ✅ ADDED: Batch videos states
  batchVideos: null,
  videosLoading: false,
  videosError: null,
};

// Practice Batch Slice
const practiceBatchSlice = createSlice({
  name: "practiceBatch",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.purchaseError = null;
      state.videosError = null; // ✅ ADDED
    },
    clearMessage: (state) => {
      state.message = null;
    },
    resetState: (state) => {
      state.batches = [];
      state.loading = false;
      state.error = null;
      state.message = null;
      state.purchasing = false;
      state.purchaseError = null;
      state.purchaseSuccess = false;
      // ✅ ADDED: Reset video states
      state.batchVideos = null;
      state.videosLoading = false;
      state.videosError = null;
    },
    clearPurchaseState: (state) => {
      state.purchasing = false;
      state.purchaseError = null;
      state.purchaseSuccess = false;
    },
    // ✅ ADDED: Clear batch videos
    clearBatchVideos: (state) => {
      state.batchVideos = null;
      state.videosLoading = false;
      state.videosError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get batches
      .addCase(getpracticeBatchData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getpracticeBatchData.fulfilled, (state, action) => {
        state.loading = false;
        state.batches = action.payload.data || [];
        state.message = action.payload.message || 'Success';
        state.error = null;
      })
      .addCase(getpracticeBatchData.rejected, (state, action) => {
        state.loading = false;
        state.batches = [];
        state.error = action.payload?.message || action.payload || 'Failed to fetch practice batches';
        state.message = null;
      })
      // Purchase batch
      .addCase(purchasePracticeBatchSlice.pending, (state) => {
        state.purchasing = true;
        state.purchaseError = null;
        state.purchaseSuccess = false;
      })
      .addCase(purchasePracticeBatchSlice.fulfilled, (state, action) => {
        state.purchasing = false;
        state.purchaseSuccess = true;
        state.purchaseError = null;
      })
      .addCase(purchasePracticeBatchSlice.rejected, (state, action) => {
        state.purchasing = false;
        state.purchaseSuccess = false;
        state.purchaseError = action.payload?.message || action.payload || 'Purchase failed';
      })
      // ✅ ADDED: Get batch videos reducers
      .addCase(getBatchVideosSlice.pending, (state) => {
        console.log('🔄 getBatchVideosSlice.pending');
        state.videosLoading = true;
        state.videosError = null;
        state.batchVideos = null;
      })
      .addCase(getBatchVideosSlice.fulfilled, (state, action) => {
        console.log('✅ getBatchVideosSlice.fulfilled', action.payload);
        state.videosLoading = false;
        state.batchVideos = action.payload; // This stores the entire response
        state.videosError = null;
      })
      .addCase(getBatchVideosSlice.rejected, (state, action) => {
        console.error('❌ getBatchVideosSlice.rejected', action.payload);
        state.videosLoading = false;
        state.batchVideos = null;
        state.videosError = action.payload?.message || action.payload || 'Failed to fetch batch videos';
      });
  },
});

export const { 
  clearError, 
  clearMessage, 
  resetState, 
  clearPurchaseState,
  clearBatchVideos // ✅ ADDED: Export new action
} = practiceBatchSlice.actions;

export default practiceBatchSlice.reducer;
