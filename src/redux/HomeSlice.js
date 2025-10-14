import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import HomeProvider from '../api/homeProvider';

// Initial state
const initialState = {
    user: null,
    token: null,
    loading: false,
    error: null,
    message: null,
    userInfo: {},
};



export const homePageSlice = createAsyncThunk(
    'home/homePageSlice',
    async (id, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.homeData(id);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getSingleCategoryPackageTestseriesSlice = createAsyncThunk(
    'home/getSingleCategoryPackageTestseriesSlice',
    async ({ testId, page, search }, { rejectWithValue }) => {
        // // console.log('getSingleCategoryPackageTestseriesSlice', testId, page, search);
        try {
            const data = await HomeProvider.getSingleCategoryPackageTestseries(
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
    'home/getSingleCategoryPackageTestseriesDetailSlice',
    async (id, { rejectWithValue }) => {
        try {
            const data =
                await HomeProvider.getSingleCategoryPackageTestseriesDetails(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);





// This thunk fetches the details of a specific test series based on the test ID
export const getSingleCategoryPackageTestseriesQuestionSlice = createAsyncThunk(
    'home/getSingleCategoryPackageTestseriesQuestionSlice',
    async (id, { rejectWithValue }) => {
        // console.log("this is id", id)
        try {
            const data = await HomeProvider.getSingleCategoryPackageTestseriesQuestion(id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);

// It takes user profile data as input and returns the response
export const attendQuestionSubmitSlice = createAsyncThunk(
    'home/attendQuestionSubmitSlice',
    async (attendQuestion, { rejectWithValue }) => {
        try {
            const data = await HomeProvider.submitAttendQuestions(attendQuestion);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);


// FETCH USER TEST SERIES RANK
export const fetchUserTestSeriesRankSlice = createAsyncThunk(
    'home/fetchUserTestSeriesRankSlice',
    async (test_id, { rejectWithValue }) => {
        try {
            const data = await HomeProvider.getUserTestSeriesRank(test_id);
        
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);



export const fetchUserTestSeriesSolution = createAsyncThunk(
    'home/fetchUserTestSeriesSolution',
    async (test_id, { rejectWithValue }) => {
        try {
            const data = await HomeProvider.getUserTestSeriesSolution(test_id);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    },
);


// Async Thunks getSubscriptionSlice
export const getSubscriptionSlice = createAsyncThunk(
    'user/getSubscriptionSlice',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.getSubscriptionData();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
// Async Thunks getSubscriptionSlice
export const checkoutpaySlice = createAsyncThunk(
    'user/checkoutpaySlice',
    async (subscibeData, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.checkoutpay(subscibeData);
           
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

// It takes user profile data as input and returns the response
export const getUserInfoSlice = createAsyncThunk(
    'home/getUserInfoSlice',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.userProfileGet();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
// It takes user profile data as input and returns the response
export const getTransactionSlice = createAsyncThunk(
    'home/getTransactionSlice',
    async (_, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.getTransaction();
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
////////////////////////////blog////////////////////////////////
export const getBlogSlice = createAsyncThunk(
    'home/getBlogSlice',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.getBlog(page);
            return response; // must include pagination fields
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const getBlogDetailSlice = createAsyncThunk(
    'home/getBlogDetailSlice',
    async (id, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.getBlogDetail(id);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);



export const helpAndSupportSlice = createAsyncThunk(
    'home/helpAndSupportSlice',
    async (queryData, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.helpAndSupport(queryData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

// SAVE COLLECTION SLICE
export const saveCollectionSlice = createAsyncThunk(
    'home/saveCollectionSlice',
    async (collectionData, { rejectWithValue }) => {
        try {
            const response = await HomeProvider.saveCollection(collectionData);
            console.log('Save Bookmark Collection Response:', response)
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const removeUserCollectionSlice = createAsyncThunk(
    'home/removeUserCollectionSlice',
    async (collection, { rejectWithValue }) => {
      
        try {
            const res = await HomeProvider.removeUserCollection(collection);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

// GET USER COLLECTION DETAILS
export const getUserCollectionDetailSlice = createAsyncThunk(
    'home/getUserCollectionDetailSlice',
    async (_, { rejectWithValue }) => {
        try {
            const res = await HomeProvider.getUserCollectionDetails();
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);
// GET USER COLLECTION DETAILS
export const getLiveVideoSlice = createAsyncThunk(
    'home/getLiveViewSlice',
    async (_, { rejectWithValue }) => {
        try {
            const res = await HomeProvider.getLiveVideo();
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

export const getAllGkSlice = createAsyncThunk(
    'home/getLiveViewSlice',
    async (_, { rejectWithValue }) => {
        try {
            const res = await HomeProvider.getAllGkseries();
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);



const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
});

export const { } = homeSlice.actions;

export default homeSlice.reducer;