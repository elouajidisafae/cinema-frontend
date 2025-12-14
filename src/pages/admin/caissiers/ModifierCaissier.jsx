import { useState, useEffect } from "react";
import { ArrowLeft, CreditCard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import UserForm from "../../../components/admin/shared/UserForm";

export default function ModifierCaissier() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Since we don't have a direct "getUserById" endpoint exposed yet in our snippet,
                // we'll fetch all and find (not ideal but works given current API exposure),
                // OR better, we assume the API might have getUser(id) or we just use the list for now if strictly needed.
                // However, referencing the user prompt, they typically have generic endpoints.
                // Let's assume we can fetch the user details using a get users call or if specific one exists.
                // Checking previous code, `adminApi.getUsers` was used.
                // Let's rely on fetching the list for now or assume we can filter.
                // Ideal: await adminApi.getUser(id);
                // Current: Fetch list and find. TODO: Add getUserById to API.
                const response = await adminApi.getUsers("CAISSIER"); // fetch all caissiers (active & inactive ideally, but this API defaults to active=true often)
                // Actually, let's try to find it in the list of all users if possible or request valid API.
                // For now, let's fetch all active and deactivated to be safe?
                const activeRes = await adminApi.getUsers("CAISSIER", true);
                const inactiveRes = await adminApi.getUsers("CAISSIER", false);
                const found = [...activeRes.data, ...inactiveRes.data].find(u => u.id === id);

                if (found) {
                    setUser(found);
                } else {
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

    const handleUpdate = async (data) => {
        if (!user) return;
        setIsSubmitting(true);
        try {
            await adminApi.updateUser(user.id, data);
            navigate('/admin/caissiers');
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Erreur lors de la modification");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="text-white p-8 text-center">Chargement...</div>;
    if (!user) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                        <CreditCard className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Modifier Caissier</h2>
                        <p className="text-zinc-500 text-sm">Modification du compte de {user.prenom} {user.nom}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/admin/caissiers')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </button>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 backdrop-blur-sm">
                <UserForm
                    user={user}
                    role="CAISSIER"
                    onSubmit={handleUpdate}
                    onCancel={() => navigate('/admin/caissiers')}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
