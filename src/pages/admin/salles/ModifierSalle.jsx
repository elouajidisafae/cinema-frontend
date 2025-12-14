import { useState, useEffect } from "react";
import { Theater } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";
import SalleForm from "../../../components/admin/shared/SalleForm";

export default function ModifierSalle() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [salle, setSalle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSalle = async () => {
            try {
                const [activesRes, inactivesRes] = await Promise.all([
                    adminApi.getSalles(true),
                    adminApi.getSalles(false)
                ]);
                const allSalles = [...activesRes.data, ...inactivesRes.data];
                const foundSalle = allSalles.find(s => s.id === id);
                setSalle(foundSalle);
            } catch (error) {
                console.error("Error fetching salle:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSalle();
    }, [id]);

    const handleSubmit = async (data) => {
        try {
            await adminApi.updateSalle(id, data);
            navigate("/admin/salles");
        } catch (error) {
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-zinc-500 mt-4">Chargement...</p>
            </div>
        );
    }

    if (!salle) {
        return (
            <div className="text-center py-12 text-zinc-500">
                Salle non trouvée
            </div>
        );
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                    <Theater className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white">Modifier la Salle</h1>
                    <p className="text-sm text-zinc-500">{salle.nom}</p>
                </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                <SalleForm
                    salle={salle}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/salles")}
                />
            </div>
        </div>
    );
}
