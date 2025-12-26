//Cela simplifie énormément la communication entre le frontend et le backend et garantit la sécurité de l’application.
import axios from "axios";
//Ce fichier centralise toutes les requêtes HTTP vers le backend.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    timeout: 10000, // 10 secondes
    headers: { "Content-Type": "application/json" },
});

// Ajout automatique du token dans les en-tete
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
