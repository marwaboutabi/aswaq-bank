import api from "./api";

const loyaltyService = {

    getMyPoints: async () => {
        const response = await api.get("/loyalty/my-points");
        return response.data;
    },

    getHistory: async () => {
        const response = await api.get("/loyalty/history");

        if (Array.isArray(response.data)) {
            return response.data;
        }

        if (Array.isArray(response.data?.content)) {
            return response.data.content;
        }

        if (Array.isArray(response.data?.data)) {
            return response.data.data;
        }

        console.error(
            "Réponse historique inattendue :",
            response.data
        );

        return [];
    },

    getRewards: async () => {
        const response = await api.get("/loyalty/rewards");

        if (Array.isArray(response.data)) {
            return response.data;
        }

        if (Array.isArray(response.data?.content)) {
            return response.data.content;
        }

        if (Array.isArray(response.data?.data)) {
            return response.data.data;
        }

        console.error(
            "Réponse récompenses inattendue :",
            response.data
        );

        return [];
    },

    getPartners: async () => {
        const response = await api.get("/merchant");

        if (Array.isArray(response.data)) {
            return response.data;
        }

        if (Array.isArray(response.data?.content)) {
            return response.data.content;
        }

        if (Array.isArray(response.data?.data)) {
            return response.data.data;
        }

        console.error(
            "Réponse partenaires inattendue :",
            response.data
        );

        return [];
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