import { useState, useEffect } from "react";
import { Plus, Search, Theater, Archive } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api.js";

export default function AfficherSallesActives() {
    const navigate = useNavigate();
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, salle: null });
    const [error, setError] = useState(null);

    const fetchSalles = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getSalles(true);
            setSalles(response.data);
        } catch (error) {
            console.error("Error fetching salles:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalles();
    }, []);

    const handleToggleStatus = async () => {
        if (confirmModal.salle) {
            setError(null);
            try {
                await adminApi.toggleSalleActivation(confirmModal.salle.id, false);
                setConfirmModal({ isOpen: false, salle: null });
                fetchSalles();
            } catch (error) {
                console.error("Error toggling status:", error);
                const errorMessage = error.response?.data?.message || error.response?.data?.error || "Une erreur est survenue lors de la désactivation.";
                setError(errorMessage);
                setConfirmModal({ isOpen: false, salle: null });
                // Effacer l'erreur après 5 secondes
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    const filteredSalles = salles.filter(salle =>
        (salle.nom?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (salle.type?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                        <Theater className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Salles Actives</h1>
                        <p className="text-sm text-zinc-500">Gérer les salles actives</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate("/admin/salles/archives")}
                        className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all flex items-center gap-2 border border-zinc-800"
                    >
                        <Archive className="w-4 h-4" />
                        Salles Désactivées
                    </button>
                    <button
                        onClick={() => navigate("/admin/salles/ajouter")}
                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter Salle
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-xl flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher par nom ou type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Salles Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-zinc-500 mt-4">Chargement...</p>
                    </div>
                ) : filteredSalles.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        Aucune salle trouvée
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-950/50">
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Nom</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Capacité</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Type</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Config</th>
                                <th className="text-right p-4 text-sm font-semibold text-zinc-400">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSalles.map((salle) => (
                                <tr key={salle.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                                    <td className="p-4">
                                        <p className="font-medium text-white">{salle.nom}</p>
                                        <p className="text-xs text-zinc-500">ID: {salle.id}</p>
                                    </td>
                                    <td className="p-4">
                                            <span className="px-3 py-1 bg-blue-600/10 text-blue-400 rounded-lg text-sm font-medium">
                                                {salle.capacite} places
                                            </span>
                                    </td>
                                    <td className="p-4">
                                            <span className="px-3 py-1 bg-red-600/10 text-red-400 rounded-lg text-sm">
                                                {salle.type}
                                            </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col text-xs text-zinc-500">
                                            <span>{salle.nombreRangees} rangées</span>
                                            <span>{salle.siegesParRangee} sièges/rang</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/salles/details/${salle.id}`)}
                                                className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-all text-sm"
                                            >
                                                Détails
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/salles/modifier/${salle.id}`)}
                                                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all text-sm"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => setConfirmModal({ isOpen: true, salle: salle })}
                                                className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-all text-sm"
                                            >
                                                Désactiver
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false, salle: null })}
                onConfirm={handleToggleStatus}
                title="Désactivation de la salle"
                message={`Êtes-vous sûr de vouloir désactiver la salle "${confirmModal.salle?.nom}" ?`}
                type="danger"
            />
        </div>
    );
}
