import api from "./axiosConfig";

const CouponProvider = {

    getCouponData: async () => {
        try {
            const res = await api.get("/all-coupon");
            return res.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
    postCouponData: async (formData) => {
        try {
            const res = await api.post("/apply-coupon", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return res.data;
        }
        catch (error) {
            throw error.response?.data || error.message;
        }
    }

}

export default CouponProvider