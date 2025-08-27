import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {MMKV} from 'react-native-mmkv';
import MegaQuizeProvider from '../api/MegaQuizeProvider';

const storage = new MMKV();

// Initial state
const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
  userInfo: {},
};

export const getMegaQuizeGamesSlice = createAsyncThunk(
  'megaQuize/getMegaQuizeGamesSlice',
  async (_, {rejectWithValue}) => {
    try {
      const response = await MegaQuizeProvider.getMegaQuizeData();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const getMegaQuizAttendQuetionGetSlice = createAsyncThunk(
  'megaQuize/getMegaQuizAttendQuetionGetSlice',
  async (id, {rejectWithValue}) => {
    try {
      const response = await MegaQuizeProvider.getMegaQuizAttendQuestion(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const megaQuizAttendSubmitSlice = createAsyncThunk(
  'megaQuize/megaQuizAttendSubmitSlice',
  async (megaQuizData, {rejectWithValue}) => {
    try {
      const response = await MegaQuizeProvider.megaQuizAttendSubmit(
        megaQuizData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const megaQuizResultSlice = createAsyncThunk(
  'megaQuize/megaQuizResultSlice',
  async (id, {rejectWithValue}) => {
    try {
      const response = await MegaQuizeProvider.megaQuizResult(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

export const megaQuizRegisterSlice = createAsyncThunk(
  'megaQuize/megaQuizRegisterSlice',
  async (id, {rejectWithValue}) => {
    try {
      const response = await MegaQuizeProvider.megaQuizRegister(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

const megaQuizSlice = createSlice({
  name: 'megaQuize',
  initialState,
  reducers: {},
});

export const {} = megaQuizSlice.actions;

export default megaQuizSlice.reducer;
