// src/api/admin.api.js
import api from "./api";

export const adminApi = {
    getUserStats: () =>
        api.get("/admin/dashboard/users/stats"),

    getFilmSalleStats: () =>
        api.get("/admin/films-salles/stats"),

    getRecentActivities: () =>
        api.get("/admin/dashboard/activities"),

    getDashboardCharts: () =>
        api.get("/admin/dashboard/charts"),

    // User Management
    getUsers: (role, actif) =>
        api.get("/admin/users", { params: { role, actif } }),

    createUser: (data) =>
        api.post("/admin/users", data),

    updateUser: (id, data) =>
        api.put(`/admin/users/${id}`, data),

    toggleUserActivation: (id, actif) =>
        api.put(`/admin/users/${id}/activation`, null, { params: { actif } }),

    // Film Management
    getFilms: (actif) =>
        api.get("/admin/films", { params: { actif } }),

    createFilm: (data) =>
        api.post("/admin/films", data),

    updateFilm: (id, data) =>
        api.put(`/admin/films/${id}`, data),

    toggleFilmActivation: (id, actif) =>
        api.put(`/admin/films/${id}/activation`, null, { params: { actif } }),

    uploadFilmPoster: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post("/admin/upload/film-poster", formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // Salle Management
    getSalles: (actif) =>
        api.get("/admin/salles", { params: { actif } }),

    createSalle: (data) =>
        api.post("/admin/salles", data),

    updateSalle: (id, data) =>
        api.put(`/admin/salles/${id}`, data),

    toggleSalleActivation: (id, actif) =>
        api.put(`/admin/salles/${id}/activation`, null, { params: { actif } }),

    // --- History & Monitoring ---
    getGlobalUserHistoryStats: () => api.get("/admin/historique/users/stats"),
    getFilteredUserHistory: (params) => api.get("/admin/historique/users", { params }),

    getGlobalFilmHistoryStats: () => api.get("/admin/historique/films/stats"),
    getFilteredFilmHistory: (params) => api.get("/admin/historique/films", { params }),

    getGlobalSalleHistoryStats: () => api.get("/admin/historique/salles/stats"),
    getFilteredSalleHistory: (params) => api.get("/admin/historique/salles", { params }),

    getGlobalSeanceHistoryStats: () => api.get("/admin/historique/seances/stats"),
    getFilteredSeanceHistory: (params) => api.get("/admin/historique/seances", { params }),

    getGlobalOfferHistoryStats: () => api.get("/admin/historique/offres/stats"),
    getFilteredOfferHistory: (params) => api.get("/admin/historique/offres", { params }),

    getGlobalReservationStats: () => api.get("/admin/historique/reservations/stats"),

    getFilteredReservations: (params) => api.get("/admin/historique/reservations", { params }),
    getFilteredClients: (params) => api.get("/admin/clients", { params }),

    getAllOffres: () => api.get("/offres"),
    getInactiveOffres: () => api.get("/offres/inactive"),
    getOffreById: (id) => api.get(`/offres/${id}`),
    createOffre: (data) => api.post("/offres", data),
    updateOffre: (id, data) => api.put(`/offres/${id}`, data),
    deleteOffre: (id) => api.delete(`/offres/${id}`),
    activateOffre: (id) => api.post(`/offres/${id}/activate`),
};
