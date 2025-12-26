import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
// on gere l'authentification et l'autorisation des utilisateurs
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (savedUser && token && savedUser !== "undefined") {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        localStorage.setItem("token", userData.token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        const isClient = user?.role === "CLIENT";
        localStorage.clear();
        setUser(null);
        window.location.href = isClient ? "/" : "/login/internal";
    };

    const hasRole = (roles) => {
        if (!user) return false;
        return Array.isArray(roles)
            ? roles.includes(user.role)
            : user.role === roles;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasRole, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
