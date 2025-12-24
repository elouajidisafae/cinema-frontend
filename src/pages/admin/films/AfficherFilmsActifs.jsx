import { useState, useEffect } from "react";
import { Plus, Search, Film, Archive } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/admin.api";

export default function AfficherFilmsActifs() {
    const navigate = useNavigate();
    const [films, setFilms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, film: null });
    const [error, setError] = useState(null);

    const fetchFilms = async () => {
        setLoading(true);
        try {
            const response = await adminApi.getFilms(true);
            setFilms(response.data);
        } catch (error) {
            console.error("Error fetching films:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFilms();
    }, []);

    const handleToggleStatus = async () => {
        if (confirmModal.film) {
            setError(null);
            try {
                await adminApi.toggleFilmActivation(confirmModal.film.id, false);
                setConfirmModal({ isOpen: false, film: null });
                fetchFilms();
            } catch (error) {
                console.error("Error toggling status:", error);
                const errorMessage = error.response?.data?.message || error.response?.data?.error || "Une erreur est survenue lors de la désactivation.";
                setError(errorMessage);
                setConfirmModal({ isOpen: false, film: null });
                // Effacer l'erreur après 5 secondes
                setTimeout(() => setError(null), 5000);
            }
        }
    };

    const filteredFilms = films.filter(film =>
        (film.titre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (film.genre?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                        <Film className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Films Actifs</h1>
                        <p className="text-sm text-zinc-500">Gérer les films actifs</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => navigate("/admin/films/archives")}
                        className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl transition-all flex items-center gap-2 border border-zinc-800"
                    >
                        <Archive className="w-4 h-4" />
                        Films Désactivés
                    </button>
                    <button
                        onClick={() => navigate("/admin/films/ajouter")}
                        className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-red-600/20"
                    >
                        <Plus className="w-4 h-4" />
                        Ajouter Film
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
                        placeholder="Rechercher par titre ou genre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Films Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <p className="text-zinc-500 mt-4">Chargement...</p>
                    </div>
                ) : filteredFilms.length === 0 ? (
                    <div className="text-center py-12 text-zinc-500">
                        Aucun film trouvé
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-zinc-800 bg-zinc-950/50">
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Affiche</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Titre</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Genre</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Durée</th>
                                <th className="text-left p-4 text-sm font-semibold text-zinc-400">Date de sortie</th>
                                <th className="text-right p-4 text-sm font-semibold text-zinc-400">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredFilms.map((film) => (
                                <tr key={film.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                                    <td className="p-4">
                                        {film.afficheUrl ? (
                                            <img
                                                src={`http://localhost:8080${film.afficheUrl}`}
                                                alt={film.titre}
                                                className="w-12 h-16 object-cover rounded-lg border border-zinc-800"
                                            />
                                        ) : (
                                            <div className="w-12 h-16 bg-zinc-800 rounded-lg flex items-center justify-center">
                                                <Film className="w-6 h-6 text-zinc-600" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <p className="font-medium text-white">{film.titre}</p>
                                        <p className="text-xs text-zinc-500">ID: {film.id}</p>
                                    </td>
                                    <td className="p-4">
                                            <span className="px-3 py-1 bg-red-600/10 text-red-400 rounded-lg text-sm">
                                                {film.genre}
                                            </span>
                                    </td>
                                    <td className="p-4 text-zinc-400">{film.duree} min</td>
                                    <td className="p-4 text-zinc-400">
                                        {new Date(film.dateSortie).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/admin/films/details/${film.id}`)}
                                                className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg transition-all text-sm"
                                            >
                                                Détails
                                            </button>
                                            <button
                                                onClick={() => navigate(`/admin/films/modifier/${film.id}`)}
                                                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-all text-sm"
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => setConfirmModal({ isOpen: true, film: film })}
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
                onClose={() => setConfirmModal({ isOpen: false, film: null })}
                onConfirm={handleToggleStatus}
                title="Désactivation du film"
                message={`Êtes-vous sûr de vouloir désactiver le film "${confirmModal.film?.titre}" ? Il ne sera plus visible par les clients.`}
                type="danger"
            />
        </div>
    );
}
