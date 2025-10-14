// axiosConfig.js
import axios from 'axios';
import { storage } from '../helper/Store';



const api = axios.create({
  baseURL: 'https://admin.revision24.com/api',
});


api.interceptors.request.use(async (config) => {
  const token = storage.getString('token');
  console.log("token here", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
