import api from "./api";

export const caissierApi = {
    // Ticket Verification
    verifierBillet: async (code) => {
        const response = await api.post("/caissier/verifier", { code });
        return response.data;
    },

    // Ticket Validation (Scan complete)
    validerEntree: async (reservationId) => {
        const response = await api.post(`/caissier/valider/${reservationId}`);
        return response.data;
    },

    // Reservation Cancellation
    annulerEntree: async (reservationId) => {
        const response = await api.post(`/caissier/annuler/${reservationId}`);
        return response.data;
    },

    // Dashboard Stats
    getStats: async () => {
        const response = await api.get("/caissier/stats");
        return response.data;
    }
};
