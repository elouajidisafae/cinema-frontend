// src/api/auth.api.js
import api from "./api";

export const authApi = {
    loginClient: (email, motDePasse) =>
        api.post("/auth/client/login", { email, motDePasse }),

    loginInternal: (email, motDePasse) =>
        api.post("/auth/internal/login", { email, motDePasse }),

    register: (data) =>
        api.post("/auth/register", data),
};
