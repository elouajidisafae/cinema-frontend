import api from "./api";

export const publicApi = {
    // Films
    getAllFilms: () => api.get("/public/films"),
    getFilmById: (id) => api.get(`/public/films/${id}`),
    getSeancesByFilmId: (id) => api.get(`/public/films/${id}/seances`),

    // Seances & Seats
    getSeanceById: (id) => api.get(`/public/seances/${id}`),
    getReservedSeats: (seanceId) => api.get(`/public/seances/${seanceId}/seats`),

    // Offres
    getOffres: () => api.get("/offres/public"),
    getApplicableOffers: (nbPersonnes, date, seanceId) => api.get("/public/offres/applicable", {
        params: { nbPersonnes, date, seanceId }
    }),
};
