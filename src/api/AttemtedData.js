import api from "./axiosConfig";

const AttemptedData = {

    getAttemptedTestData: async () => {
        try {
            const res = await api.get("/user-attended-test-series");
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
}

export default AttemptedData

