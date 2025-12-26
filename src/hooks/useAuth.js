import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
//on gere l'authentification et les infos utilisateur via un context React
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth doit être utilisé dans AuthProvider");
    return context;
};