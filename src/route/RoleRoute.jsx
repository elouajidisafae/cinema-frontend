import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const RoleRoute = ({ allowedRoles }) => {
    const { user, hasRole, loading } = useAuth();

    if (loading) return <div>Chargement...</div>; // ou un spinner

    if (!user) {
        return allowedRoles === "CLIENT"
            ? <Navigate to="/login/client" />
            : <Navigate to="/login/internal" />;
    }

    if (!hasRole(allowedRoles)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};
