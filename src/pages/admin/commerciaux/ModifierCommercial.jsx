import { useState, useEffect } from "react";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import UserForm from "../../../components/admin/shared/UserForm";

export default function ModifierCommercial() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch both active and inactive to find the user
                const activeRes = await adminApi.getUsers("COMMERCIAL", true);
                const inactiveRes = await adminApi.getUsers("COMMERCIAL", false);
                const found = [...activeRes.data, ...inactiveRes.data].find(u => u.id === id);

                if (found) {
                    setUser(found);
                } else {
                    alert("Utilisateur non trouvé");
                    navigate('/admin/commerciaux');
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate('/admin/commerciaux');
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
            navigate('/admin/commerciaux');
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
                        <User className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Modifier Commercial</h2>
                        <p className="text-zinc-500 text-sm">Modification du compte de {user.prenom} {user.nom}</p>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/admin/commerciaux')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </button>
            </div>

            <div className="bg-zinc-950/50 border border-zinc-900 rounded-3xl p-8 backdrop-blur-sm">
                <UserForm
                    user={user}
                    role="COMMERCIAL"
                    onSubmit={handleUpdate}
                    onCancel={() => navigate('/admin/commerciaux')}
                    isSubmitting={isSubmitting}
                />
            </div>
        </div>
    );
}
