import { storage } from "../helper/Store";
import api from "./axiosConfig";

const PracticeBatch = {
    getPracticeBatchData: async () => {
        try {
           const token = storage.getString('token');
            console.log('Token from getUserToken:', token);
            const res = await api.get("/practice-batch");
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ✅ CORRECTED: Simple API call only, no React logic
    purchasePracticeBatch: async (purchaseData) => {
        try {
            const token = storage.getString('token');
            console.log('Token from getUserToken:', token); // Debug log
            
            if (!token) {
                throw new Error('No authentication token found. Please login again.');
            }

            console.log('Purchase data being sent:', purchaseData); // Debug log

            const response = await api.post(`/purchase-practice-batch`, purchaseData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json', // ✅ FIXED: Changed from multipart/form-data
                },
            });
            
            console.log('Purchase API response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Purchase API Error:', error); // Debug log
            
            // Better error handling
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                throw new Error('Your session has expired. Please login again.');
            } else if (error.response?.status === 400) {
                throw new Error(error.response?.data?.message || 'Invalid request data.');
            } else if (error.response?.status === 403) {
                throw new Error('You do not have permission to purchase this batch.');
            } else {
                throw new Error(error.response?.data?.message || error.message || 'Purchase failed. Please try again.');
            }
        }
    },

    getBatchVideos:async(slug)=>{
         try {
           const token = storage.getString('token');
            console.log('Token from getUserToken:', token);
            const res = await api.get(`/practice-batch-video/${slug}`);
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default PracticeBatch;
