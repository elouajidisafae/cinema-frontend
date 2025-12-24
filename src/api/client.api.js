import api from './api';

export const clientApi = {
    // Reservations
    getMyReservations: () => api.get('/client/reservations'),
    createReservation: (data) => api.post('/client/reservations', data),
    downloadTicket: (code) => api.get(`/client/reservations/${code}/ticket.pdf`, { responseType: 'blob' }),
    confirmPresence: (code) => api.put(`/client/reservations/${code}/confirm-presence`),

    // Profile
    getProfile: () => api.get('/client/profile'),
    updateProfile: (data) => api.put('/client/profile', data),
    updatePassword: (currentPassword, newPassword) => api.put('/client/password', { currentPassword, newPassword }),

    // Favorites
    getFavorites: () => api.get('/client/favorites'),
    addFavorite: (filmId) => api.post(`/client/favorites/${filmId}`),
    removeFavorite: (filmId) => api.delete(`/client/favorites/${filmId}`)
};
