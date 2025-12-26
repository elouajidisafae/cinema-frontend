import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
// Composant de route protégé par rôle
export const RoleRoute = ({ allowedRoles }) => {
    const { user, hasRole, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div>Chargement...</div>; // ou un spinner

    if (!user) { //si pas connecté
        let loginPath = allowedRoles === "CLIENT" ? "/login/client" : "/login/internal";

        // Uniquement pour la confirmation de réservation, on garde l'URL de retour
        if (location.pathname.includes("/reservations/confirm/")) {
            loginPath += `?redirect=${encodeURIComponent(location.pathname)}`;
        }

        return <Navigate to={loginPath} />;
    }

    if (!hasRole(allowedRoles)) { //si pas le bon rôle
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};
