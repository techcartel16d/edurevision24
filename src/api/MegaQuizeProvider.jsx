import axios from "axios";
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();
const API_BASE_URL = "https://admin.revision24.com/api";
// const API_BASE_URL = "http://127.0.0.1:8000/api";


const MegaQuizeProvider = {

    getMegaQuizeData: async () => {
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/mega-quiz-get`, {
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
    getMegaQuizAttendQuestion: async (id) => {
        console.log("getMegaQuizAttendQuestion", id)
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/mega-quiz-question-get?quiz_id=${id}`, {
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
    megaQuizAttendSubmit: async (megaQuizData) => {
        // console.log("getMegaQuizAttendQuestion", id)
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/user-attend-mega-quiz`, megaQuizData, {
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
    megaQuizRegister: async (id) => {
        // console.log("getMegaQuizAttendQuestion", id)
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.get(`${API_BASE_URL}/user-attend-mega-quiz-rank-get?quiz_id=${id}`, {
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


    megaQuizResult: async (id) => {
        // console.log("getMegaQuizAttendQuestion", id)
        try {
            const token = storage.getString('token');
            if (!token) throw new Error('No token found');

            const response = await axios.post(`${API_BASE_URL}/mega-quiz-join`, {
                quiz_id: id
            },
                {
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

}

export default MegaQuizeProvider