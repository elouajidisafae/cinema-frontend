import { useState, useEffect } from "react";
import { commercialApi } from "../../api/commercial.api";
import { Search, Plus, Filter, Calendar, Clock, MapPin, MoreVertical, Edit, Trash2, CheckCircle, XCircle, Film, RefreshCw, Download, Theater } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';

export default function AfficherSeancesInactives() {
    const [seances, setSeances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [films, setFilms] = useState([]);
    const [salles, setSalles] = useState([]);
    const [filters, setFilters] = useState({
        filmId: "",
        salleId: "",
        dateDebut: "",
        dateFin: ""
    });
    const [showConfirmActivate, setShowConfirmActivate] = useState(false);
    const [seanceToActivate, setSeanceToActivate] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const fetchSeances = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log(" Loading inactive sessions data...");
            const [seancesData, filmsData, sallesData] = await Promise.all([
                commercialApi.getSeances(filters),
                commercialApi.getFilms(),
                commercialApi.getSalles()
            ]);
            console.log("📊 Données brutes (Inactives) reçues:", seancesData);

            // Filter: Inactive OR Past sessions
            const now = new Date();
            const inactiveSeances = seancesData
                .filter(s => !s.active || new Date(s.dateHeure) < now)
                .sort((a, b) => new Date(b.dateHeure) - new Date(a.dateHeure)); // DESC

            console.log("✅ Séances archivées (Inactives ou Passées):", inactiveSeances);

            setSeances(inactiveSeances);

            setFilms(filmsData);
            setSalles(sallesData);
            setCurrentPage(1); // Reset to first page on data reload
        } catch (err) {
            console.error('Erreur chargement séances:', err);
            setError("Impossible de charger les séances. Veuillez vérifier votre connexion internet.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSeances();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(seances.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentSeances = seances.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        setLoading(true);
        setError(null);
        try {
            const data = await commercialApi.getSeances(newFilters);
            // Filter only inactive seances
            setSeances(data.filter(s => s.active === false));
            setCurrentPage(1); // Reset pagination on filter change
        } catch (err) {
            console.error("Filter error", err);
            setError("Erreur lors de l'application du filtre.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!seanceToActivate) return;
        try {
            await commercialApi.toggleSeanceStatus(seanceToActivate);
            toast.success("Séance réactivée avec succès !");
            fetchSeances();
            setShowConfirmActivate(false);
            setSeanceToActivate(null);
        } catch (error) {
            console.error("Error toggling status", error);
            toast.error("Erreur lors de la réactivation de la séance.");
        }
    };

    const confirmActivate = (id) => {
        setSeanceToActivate(id);
        setShowConfirmActivate(true);
    };

    // Inactive view typically doesn't allow editing or creating new seances directly here,
    // usually you restore them first. But we can allow it if needed.
    // To keep it clean similar to admin archives, we'll only allow restore.

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Séances Archivées</h1>
                    <p className="text-zinc-400">Historique des séances passées ou désactivées</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchSeances}
                        className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        title="Actualiser"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    {/* No excel export or add button for archives for now, or maybe export is useful? */}
                </div>
            </div>

            {/* Filters */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-zinc-500 mb-1.5 block ml-1">Film</label>
                    <div className="relative">
                        <Film className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <select
                            name="filmId"
                            value={filters.filmId}
                            onChange={handleFilterChange}
                            className="w-full bg-black border border-zinc-800 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block pl-10 p-2.5 appearance-none"
                        >
                            <option value="">Tous les films</option>
                            {films.map(f => <option key={f.id} value={f.id}>{f.titre}</option>)}
                        </select>
                    </div>
                </div>

                <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-zinc-500 mb-1.5 block ml-1">Salle</label>
                    <div className="relative">
                        <Theater className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <select
                            name="salleId"
                            value={filters.salleId}
                            onChange={handleFilterChange}
                            className="w-full bg-black border border-zinc-800 text-white text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block pl-10 p-2.5 appearance-none"
                        >
                            <option value="">Toutes les salles</option>
                            {salles.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* List Container */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                        <tr>
                            <th className="px-4 py-3">Film</th>
                            <th className="px-4 py-3">Salle</th>
                            <th className="px-4 py-3">Date & Heure</th>
                            <th className="px-4 py-3">Places</th>

                            <th className="px-4 py-3 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8 text-zinc-500">Chargement...</td></tr>
                        ) : seances.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-zinc-500">Aucune séance archivée trouvée</td></tr>
                        ) : (
                            currentSeances.map((seance) => (
                                <tr key={seance.id} className="hover:bg-zinc-900/30 transition-colors group border-l-2 border-l-transparent hover:border-l-zinc-500">
                                    <td className="px-4 py-2.5 font-bold text-zinc-400">{seance.filmTitre}</td>
                                    <td className="px-4 py-2.5 text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Theater className="w-3.5 h-3.5 text-zinc-600" />
                                            {seance.salleNom}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-zinc-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                                            <span className="group-hover:text-zinc-400 transition-colors">
                                                    {new Date(seance.dateHeure).toLocaleString('fr-FR')}
                                                </span>
                                        </div>
                                    </td>

                                    <td className="px-4 py-2.5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between text-[10px] text-zinc-500">
                                                <span>Réservées: <span className="text-zinc-400 font-medium">{seance.placesReservees}</span></span>
                                                <span>Dispo: {seance.placesDisponibles}</span>
                                            </div>
                                            <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-zinc-600"
                                                    style={{ width: `${(seance.placesReservees / seance.salleCapacite) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => confirmActivate(seance.id)}
                                                className="px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                                                title="Réactiver"
                                            >
                                                Désactivée
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {!loading && seances.length > 0 && (
                    <div className="p-4 border-t border-zinc-800/50 flex justify-between items-center bg-zinc-900/30">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 font-medium transition-all duration-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Précédent
                        </button>
                        <span className="text-sm text-zinc-500">
                            Page <span className="text-white font-medium">{currentPage}</span> sur <span className="text-white font-medium">{Math.ceil(seances.length / itemsPerPage)}</span>
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= Math.ceil(seances.length / itemsPerPage)}
                            className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 font-medium transition-all duration-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>

            <ConfirmModal
                isOpen={showConfirmActivate}
                onClose={() => setShowConfirmActivate(false)}
                onConfirm={handleToggleStatus}
                title="Réactiver la séance"
                message="Êtes-vous sûr de vouloir réactiver cette séance ? Elle sera à nouveau visible par les clients."
                type="success"
            />
        </div>
    );
}