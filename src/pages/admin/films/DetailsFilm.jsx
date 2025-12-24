import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Film, Calendar, Clock, Tag, Youtube, Edit, Power, PowerOff, ArrowLeft, RefreshCw } from "lucide-react";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import { adminApi } from "../../../api/admin.api";

export default function DetailsFilm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [film, setFilm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false });

    useEffect(() => {
        const fetchFilm = async () => {
            try {
                const [activeRes, inactiveRes] = await Promise.all([
                    adminApi.getFilms(true),
                    adminApi.getFilms(false)
                ]);
                const found = [...activeRes.data, ...inactiveRes.data].find(f => f.id === id);

                if (found) setFilm(found);
                else {
                    alert("Film non trouvé");
                    navigate('/admin/films');
                }
            } catch (error) {
                console.error("Error fetching film:", error);
                navigate('/admin/films');
            } finally {
                setLoading(false);
            }
        };
        fetchFilm();
    }, [id, navigate]);

    const handleToggleStatus = async () => {
        try {
            await adminApi.toggleFilmActivation(film.id, !film.actif);
            setFilm({ ...film, actif: !film.actif });
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    if (loading) return <div className="text-white p-8 text-center">Chargement...</div>;
    if (!film) return null;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(film.actif ? '/admin/films' : '/admin/films/archives')}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div className="w-12 h-12 bg-red-600/10 rounded-xl flex items-center justify-center border border-red-600/20">
                        <Film className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Détails du Film</h1>
                        <p className="text-sm text-zinc-500">ID: {film.id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setConfirmModal({ isOpen: true })}
                        className={`p-2.5 rounded-xl transition-all flex items-center gap-2 font-medium ${film.actif
                            ? 'bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white'
                            : 'bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600 hover:text-white'
                        }`}
                    >
                        {film.actif ? <PowerOff size={18} /> : <Power size={18} />}
                        {film.actif ? 'Désactiver' : 'Réactiver'}
                    </button>
                    <button
                        onClick={() => navigate(`/admin/films/modifier/${film.id}`)}
                        className="p-2.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all flex items-center gap-2 font-medium"
                    >
                        <Edit size={18} />
                        Modifier
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Affiche */}
                <div className="md:col-span-1">
                    {film.afficheUrl ? (
                        <img
                            src={`http://localhost:8080${film.afficheUrl}`}
                            alt={film.titre}
                            className="w-full rounded-2xl border border-zinc-800"
                        />
                    ) : (
                        <div className="w-full aspect-[2/3] bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center">
                            <Film className="w-16 h-16 text-zinc-700" />
                        </div>
                    )}
                </div>

                {/* Informations */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-3xl font-bold text-white mb-2">{film.titre}</h2>
                        <div className="flex items-center gap-2 mb-4">
                            <span className={`px-3 py-1 rounded-lg text-sm ${film.actif
                                ? 'bg-emerald-600/10 text-emerald-400'
                                : 'bg-red-600/10 text-red-400'
                            }`}>
                                {film.actif ? 'Actif' : 'Désactivé'}
                            </span>
                            <span className="px-3 py-1 bg-red-600/10 text-red-400 rounded-lg text-sm">
                                {film.genre}
                            </span>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">{film.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Durée</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{film.duree} min</p>
                        </div>
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-zinc-500 mb-2">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Date de sortie</span>
                            </div>
                            <p className="text-2xl font-bold text-white">
                                {new Date(film.dateSortie).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>

                    {film.trailerUrl && (
                        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                            <div className="flex items-center gap-2 text-zinc-500 mb-3">
                                <Youtube className="w-4 h-4" />
                                <span className="text-sm">Bande-annonce</span>
                            </div>
                            <a
                                href={film.trailerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-red-400 hover:text-red-300 transition-colors break-all"
                            >
                                {film.trailerUrl}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ isOpen: false })}
                onConfirm={handleToggleStatus}
                title={film.actif ? "Désactivation du film" : "Réactivation du film"}
                message={`Voulez-vous vraiment ${film.actif ? 'désactiver' : 'réactiver'} le film "${film.titre}" ?`}
                type={film.actif ? "danger" : "success"}
            />
        </div>
    );
}
