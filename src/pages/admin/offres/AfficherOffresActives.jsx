import { useState, useEffect } from "react";
import { Plus, Search, Tag, Trash2, Edit, History } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";

export default function AfficherOffresActives() {
    const navigate = useNavigate();
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: null });

    const fetchOffres = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getAllOffres();
            setOffres(response.data);
        } catch (error) {
            console.error("Error fetching offres:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOffres();
    }, []);

    const handleDeactivate = async () => {
        if (confirmModal.id) {
            try {
                await adminApi.deleteOffre(confirmModal.id);
                fetchOffres();
            } catch (error) {
                console.error("Error deactivating offre:", error);
            }
        }
    };

    const filteredOffres = offres.filter(offre =>
        (offre.titre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (offre.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                        <Tag className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Gestion des Offres</h1>
                        <p className="text-sm text-zinc-500">Gérer les offres spéciales actives</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/admin/offres/archives")}
                        className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all flex items-center gap-2 font-medium"
                    >
                        <History size={18} />
                        Voir Archives
                    </button>
                    <button
                        onClick={() => navigate("/admin/offres/ajouter")}
                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter Offre
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher par titre ou description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Offres Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-zinc-500 mt-4">Chargement...</p>
                    </div>
                ) : filteredOffres.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        Aucune offre trouvée
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-950/50">
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Titre</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Description</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Date Début</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Date Fin</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Prix</th>
                                <th className="text-right p-4 text-sm font-semibold text-zinc-400">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredOffres.map((offre) => (
                                <tr key={offre.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                                    <td className="p-4 font-medium text-white">{offre.titre}</td>
                                    <td className="p-4 text-zinc-400 text-sm max-w-xs truncate" title={offre.description}>
                                        {offre.description}
                                    </td>
                                    <td className="p-4 text-zinc-400 text-sm">
                                        {new Date(offre.dateDebut).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 text-zinc-400 text-sm">
                                        {new Date(offre.dateFin).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 w-32">
                                            <span className="px-3 py-1 bg-green-900/20 text-green-400 rounded-lg text-sm font-bold border border-green-900/30">
                                                {offre.prix} DH
                                            </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end">
                                            <button
                                                onClick={() => setConfirmModal({ isOpen: true, id: offre.id })}
                                                className="px-3 py-1.5 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-all text-sm flex items-center gap-2 border border-red-600/20"
                                            >
                                                <Trash2 size={14} />
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
                onClose={() => setConfirmModal({ isOpen: false, id: null })}
                onConfirm={handleDeactivate}
                title="Désactivation de l'offre"
                message="Êtes-vous sûr de vouloir désactiver cette offre ? Elle ne sera plus disponible pour les réservations."
                type="danger"
            />
        </div >
    );
}
