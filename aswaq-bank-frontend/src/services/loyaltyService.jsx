import api from "./api";


const loyaltyService = {


    getMyPoints: async () => {
    const response = await api.get("/loyalty/my-points");
    return response.data;
},


    getHistory: async () => {
        const response = await api.get("/loyalty/history");
        return response.data;
    },


    getRewards: async () => {
        const response = await api.get("/loyalty/rewards");
        return response.data;
    },
    convertPoints: async () => {
    const response = await api.post("/loyalty/convert");
    return response.data;
},


    redeem: async (rewardId) => {
        const response = await api.post(
            `/loyalty/redeem/${rewardId}`
        );

        return response.data;
    }

};


export default loyaltyService;