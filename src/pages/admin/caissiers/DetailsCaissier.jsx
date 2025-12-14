import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import UserDetails from "../../../components/admin/shared/UserDetails";

export default function DetailsCaissier() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch both to find
                const activeRes = await adminApi.getUsers("CAISSIER", true);
                const inactiveRes = await adminApi.getUsers("CAISSIER", false);
                const found = [...activeRes.data, ...inactiveRes.data].find(u => u.id === id);

                if (found) setUser(found);
                else {
                    alert("Utilisateur non trouvé");
                    navigate('/admin/caissiers');
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate('/admin/caissiers');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [id, navigate]);

    if (loading) return <div className="text-white p-8 text-center">Chargement...</div>;
    if (!user) return null;

    return (
        <UserDetails
            user={user}
            onClose={() => navigate(-1)}
        />
    );
}
