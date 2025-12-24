
import { useState, useEffect } from "react";
import { commercialApi } from "../../api/commercial.api";
import { Search, Calendar, User, Film, Clock, CheckCircle, XCircle, Filter, ChevronDown, RefreshCw, Download, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GestionReservations() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state
    const [selectedStatus, setSelectedStatus] = useState('all'); // Added selectedStatus state

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Plus compact, 8 items fit well on most screens without scrolling

    const loadData = async () => {
        try {
            setLoading(true); // Ensure loading is true when fetching
            setError(null); // Clear previous errors
            const data = await commercialApi.getReservations();
            setReservations(data);
        } catch (err) { // Changed error to err as per user's snippet
            console.error('Erreur chargement réservations:', err);
            toast.error("Impossible de charger les réservations. Veuillez vérifier votre connexion internet."); // Set error message
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(reservations.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentReservations = reservations.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleExportPdf = async () => {
        try {
            const blob = await commercialApi.exportReservationsPdf();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reservations_${new Date().toISOString().slice(0, 10)}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Liste des réservations exportée !");
        } catch (error) {
            console.error("Export PDF failed", error);
            toast.error("Échec de l'exportation PDF. Veuillez réessayer.");
        }
    };

    const handleExportExcel = async () => {
        try {
            const blob = await commercialApi.exportReservationsExcel();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reservations_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            toast.success("Excel des réservations généré !");
        } catch (error) {
            console.error("Export Excel failed", error);
            toast.error("Échec de l'exportation Excel. Veuillez réessayer.");
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Liste des Réservations</h1>
                    <p className="text-zinc-500 text-sm">Suivez toutes les réservations en temps réel</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={loadData} // Changed to loadData as per user's snippet
                        className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        title="Actualiser"
                    >
                        <RefreshCw className={`w - 5 h - 5 ${loading ? 'animate-spin' : ''} `} />
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
                </div>
            </div>

            {/* List */}
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-900/50 border-b border-zinc-800">
                        <tr>
                            <th className="px-4 py-3">Date Réservation</th>
                            <th className="px-4 py-3">Client</th>
                            <th className="px-4 py-3">Film & Séance</th>
                            <th className="px-4 py-3">Montant</th>
                            <th className="px-4 py-3 text-center">Statut</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8 text-zinc-500">Chargement...</td></tr>
                        ) : reservations.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8 text-zinc-500">Aucune réservation trouvée</td></tr>
                        ) : (
                            currentReservations.map((res) => (
                                <tr key={res.id} className="hover:bg-zinc-900/30 transition-colors group border-l-2 border-l-transparent hover:border-l-red-500">
                                    <td className="px-4 py-2.5 text-zinc-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-sky-500" />
                                            <span className="group-hover:text-zinc-300 transition-colors">
                                                    {new Date(res.dateReservation).toLocaleString('fr-FR')}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 font-medium text-white">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3.5 h-3.5 text-violet-400" />
                                            {res.clientNom} {res.clientPrenom}
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-zinc-400">
                                        <div className="flex flex-col">
                                                <span className="text-red-500 font-bold flex items-center gap-1">
                                                    <Film className="w-3.5 h-3.5 text-red-600" /> {res.filmTitre}
                                                </span>
                                            <span className="text-xs text-zinc-500 mt-0.5 flex items-center gap-1">
                                                    {new Date(res.seanceDateHeure).toLocaleString('fr-FR')}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2.5 text-amber-400 font-bold">
                                        {res.montantTotal.toFixed(2)} Dh
                                    </td>
                                    <td className="px-4 py-2.5 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border shadow-sm transition-all ${res.statut === 'VALIDEE'
                                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                : res.statut === 'CONFIRMEE_CLIENT'
                                                    ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                                                    : res.statut === 'ANNULEE'
                                                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                                {res.statut}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                {!loading && reservations.length > 0 && (
                    <div className="p-4 border-t border-zinc-800/50 flex justify-between items-center bg-zinc-900/30">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 font-medium transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-lg hover:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800/50 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300"
                        >
                            Précédent
                        </button>
                        <span className="text-sm text-zinc-500">
                            Page <span className="text-white font-medium">{currentPage}</span> sur <span className="text-white font-medium">{totalPages}</span>
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
                            className="px-4 py-2 rounded-lg border border-zinc-700 bg-zinc-800/50 text-zinc-300 font-medium transition-all duration-300 hover:bg-red-600 hover:border-red-600 hover:text-white hover:shadow-lg hover:shadow-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800/50 disabled:hover:border-zinc-700 disabled:hover:text-zinc-300"
                        >
                            Suivant
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
