import { useState, useEffect } from "react";
import { commercialApi } from "../../api/commercial.api";
import { Search, Plus, Filter, Calendar, Clock, MapPin, MoreVertical, Edit, Trash2, CheckCircle, XCircle, Film, RefreshCw, Download, Theater, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../../components/admin/ConfirmModal';
import AjouterSeance from "./AjouterSeance";

export default function AfficherSeancesActives() {
    const [seances, setSeances] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [films, setFilms] = useState([]);
    const [salles, setSalles] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        filmId: "",
        salleId: "",
        dateDebut: "",
        dateFin: ""
    });

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSeance, setEditingSeance] = useState(null);
    const [showConfirmToggle, setShowConfirmToggle] = useState(false);
    const [seanceToToggle, setSeanceToToggle] = useState(null);

    const fetchSeances = async () => {
        setLoading(true);
        setError(null);
        try {
            console.log("🔄 Loading active sessions data...");
            const [seancesData, filmsData, sallesData, categoriesData] = await Promise.all([
                commercialApi.getSeances(filters),
                commercialApi.getFilms(),
                commercialApi.getSalles(),
                commercialApi.getCategories()
            ]);
            // Filter only active seances
            const activeSeances = seancesData.filter(s => s.active === true);
            setSeances(activeSeances);

            setFilms(filmsData);
            setSalles(sallesData);
            setCategories(categoriesData);
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

    const handleSave = () => {
        fetchSeances();
        toast.success(editingSeance ? "Séance modifiée avec succès !" : "Séance créée avec succès !");
    };

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        setLoading(true);
        setError(null);
        try {
            const data = await commercialApi.getSeances(newFilters);
            // Filter only active seances
            setSeances(data.filter(s => s.active === true));
            setCurrentPage(1); // Reset pagination on filter change
        } catch (err) {
            console.error("Filter error", err);
            setError("Erreur lors de l'application du filtre.");
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!seanceToToggle) return;
        try {
            await commercialApi.toggleSeanceStatus(seanceToToggle);
            toast.success("Séance archivée avec succès !");
            fetchSeances();
            setShowConfirmToggle(false);
            setSeanceToToggle(null);
        } catch (error) {
            console.error("Error toggling status", error);
            toast.error("Erreur lors de l'archivage de la séance.");
        }
    };

    const confirmToggle = (id) => {
        setSeanceToToggle(id);
        setShowConfirmToggle(true);
    };

    const handleEdit = (seance) => {
        setEditingSeance(seance);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingSeance(null);
        setIsModalOpen(true);
    };

    const handleExportExcel = async () => {
        try {
            const blob = await commercialApi.exportSeancesExcel(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `seances_actives_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Export Excel lancé !");
        } catch (error) {
            console.error("Export Excel failed", error);
            toast.error("Échec de l'exportation Excel.");
        }
    };

    const handleExportPdf = async () => {
        try {
            const blob = await commercialApi.exportSeancesPdf(filters);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `programme_seances_${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Export PDF lancé !");
        } catch (error) {
            console.error("Export PDF failed", error);
            toast.error("Échec de l'exportation PDF.");
        }
    };

    return (
        <>
            <div className="space-y-6 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Séances Actives</h1>
                        <p className="text-zinc-400">Planifiez et gérez les séances de projection en cours</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={fetchSeances}
                            className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                            title="Actualiser"
                        >
                            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleExportPdf}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-xl transition-all text-sm font-medium border border-red-600/20"
                        >
                            <FileText className="w-4 h-4" />
                            Exporter PDF
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-4 py-2.5 bg-green-600/10 hover:bg-green-600/20 text-green-500 rounded-xl transition-all text-sm font-medium border border-green-600/20"
                        >
                            <Download className="w-4 h-4" />
                            Exporter Excel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl transition-colors font-medium shadow-lg shadow-red-900/20"
                        >
                            <Plus className="w-4 h-4" />
                            Nouvelle Séance
                        </button>
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
                                <tr><td colSpan="5" className="text-center py-8 text-zinc-500">Aucune séance active trouvée</td></tr>
                            ) : (
                                currentSeances.map((seance) => (
                                    <tr key={seance.id} className="hover:bg-zinc-900/30 transition-colors group border-l-2 border-l-transparent hover:border-l-red-500">
                                        <td className="px-4 py-2.5 font-bold text-red-500">{seance.filmTitre}</td>
                                        <td className="px-4 py-2.5 text-zinc-400">
                                            <div className="flex items-center gap-2">
                                                <Theater className="w-3.5 h-3.5 text-amber-500" />
                                                {seance.salleNom}
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 text-zinc-400">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                                                <span className="group-hover:text-zinc-300 transition-colors">
                                                        {new Date(seance.dateHeure).toLocaleString('fr-FR')}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between text-[10px] text-zinc-500">
                                                    <span>Réservées: <span className="text-white font-medium">{seance.placesReservees}</span></span>
                                                    <span>Dispo: {seance.placesDisponibles}</span>
                                                </div>
                                                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${(seance.placesReservees / seance.salleCapacite) > 0.8 ? 'bg-rose-500' :
                                                            (seance.placesReservees / seance.salleCapacite) > 0.5 ? 'bg-amber-500' :
                                                                'bg-emerald-500'
                                                        }`}
                                                        style={{ width: `${(seance.placesReservees / seance.salleCapacite) * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-2.5 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => confirmToggle(seance.id)}
                                                    className="px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-red-500/20 hover:text-red-500 hover:border-red-500/30"
                                                    title="Désactiver"
                                                >
                                                    Active
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(seance)}
                                                    className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
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
                                className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 font-medium transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-lg hover:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800/50 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300"
                            >
                                Précédent
                            </button>
                            <span className="text-sm text-zinc-500">
                                Page <span className="text-white font-medium">{currentPage}</span> sur <span className="text-white font-medium">{Math.ceil(seances.length / itemsPerPage)}</span>
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= Math.ceil(seances.length / itemsPerPage)}
                                className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 font-medium transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-lg hover:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800/50 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300"
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - Outside main div to avoid stacking context issues */}
            {isModalOpen && (
                <AjouterSeance
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                    films={films}
                    salles={salles}
                    categories={categories}
                    initialData={editingSeance}
                />
            )}

            <ConfirmModal
                isOpen={showConfirmToggle}
                onClose={() => setShowConfirmToggle(false)}
                onConfirm={handleToggleStatus}
                title="Archiver la séance"
                message="Êtes-vous sûr de vouloir archiver cette séance ? Elle ne sera plus disponible à la réservation pour les clients."
                type="danger"
            />
        </>
    );
}
