import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserApiProvider from '../api/UserProvider';
import { MMKV } from 'react-native-mmkv';

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

// Async Thunks getHomeDataSlice
export const getHomeDataSlice = createAsyncThunk(
  'user/getHomeDataSlice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.homeData(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks getCurrentAffairesSlice
export const getCurrentAffairesSlice = createAsyncThunk(
    'user/getCurrentAffairesSlice',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await UserApiProvider.getCurrentAffairsData(page);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
// Async Thunks getCurrentAffairesSlice
export const getPreviouseYearSlice = createAsyncThunk(
  'user/getPreviouseYearSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getPreviouseYearPaper();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getCurrentAffairesSlice
export const getPreviouseYearGetQuestionSlice = createAsyncThunk(
  'user/getPreviouseYearGetQuestionSlice',
  async (previousPaperId, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getPreviouseYearPaperQuestionById(
        previousPaperId,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks attendPreviouseYearQuestionSlice
export const attendPreviouseYearQuestionSlice = createAsyncThunk(
  'user/attendPreviouseYearQuestionSlice',
  async (previouseYearSubmitData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.attendPreviouseYearQuestions(
        previouseYearSubmitData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks getPreviouseYearPaperRankSlice
export const getPreviouseYearPaperRankSlice = createAsyncThunk(
  'user/getPreviouseYearPaperRankSlice',
  async (previousPaperId, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getPreviouseYearPaperRank(
        previousPaperId,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks getFreeQuizeSlice
export const getFreeQuizeSlice = createAsyncThunk(
  'user/getFreeQuizeSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getFreeQuizeData();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);


// Async Thunks getFetchAllScholar ship video
export const getAllScholarshipPackageSlice = createAsyncThunk(
  'user/getAllScholarshipPackageSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getAllScholarshipPackage();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getFetchAllScholar ship video
export const getAllScholarshipVideoSlice = createAsyncThunk(
  'user/getAllScholarshipVideoSlice',
  async ({ id }, { rejectWithValue }) => {
    // console.log("getAllScholarshipVideoSlice=====>", id)
    try {
      const response = await UserApiProvider.getAllScholarshipVideos(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getFetchAllScholar ship video
export const getScholarshipSingleVideoSlice = createAsyncThunk(
  'user/getScholarshipSingleVideoSlice',
  async ({ id }, { rejectWithValue }) => {
    console.log("getScholarshipSingleVideoSlice=====>", id)
    try {
      const response = await UserApiProvider.getScholarshipSingleVideos(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// GET SCHOLAR SHIP QUETION
export const getScholarShipQuestionSlice = createAsyncThunk(
  'user/getScholarShipQuestionSlice',
  async (scholarship_test_id, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getScholarShipQuestionById(
        scholarship_test_id,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);


export const attendScholarShipQuestionSlice = createAsyncThunk(
  'user/attendPreviouseYearQuestionSlice',
  async (scholarShipSubmitData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.attendScholarShipQuestions(
        scholarShipSubmitData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// SCHOLAR SHIP RESULT
export const getRankScholarShipSlice = createAsyncThunk(
  'user/getRankScholarShipSlice',
  async (scholarId, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getRankScholarShip(
        scholarId,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);


// SCHOLAR SHIP API

// Async Thunks getExamInfoSlice
export const getExamInfoSlice = createAsyncThunk(
  'user/getExamInfoSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getExamInfoData();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getExamInfoSlice
export const getExamInfoDetailsSlice = createAsyncThunk(
  'user/getExamInfoDetailsSlice',
  async ({ id }, { rejectWithValue }) => {
    console.log("getExamInfoDetailsSlice==>", id)
    try {
      const response = await UserApiProvider.getExamInfoDetailsData(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks getStudyNotesSlice
export const getStudyNotesSlice = createAsyncThunk(
  'user/getStudyNotesSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getStudyNotes();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getMindMapSlice
export const getMindMapSlice = createAsyncThunk(
  'user/getMindMapSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getMindMap();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getMindMapDetailsSlice
export const getMindMapDetailsSlice = createAsyncThunk(
  'user/getMindMapDetailsSlice',
  async (id, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getMindMapDetails(id);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks getFreeTopicWisePaperSlice
export const getFreeTopicWisePaperSlice = createAsyncThunk(
  'user/getFreeTopicWisePaperSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getTopicWisePaper();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks getSubscriptionSlice
export const getSubscriptionSlice = createAsyncThunk(
  'user/getSubscriptionSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getSubscriptionData();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks genrateOrederIdSlice
export const genrateOrederIdSlice = createAsyncThunk(
  'user/genrateOrederIdSlice',
  async (orderDetails, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getGenrateOrderId(orderDetails);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// Async Thunks addBankAccountSlice
export const addBankAccountSlice = createAsyncThunk(
  'user/addBankAccountSlice',
  async (bankAccountData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.addBankAccount(bankAccountData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Async Thunks helpAndSupportSlice
export const helpAndSupportSlice = createAsyncThunk(
  'user/helpAndSupportSlice',
  async (queryData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.helpAndSupport(queryData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// FETCH USER TEST SERIES RANK
export const fetchUserTestSeriesRankSlice = createAsyncThunk(
  'user/fetchUserTestSeriesRankSlice',
  async (test_id, { rejectWithValue }) => {
    try {
      const data = await UserApiProvider.getUserTestSeriesRank(test_id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// FETCH USER TEST SERIES SOLUTION
export const fetchUserTestSeriesSolution = createAsyncThunk(
  'user/fetchUserTestSeriesSolution',
  async (test_id, { rejectWithValue }) => {
    try {
      const data = await UserApiProvider.getUserTestSeriesSolution(test_id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);
// FETCH USER TEST SERIES SOLUTION
export const fetchUserAllTestPackagesSlice = createAsyncThunk(
  'user/fetchUserAllTestPackages',
  async (_, { rejectWithValue }) => {
    try {
      const data = await UserApiProvider.fetchUserAllTestPackages();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// This thunk fetches the solution for a specific test series based on the test ID
export const getSingleCategoryPackageSlice = createAsyncThunk(
  'user/getSingleCategoryPackageSlice',
  async (id, { rejectWithValue }) => {
    try {
      const data = await UserApiProvider.getSingleCategoryPackage(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// This thunk fetches the details of a specific test series based on the test ID
export const resetTestSlice = createAsyncThunk(
  'user/resetTestSlice',
  async (id, { rejectWithValue }) => {
    try {
      const data = await UserApiProvider.userTestReset(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// This thunk fetches the details of a specific test series based on the test ID
export const getSingleCategoryPackageTestseriesSlice = createAsyncThunk(
  'user/getSingleCategoryPackageTestseriesSlice',
  async ({ testId, page, search }, { rejectWithValue }) => {
    console.log('getSingleCategoryPackageTestseriesSlice', testId, page, search);
    try {
      const data = await UserApiProvider.getSingleCategoryPackageTestseries(
        testId,
        page,
        search
      );
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// This thunk fetches the details of a specific test series based on the test ID
export const getSingleCategoryPackageTestseriesDetailSlice = createAsyncThunk(
  'user/getSingleCategoryPackageTestseriesDetailSlice',
  async (id, { rejectWithValue }) => {
    try {
      const data =
        await UserApiProvider.getSingleCategoryPackageTestseriesDetails(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// This thunk fetches the details of a specific test series based on the test ID
export const getSingleCategoryPackageTestseriesQuestionSlice = createAsyncThunk(
  'user/getSingleCategoryPackageTestseriesQuestionSlice',
  async (id, { rejectWithValue }) => {
    try {
      const data =
        await UserApiProvider.getSingleCategoryPackageTestseriesQuestion(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// This thunk fetches the details of a specific test series based on the test ID
export const genratePackageOrderIdSlice = createAsyncThunk(
  'home/genratePackageOrderIdSlice',
  async (courseData, { rejectWithValue }) => {
    try {
      const data = await UserApiProvider.orderGenrate(courseData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// This thunk fetches the details of a specific test series based on the test ID
export const register = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// This thunk handles user login
export const login = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
// This thunk handles user wallet fetch
export const getWalletSlice = createAsyncThunk(
  'user/getWalletSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.getWallet();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user credentials as input and returns the response
export const loadUserData = createAsyncThunk(
  'user/loadUserData',
  async (_, { rejectWithValue }) => {
    try {
      const token = storage.getString('token');
      const userData = storage.getString('user');
      if (userData && token) {
        return {
          user: JSON.parse(userData),
          token: token,
        };
      }
      return {};
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// This thunk handles user profile update
export const updateProfileSlice = createAsyncThunk(
  'user/updateProfileSlice',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.updateProfile(profileData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const sendOtp = createAsyncThunk(
  'user/sendOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.sendOtp(otpData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const forgotPasswordSlice = createAsyncThunk(
  'user/forgotPasswordSlice',
  async (mobile, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.forgot_for_otp_Password(mobile);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const verifyOtpSlice = createAsyncThunk(
  'user/verifyOtpSlice',
  async (verifyOtpData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.verify_otp_for_forgot_password(
        verifyOtpData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const updateForgotPasswordSlice = createAsyncThunk(
  'user/updateForgotPasswordSlice',
  async (verifyOtpData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.update_for_forgot_password(
        verifyOtpData,
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const getUserInfoSlice = createAsyncThunk(
  'user/getUserInfoSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.userProfileGet();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const attendQuestionSubmitSlice = createAsyncThunk(
  'home/attendQuestionSubmit',
  async (attendQuestion, { rejectWithValue }) => {
    try {
      const data = await UserApiProvider.submitAttendQuestions(attendQuestion);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

// It takes user profile data as input and returns the response
export const setPin = createAsyncThunk(
  'user/setPin',
  async (pinData, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.setPin(pinData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// It takes user profile data as input and returns the response
export const logoutSlice = createAsyncThunk(
  'user/logoutSlice',
  async (_, { rejectWithValue }) => {
    try {
      const response = await UserApiProvider.logout();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// REPORT QUETION GET
export const getReportedQuetionSlice = createAsyncThunk(
  'user/getReportedQuetionSlice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserApiProvider.getReportQuetion();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// GET USER COLLECTION DETAILS
export const getUserCollectionDetailSlice = createAsyncThunk(
  'user/getUserCollectionDetailSlice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserApiProvider.getUserCollectionDetails();
      console.log('User Collection Slice res', res)
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

//ADD USER COLLECTION
export const addUserCollectionSlice = createAsyncThunk(
  'user/addUserCollectionSlice',
  async (collection, { rejectWithValue }) => {
    console.log('collectionData', collection);
    try {
      const res = await UserApiProvider.addUserCollection(collection);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

//REMOVE USER COLLECTION
export const removeUserCollectionSlice = createAsyncThunk(
  'user/removeUserCollectionSlice',
  async (collection, { rejectWithValue }) => {
    console.log('collectionData in userSlice ======>', collection);
    try {
      const res = await UserApiProvider.removeUserCollection(collection);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
//REPORTED QUESTION
export const reportedQuestionSlice = createAsyncThunk(
  'user/reportedQuestionSlice',
  async (reportedQuetion, { rejectWithValue }) => {
    console.log('collectionData', reportedQuetion);
    try {
      const res = await UserApiProvider.reportQuestion(reportedQuetion);
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
//REPORTED QUESTION GET
export const reportedQuestionGetSlice = createAsyncThunk(
  'user/reportedQuestionGetSlice',
  async (reportedQuetion, { rejectWithValue }) => {
    console.log('collectionData', reportedQuetion);
    try {
      const res = await UserApiProvider.reportQuestionGet();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
//NOTIFICATION GET
export const geNotificationSlice = createAsyncThunk(
  'user/geNotificationSlice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserApiProvider.getNotification();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const userRemoveAccountSlice = createAsyncThunk(
  'user/userRemoveAccountSlice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserApiProvider.userRemoveAccount();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const userTransactionsSlice = createAsyncThunk(
  'user/userTransactionsSlice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserApiProvider.userTransactions();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const AllMagazinesSlice = createAsyncThunk(
  'user/AllMagazinesSlice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserApiProvider.monthlyMagazineGet();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
export const getLiveVideoSlice = createAsyncThunk(
  'user/getLiveVideoSlice',
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserApiProvider.getLiveVideo();
      return res;
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // ✅ SET USER INFO: Save to Redux and MMKV
    setUserInfo: (state, action) => {
      const userData = action.payload;

      state.userInfo = userData;

      try {
        storage.set('userInfo', JSON.stringify(userData));
        // console.log('✅ userInfo saved to MMKV:', userData);
      } catch (error) {
        console.log('❌ Error saving userInfo to MMKV:', error);
      }
    },

    // ✅ GET USER INFO: Load from MMKV and set in Redux
    getUserInfo: state => {
      try {
        const userDataString = storage.getString('userInfo');

        if (userDataString) {
          const userData = JSON.parse(userDataString);
          state.userInfo = userData;
          console.log('✅ userInfo loaded from MMKV:', userData);
        } else {
          state.userInfo = null;
          console.warn('⚠️ No userInfo found in MMKV');
        }
      } catch (error) {
        console.log('❌ Error reading userInfo from MMKV:', error);
      }
    },

    // ✅ CLEAR USER INFO: Remove from Redux and MMKV
    clearUserInfo: state => {
      state.userInfo = null;

      try {
        storage.delete('userInfo');
        console.log('🗑️ userInfo deleted from MMKV');
      } catch (error) {
        console.log('❌ Error deleting userInfo from MMKV:', error);
      }
    },
  },
  
  extraReducers: builder => {
    builder
      .addCase(loadUserData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user && action.payload.token) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getHomeDataSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHomeDataSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(getHomeDataSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.message = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        if (action.payload.token) {
          try {
            storage.set('token', action.payload.token);
            storage.set('user', JSON.stringify(action.payload.data));
          } catch (error) {
            console.log('storage mmkv error', error);
          }
        }

        state.message = action.payload.message;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message;
      })

      .addCase(logoutSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutSlice.fulfilled, (state, action) => {
        state.loading = false;

        // Clear MMKV
        storage.delete('token');
        storage.delete('user');

        // Clear Redux state
        state.token = null;
        state.user = null;
        state.userInfo = {}; // ✅ Clear userInfo

        state.message = action.payload.message;
      })
      .addCase(logoutSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.message = action.payload?.message;
      })

      .addCase(updateProfileSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;

        if (action.payload.data) {
          // Use the central reducer to set userInfo and MMKV
          userSlice.caseReducers.setUserInfo(state, {
            payload: action.payload.data,
          });
        }
      })
      .addCase(updateProfileSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserInfoSlice.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserInfoSlice.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.userInfo = action.payload.data;

        if (action.payload.data) {
          // Use the central reducer to set userInfo and MMKV
          userSlice.caseReducers.setUserInfo(state, {
            payload: action.payload.data,
          });
        }
      })
      .addCase(getUserInfoSlice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUserInfo, getUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
