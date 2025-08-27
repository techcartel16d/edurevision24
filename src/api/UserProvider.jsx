import axios from "axios";
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const API_BASE_URL = "https://admin.revision24.com/api";

const UserApiProvider = {

    homeData: async (id) => {
        // console.log("id---->", id)
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/home-page?exam_category_id=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getCurrentAffairsData: async () => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/news`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getPreviouseYearPaper: async () => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/all-free-previouse-exam`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getPreviouseYearPaperQuestionById: async (previousPaperId) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/previous-year-question-list-get?previous_year_exam_id=${previousPaperId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    attendPreviouseYearQuestions: async (previouseYearSubmitData) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/user-attend-previous-year-exam`, previouseYearSubmitData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getPreviouseYearPaperRank: async (previousPaperId) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/user-attend-previous-year-exam-rank-get?previous_year_exam_id=${previousPaperId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getFreeQuizeData: async () => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/all-free-test-series`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getAllScholarshipPackage: async () => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/all-scholarship-package`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getAllScholarshipVideos: async (id) => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/all-scholarship-test-video/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getScholarshipSingleVideos: async (id) => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/all-scholarship-test/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getScholarShipQuestionById: async (scholarship_test_id) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/scholarship-test-question-list-get?scholarship_test_id=${scholarship_test_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    attendScholarShipQuestions: async (scholarShipSubmitData) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/user-attend-scholarship-test`, scholarShipSubmitData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getRankScholarShip: async (scholarId) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/user-attend-scholarship-test-rank-get?scholarship_test_id=${scholarId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getExamInfoData: async () => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/exam-info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getExamInfoDetailsData: async (id) => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/exam-info-detail/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getStudyNotes: async () => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/study-notes`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getMindMap: async () => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/mind-maps`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getMindMapDetails: async (id) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/mind-maps-detail/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getTopicWisePaper: async () => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/all-topic-test-series`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getSubscriptionData: async () => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/subscriptions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getGenrateOrderId: async (orderDetails) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/create-order`, orderDetails, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    addBankAccount: async (bankAccountData) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/add-bank-account`, bankAccountData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    helpAndSupport: async (queryData) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/contact-us-store`, queryData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    getSingleCategoryPackage: async (id) => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/test-package-by-category/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching getSingle category package:', error);
            throw error;
        }
    },

    userTestReset: async (id) => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-attend-test-series-reset?test_id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching reset:', error);
            throw error;
        }
    },

    getUserTestSeriesRank: async (test_id) => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-attend-test-series-rank-get?test_id=${test_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error TEST SERIES RANK:', error);
            throw error;
        }
    },

    getUserTestSeriesSolution: async (test_id) => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-attend-test-series-question-solution?test_id=${test_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching solution:', error);
            throw error;
        }
    },
    fetchUserAllTestPackages: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/all-test-package`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching fetchUserAllTestPackages:', error);
            throw error;
        }
    },

    getSingleCategoryPackageTestseries: async (id, page = 1, search) => {
        // console.log("getSingleCategoryPackageTestseries called with id:", id, "page:", page, "search:", search);
        // return
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/test-course-detail-get`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    id,
                    page,       // pass page here
                    search
                },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching testseries:', error);
            throw error;
        }
    },

    getSingleCategoryPackageTestseriesDetails: async (id) => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/test-series-detail/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching testseries details:', error);
            throw error;
        }
    },

    getSingleCategoryPackageTestseriesQuestion: async (id) => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/question-list-get?test_series_id=${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching testseries questions:', error);
            throw error;
        }
    },

    submitAttendQuestions: async (attendQuestion) => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(
                `${API_BASE_URL}/user-attend-test-series`,
                attendQuestion,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            console.error('Error SUBMIT ATTEND QUESTIONS:', error);
            throw error;
        }
    },

    orderGenrate: async (courseData) => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(
                `${API_BASE_URL}/test-video-package-purchase-order-generate`,
                courseData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            console.error('Error ORDER GENERATE:', error);
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user_register`, userData)
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/user_login`, credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getWallet: async () => {
        try {
            const token = storage.getString('token');
            const response = await axios.get(`${API_BASE_URL}/get-wallet`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    sendOtp: async (otpData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/verify_register_otp`, otpData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    resendOtp: async (phoneNumber) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/resend-otp`, { phoneNumber });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    forgot_for_otp_Password: async (mobile) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/otp-forget-password`, { mobile });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    verify_otp_for_forgot_password: async (verifyOtpData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/verify_register_otp`, verifyOtpData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    update_for_forgot_password: async (forgotPassData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/otp-forget-password`, forgotPassData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    setPin: async (pinData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/set-password`, pinData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updatePassword: async (passwordData) => {
        try {
            const token = storage.getString('token');
            const response = await axios.post(`${API_BASE_URL}/auth/update-password`, passwordData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    updateProfile: async (profileData) => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/profile-update`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },


    userProfileGet: async () => {
        try {
            const token = storage.getString('token');
            // console.log("token", token)
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/profile-get`, "", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    logout: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/logout`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN LOGOUT ", error)
        }
    },


    // // REPORT QUETION GET API
    getReportQuetion: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-reported-question-get`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN REPORT QUETION GET API ", error)
        }
    },
    // REPORT QUETION  SUBMIT API
    reportQuestionSubmit: async (quetionReportData) => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/question-report`, quetionReportData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN  REPORT QUETION  SUBMIT API ", error)
        }
    },

    // GET USER COLLECTION DETAILS API
    getUserCollectionDetails: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-collection-detail-get`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION DETAILS API ", error)
        }
    },
    // USER COLLECTION ADD API
    addUserCollection: async (collection) => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/user-collection`, { collection }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log("response in add collection", res)
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },
    removeUserCollection: async (collection) => {
        console.log("collection in user Provider========>", { collection })
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/user-collection-remove`, { collection }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // console.log("response in add collection", res)
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },
    // // REPORTED QUESTION ADD API
    reportQuestion: async (reportedQuetion) => {
        try {
            const token = storage.getString('token');
            const res = await axios.post(`${API_BASE_URL}/question-report`, reportedQuetion, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },
    reportQuestionGet: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/user-reported-question-get`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },
    getNotification: async () => {
        try {
            const token = storage.getString('token');
            const res = await axios.get(`${API_BASE_URL}/notification-get`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN NOTIFICATION GET ", error)
        }
    },
    userRemoveAccount: async () => {
        try {
            const token = storage.getString('token');
            // console.log("token ", token)
            // return
            const res = await axios.post(`${API_BASE_URL}/delete-account`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN REMOVE ACCOUNT POST ", error)
        }
    },
    userTransactions: async () => {
        try {
            const token = storage.getString('token');
            // console.log("token ", token)
            // return
            const res = await axios.get(`${API_BASE_URL}/my-transactions`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.log("ERROR IN REMOVE ACCOUNT POST ", error)
        }
    },









};

export default UserApiProvider;
