import axios from 'axios';
import { storage } from '../helper/Store';

const API_BASE_URL = 'https://admin.revision24.com/api';

const CashFreeProvider = {
  getPaymentByCashFree: async (amount) => {
    console.log("amount in cashfree", amount)
    try {
      const token = storage.getString('token');
      console.log("token===>", token)
      if (!token) throw new Error('No token found');

      const response = await axios.post(`${API_BASE_URL}/create-order`, { amount }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  
  getPaymentSubscription: async (planData) => {
    console.log("amount in cashfree===>", planData)
    try {
      const token = storage.getString('token');
      console.log("token===>", token)
      if (!token) throw new Error('No token found');

      const response = await axios.post(`${API_BASE_URL}/checkout.pay`, planData , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default CashFreeProvider;
