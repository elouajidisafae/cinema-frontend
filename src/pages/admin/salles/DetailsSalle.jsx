import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Theater, Users, Tag, Edit, Power, PowerOff, ArrowLeft, RefreshCw, Grid3x3, Armchair } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { adminApi } from "../../../api/admin.api";

export default function DetailsSalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [salle, setSalle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });

    useEffect(() => {
        const fetchSalle = async () => {
            try {
                const [activeRes, inactiveRes] = await Promise.all([
                    adminApi.getSalles(true),
                    adminApi.getSalles(false)
                ]);
                const found = [...activeRes.data, ...inactiveRes.data].find(s => s.id === id);

                if (found) setSalle(found);
                else {
                    alert("Salle non trouvée");
                    navigate('/admin/salles');
                }
            } catch (error) {
                console.error("Error fetching salle:", error);
                navigate('/admin/salles');
            } finally {
                setLoading(false);
            }
        };
        fetchSalle();
    }, [id, navigate]);

    const handleToggleStatus = async () => {
        try {
            await adminApi.toggleSalleActivation(salle.id, !salle.actif);
            setSalle({ ...salle, actif: !salle.actif });
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    if (loading) return <div className="text-white p-8 text-center">Chargement...</div>;
    if (!salle) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(salle.actif ? '/admin/salles' : '/admin/salles/archives')}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                        <Theater className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Détails de la Salle</h1>
                        <p className="text-sm text-zinc-500">ID: {salle.id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setConfirmModal({ isOpen: true })}
                        className={`p-2.5 rounded-xl transition-all flex items-center gap-2 font-medium ${salle.actif
                            ? 'bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white'
                            : 'bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600 hover:text-white'
                        }`}
                    >
                        {salle.actif ? <PowerOff size={18} /> : <Power size={18} />}
                        {salle.actif ? 'Désactiver' : 'Réactiver'}
                    </button>
                    <button
                        onClick={() => navigate(`/admin/salles/modifier/${salle.id}`)}
                        className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all flex items-center gap-2 font-medium"
                    >
                        <Edit size={18} />
                        Modifier
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informations principales */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h2 className="text-3xl font-bold text-white mb-4">{salle.nom}</h2>
                    <div className="flex items-center gap-2 mb-6">
                        <span className={`px-3 py-1 rounded-lg text-sm ${salle.actif
                            ? 'bg-emerald-600/10 text-emerald-400'
                            : 'bg-red-600/10 text-red-400'
                        }`}>
                            {salle.actif ? 'Active' : 'Désactivée'}
                        </span>
                        <span className="px-3 py-1 bg-red-600/10 text-red-400 rounded-lg text-sm">
                            {salle.type}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-zinc-950/50 rounded-xl">
                            <Users className="w-5 h-5 text-blue-400" />
                            <div>
                                <p className="text-sm text-zinc-500">Capacité</p>
                                <p className="text-2xl font-bold text-white">{salle.capacite} places</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-zinc-950/50 rounded-xl">
                            <Tag className="w-5 h-5 text-red-400" />
                            <div>
                                <p className="text-sm text-zinc-500">Type</p>
                                <p className="text-xl font-bold text-white">{salle.type}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistiques & Configuration */}
                <div className="space-y-6">
                    {/* Configuration Sièges */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Grid3x3 className="w-5 h-5 text-red-500" />
                            Configuration des Sièges
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-950/50 rounded-xl">
                                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                                    <Grid3x3 className="w-4 h-4" />
                                    Nombre de Rangées
                                </div>
                                <p className="text-2xl font-bold text-white">{salle.nombreRangees}</p>
                            </div>
                            <div className="p-4 bg-zinc-950/50 rounded-xl">
                                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-1">
                                    <Armchair className="w-4 h-4" />
                                    Sièges par Rangée
                                </div>
                                <p className="text-2xl font-bold text-white">{salle.siegesParRangee}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={handleToggleStatus}
                title={salle.actif ? "Désactivation de la salle" : "Réactivation de la salle"}
                message={`Voulez-vous vraiment ${salle.actif ? 'désactiver' : 'réactiver'} la salle "${salle.nom}" ?`}
                type={salle.actif ? "danger" : "success"}
            />
        </div>
    );
}
