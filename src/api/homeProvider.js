import axios from "axios";

// const API_BASE_URL = "https://admin.revision24.com/api";
import api from "./axiosConfig";
import { storage } from "../helper/Store";
const HomeProvider = {

    homeData: async (id = '') => {

        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await api.get(`/home-page?exam_category_id=${id}`, {
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

    getSingleCategoryPackageTestseries: async (id, page = 1, search) => {
       
        try {
            const token = storage.getString('token');
            const res = await api.get(`/test-course-detail-get`, {
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
            const res = await api.get(`/test-series-detail/${id}`, {
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
            const res = await api.get(`/question-list-get?test_series_id=${id}`, {
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
            const res = await api.post(
                `/user-attend-test-series`,
                attendQuestion,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res.data;
        } catch (error) {
            console.error('Error SUBMIT ATTEND QUESTIONS:', error);
            throw error;
        }
    },



    // GET USER RANK
    getUserTestSeriesRank: async (test_id) => {
        try {
            const token = storage.getString('token');
            const res = await api.get(`/user-attend-test-series-rank-get?test_id=${test_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error TEST SERIES RANK:', error);
            throw error;
        }
    },

    getUserTestSeriesSolution: async (test_id) => {
        // console.log("test id ", test_id)
        try {
            const token = storage.getString('token');
            const res = await api.get(`/user-attend-test-series-question-solution?test_id=${test_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data;
        } catch (error) {
            console.error('Error fetching solution:', error);
            throw error;
        }
    },

    getSubscriptionData: async () => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await api.get(`/subscriptions`, {
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
    checkoutpay: async (planData) => {
        try {
            const token = storage.getString('token');
            // if (!token) throw new Error('No token found');

            const response = await api.post(`/checkout.pay`, planData, {
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


            const response = await api.post(`/profile-get`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getTransaction: async () => {
        try {
            const response = await api.get(`/my-transactions`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    getBlog: async (page = 1) => {
        try {
            const response = await api.get(`/exam-info?page=${page}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // In HomeProvider.js
    getBlogDetail: async (id) => {
        try {
            const response = await api.get(`exam-info-detail/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    helpAndSupport: async (queryData) => {
        try {
            const response = await api.post(`/contact-us-store`, queryData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    saveCollection: async (collectionData) => {
        try {
            const response = await api.post(`/user-collection`, {collection: collectionData});
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    removeUserCollection: async (collection) => {
        // console.log("collection in user Provider========>", { collection })
        try {
            const res = await api.post(`/user-collection-remove`, {collection});
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION ADD API ", error)
        }
    },


    // GET USER COLLECTION DETAILS API
    getUserCollectionDetails: async () => {
        try {
            const res = await api.get(`/user-collection-detail-get`);
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION DETAILS API ", error)
        }
    },
    // GET USER COLLECTION DETAILS API
    getLiveVideo: async () => {
        try {
            const res = await api.get(`/live-classes`);
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER COLLECTION DETAILS API ", error)
        }
    },
      // GET USER COLLECTION DETAILS API
    getAllGkseries: async () => {
        try {
            const res = await api.get(`/all-gk-test-series`);
            return res.data;
        } catch (error) {
            console.log("ERROR IN USER GK GK API ", error)
        }
    },
}

export default HomeProvider