import { useState, useEffect } from "react";
import { Search, Theater, RotateCcw, ArrowLeft } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";

export default function AfficherSallesDesactivees() {
    const navigate = useNavigate();
    const [salles, setSalles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, salle: null });

    const fetchSalles = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getSalles(false);
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

    const handleReactivate = async () => {
        if (confirmModal.salle) {
            try {
                await adminApi.toggleSalleActivation(confirmModal.salle.id, true);
                fetchSalles();
            } catch (error) {
                console.error("Error reactivating salle:", error);
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
                    <button
                        onClick={() => navigate('/admin/salles')}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="w-12 h-12 bg-zinc-700/10 rounded-xl flex items-center justify-center border border-zinc-700/20">
                        <Theater className="w-6 h-6 text-zinc-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Salles Désactivées</h1>
                        <p className="text-sm text-zinc-500">Salles archivées</p>
                    </div>
                </div>
            </div>

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
                        Aucune salle désactivée
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-950/50">
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Nom</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Capacité</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Type</th>
                                <th className="text-right p-4 text-sm font-semibold text-zinc-400">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredSalles.map((salle) => (
                                <tr key={salle.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors opacity-60">
                                    <td className="p-4">
                                        <p className="font-medium text-white">{salle.nom}</p>
                                        <p className="text-xs text-zinc-500">ID: {salle.id}</p>
                                    </td>
                                    <td className="p-4">
                                            <span className="px-3 py-1 bg-zinc-700/10 text-zinc-500 rounded-lg text-sm font-medium">
                                                {salle.capacite} places
                                            </span>
                                    </td>
                                    <td className="p-4">
                                            <span className="px-3 py-1 bg-zinc-700/10 text-zinc-500 rounded-lg text-sm">
                                                {salle.type}
                                            </span>
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
                                                onClick={() => setConfirmModal({ isOpen: true, salle: salle })}
                                                className="px-3 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 rounded-lg transition-all text-sm flex items-center gap-1"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5" />
                                                Réactiver
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
                onConfirm={handleReactivate}
                title="Réactivation de la salle"
                message={`Voulez-vous vraiment réactiver la salle "${confirmModal.salle?.nom}" ?`}
                type="success"
            />
        </div>
    );
}
