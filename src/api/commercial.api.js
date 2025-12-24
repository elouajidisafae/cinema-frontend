import api from "./api";

export const commercialApi = {
    // Dashboard Stats
    getDashboardStats: async (debut, fin) => {
        const params = {};
        if (debut) params.debut = debut;
        if (fin) params.fin = fin;
        const response = await api.get("/commercial/dashboard/stats", { params });
        return response.data;
    },

    // Session Management
    getSeances: async (filters = {}) => {
        // Filter out empty values to avoid 400 errors
        const cleanFilters = {};
        Object.keys(filters).forEach(key => {
            if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                cleanFilters[key] = filters[key];
            }
        });
        const response = await api.get("/commercial/seances", { params: cleanFilters });
        return response.data;
    },

    createSeance: async (seanceData) => {
        const response = await api.post("/commercial/seances", seanceData);
        return response.data;
    },

    updateSeance: async (id, seanceData) => {
        const response = await api.put(`/commercial/seances/${id}`, seanceData);
        return response.data;
    },

    toggleSeanceStatus: async (id) => {
        const response = await api.patch(`/commercial/seances/${id}/status`);
        return response.data;
    },

    getSeanceById: async (id) => {
        const response = await api.get(`/commercial/seances/${id}`);
        return response.data;
    },

    // Dependencies
    getFilms: async () => {
        const response = await api.get("/commercial/films");
        return response.data;
    },

    getSalles: async () => {
        const response = await api.get("/commercial/salles");
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get("/commercial/categories");
        return response.data;
    },

    // Reservations
    getReservations: async () => {
        const response = await api.get("/commercial/reservations");
        return response.data;
    },

    // Exports
    exportSeancesPdf: async (filters) => {
        const response = await api.get("/commercial/seances/export/pdf", {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    },

    exportSeancesExcel: async (filters) => {
        const response = await api.get("/commercial/seances/export/excel", {
            params: filters,
            responseType: 'blob'
        });
        return response.data;
    },

    exportReservationsPdf: async () => {
        const response = await api.get("/commercial/reservations/export/pdf", {
            responseType: 'blob'
        });
        return response.data;
    },

    exportReservationsExcel: async () => {
        const response = await api.get("/commercial/reservations/export/excel", {
            responseType: 'blob'
        });
        return response.data;
    }
};
