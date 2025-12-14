// src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

// Ajout automatique du token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Gestion des erreurs globales
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err.response?.status;

        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirection uniquement si on n’est pas déjà sur login
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login/client";
            }
        }
        return Promise.reject(err);
    }
);

export default api;
