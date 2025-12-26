import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { publicApi, clientApi } from "../../api";
import { useAuth } from "../../hooks/useAuth";
import { Play, Clock, Calendar, Ticket, ArrowLeft, Star, MapPin } from "lucide-react";
import { getImageUrl } from "../../utils/imageUtils";

export default function FilmDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [film, setFilm] = useState(null);
    const [seances, setSeances] = useState([]);
    const [loading, setLoading] = useState(true);

    // Favorites Logic
    const [isFavorite, setIsFavorite] = useState(false);
    const [favLoading, setFavLoading] = useState(false);

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    useEffect(() => {
        if (user && id) {
            checkIfFavorite();
        }
    }, [user, id]);

    const fetchData = async () => {
        try {
            // Load film first (critical)
            const filmRes = await publicApi.getFilmById(id);
            setFilm(filmRes.data);

            // Try to load seances (non-critical)
            try {
                const seanceRes = await publicApi.getSeancesByFilmId(id);
                setSeances(seanceRes.data);
            } catch (seanceErr) {
                console.error('Erreur chargement séances:', seanceErr);
                // Film will still display, just without seances
                setSeances([]);
            }
        } catch (err) {
            console.error('Erreur chargement film:', err);
            setFilm(null);
        } finally {
            setLoading(false);
        }
    };

    const checkIfFavorite = async () => {
        try {
            const res = await clientApi.getFavorites();
            const favorites = res.data;
            const isFav = favorites.some(f => String(f.id) === String(id));
            setIsFavorite(isFav);
        } catch (err) {
            console.error("Erreur chargement favoris", err);
        }
    };

    const toggleFavorite = async () => {
        if (!user) {
            const returnUrl = encodeURIComponent(`/film/${id}`);
            navigate(`/login/client?redirect=${returnUrl}`);
            return;
        }

        if (favLoading) return;
        setFavLoading(true);

        try {
            if (isFavorite) {
                await clientApi.removeFavorite(id);
                setIsFavorite(false);
            } else {
                await clientApi.addFavorite(id);
                setIsFavorite(true);
            }
        } catch (err) {
            console.error("Erreur modification favori", err);
            alert("Erreur technique lors de l'ajout aux favoris.");
        } finally {
            setFavLoading(false);
        }
    };

    const handleReserve = (seanceId) => {
        if (!user) {
            const returnUrl = encodeURIComponent(`/film/${id}`);
            navigate(`/login/client?redirect=${returnUrl}`);
        } else {
            navigate(`/reservation/${seanceId}`);
        }
    };

    // Group seances by Date
    const groupedSeances = seances.reduce((acc, seance) => {
        const date = new Date(seance.dateHeure).toLocaleDateString('fr-FR', {
            weekday: 'long', day: 'numeric', month: 'long'
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(seance);
        return acc;
    }, {});

    if (loading) return (
        <div className="min-h-screen bg-black flex items-center justify-center text-white">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!film) return <div className="text-white text-center py-20">Film introuvable</div>;

    return (
        <div className="bg-[#040404] min-h-screen font-sans selection:bg-red-600 selection:text-white pb-20 relative">
            {/* STICKY BACKGROUND EFFECTS */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-red-600/10 rounded-full blur-[120px] animate-pulse duration-[4000ms]" />
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:32px_32px]" />
            </div>

            <div className="relative z-10">
                {/* BACKDROP IMAGE / HERO */}
                <div className="relative min-h-[90vh] w-full overflow-hidden flex items-center pb-12 pt-24">
                    {/* 1. Background Layer: Sharp & Full */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src={getImageUrl(film.afficheUrl)}
                            alt=""
                            className="w-full h-full object-cover object-top opacity-50"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/1920x1080?text=No+Image"
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
                    </div>

                    {/* 2. Content Layer: Split View */}
                    <div className="container mx-auto px-6 relative z-10 w-full h-full flex flex-col justify-center">

                        {/* Back Button */}
                        <div className="mb-10 animate-in slide-in-from-left-4 fade-in duration-500">
                            <Link to="/" className="group inline-flex items-center gap-4 text-zinc-400 hover:text-white transition-all bg-white/5 hover:bg-red-600/10 px-8 py-3 rounded-full border border-white/10 hover:border-red-600/50 backdrop-blur-xl shadow-2xl hover:shadow-red-600/20">
                                <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform duration-300" />
                                <span className="font-black text-sm uppercase tracking-[0.1em]">Retour aux films</span>
                            </Link>
                        </div>

                        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-24">

                            {/* Left: Text Content */}
                            <div className="flex-1 text-center lg:text-left animate-in slide-in-from-bottom-10 fade-in duration-700">

                                {/* Metadata Badge Row */}
                                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-zinc-300 text-sm font-bold mb-8">
                                    <span className="bg-red-600 text-white px-4 py-1.5 rounded-md text-xs uppercase tracking-widest shadow-xl shadow-red-900/40">
                                        {film.genre}
                                    </span>
                                    {film.ageLimite && (
                                        <span className="bg-white/10 text-white border border-white/20 px-3 py-1.5 rounded-md text-xs">
                                            {film.ageLimite}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md border border-white/5">
                                        <Clock size={16} className="text-red-500" />
                                        <span>{film.duree} min</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-md border border-white/5">
                                        <Calendar size={16} className="text-red-500" />
                                        <span>{new Date(film.dateSortie).getFullYear()}</span>
                                    </div>
                                </div>

                                <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-[0.85] drop-shadow-2xl">
                                    {film.titre}
                                </h1>

                                <div className="flex items-center justify-center lg:justify-start gap-6 mb-10">
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <Star key={s} size={20} fill={s <= 4 ? "currentColor" : "none"} className={s <= 4 ? "" : "text-zinc-600"} />
                                        ))}
                                        <span className="ml-2 text-white font-black text-xl">4.2</span>
                                    </div>
                                    <span className="h-6 w-px bg-white/10"></span>
                                    <button
                                        onClick={toggleFavorite}
                                        className={`flex items-center gap-2 font-bold transition-all ${isFavorite ? 'text-red-500' : 'text-zinc-400 hover:text-white'}`}
                                    >
                                        <Star size={24} fill={isFavorite ? "currentColor" : "none"} className={favLoading ? "animate-pulse" : ""} />
                                        {isFavorite ? 'Dans mes favoris' : 'Ajouter aux favoris'}
                                    </button>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                                    <button
                                        onClick={() => {
                                            document.querySelector('#seance-section')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="bg-red-600 text-white hover:bg-red-700 px-10 py-5 rounded-full font-black flex items-center justify-center gap-3 transition-all hover:scale-105 shadow-[0_0_40px_rgba(220,38,38,0.4)]"
                                    >
                                        <Ticket size={24} />
                                        Réserver ma séance
                                    </button>

                                    {film.trailerUrl && (
                                        <button
                                            onClick={() => {
                                                document.querySelector('#trailer-section')?.scrollIntoView({ behavior: 'smooth' });
                                            }}
                                            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-full font-black flex items-center justify-center gap-3 transition-all hover:scale-105"
                                        >
                                            <Play fill="currentColor" size={20} />
                                            Bande Annonce
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Right: The Poster Itself */}
                            <div className="hidden lg:block w-auto shrink-0 animate-in fade-in zoom-in duration-1000 delay-200 perspective-1000">
                                <div className="relative group transform transition-all duration-700 hover:rotate-y-12 hover:scale-105">
                                    <img
                                        src={getImageUrl(film.afficheUrl)}
                                        alt={film.titre}
                                        className="w-auto h-auto max-h-[70vh] max-w-[500px] rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 object-contain"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://via.placeholder.com/300x450?text=No+Poster"
                                        }}
                                    />
                                    <div className="absolute -bottom-10 inset-x-0 h-10 bg-black/80 blur-3xl opacity-60 rounded-[100%]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT SECTIONS */}
                <div className="container mx-auto px-6 py-24 grid lg:grid-cols-3 gap-20">
                    <div className="lg:col-span-2 space-y-20">
                        {/* Synopsis */}
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                                <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                                Synopsis
                            </h2>
                            <p className="text-zinc-400 leading-relaxed text-xl font-light">
                                {film.description}
                            </p>
                        </section>

                        {/* Trailer */}
                        {film.trailerUrl && (
                            <section id="trailer-section" className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                                    <span className="w-1.5 h-8 bg-red-600 rounded-full"></span>
                                    Bande Annonce
                                </h2>
                                <div className="aspect-video w-full rounded-3xl overflow-hidden border border-white/5 bg-zinc-900 shadow-2xl relative group">
                                    <iframe
                                        className="w-full h-full"
                                        src={film.trailerUrl.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")}
                                        title="Trailer"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                    <div className="absolute inset-0 pointer-events-none border-2 border-white/5 rounded-3xl group-hover:border-red-600/20 transition-colors" />
                                </div>
                            </section>
                        )}
                    </div>

                    {/* SEANCES SIDEBAR */}
                    <div className="lg:col-span-1">
                        <div id="seance-section" className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 sticky top-24 shadow-2xl">
                            <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                                <Ticket className="text-red-600" size={28} />
                                Séances
                            </h3>

                            {seances.length === 0 ? (
                                <div className="text-center py-16 text-zinc-500">
                                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-10" />
                                    <p className="font-bold">Bientôt disponible</p>
                                    <p className="text-sm">Revenez plus tard pour les horaires.</p>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {Object.entries(groupedSeances).map(([date, sessionList]) => (
                                        <div key={date}>
                                            <h4 className="text-red-500 font-black uppercase text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
                                                <div className="w-1 h-4 bg-red-600 rounded-full"></div>
                                                {date}
                                            </h4>
                                            <div className="grid grid-cols-1 gap-4">
                                                {sessionList.map(session => {
                                                    const sessionDate = new Date(session.dateHeure);
                                                    const now = new Date();
                                                    const diffInHours = (sessionDate - now) / (1000 * 60 * 60);
                                                    const isBookable = diffInHours >= 3;

                                                    return (
                                                        <button
                                                            key={session.id}
                                                            onClick={() => isBookable && handleReserve(session.id)}
                                                            disabled={!isBookable}
                                                            className={`group relative w-full border rounded-2xl p-4 text-left transition-all 
                                                                ${isBookable
                                                                ? 'bg-white/5 border-white/10 hover:border-red-600/50 hover:bg-white/10 hover:shadow-[0_10px_30px_rgba(220,38,38,0.1)] cursor-pointer'
                                                                : 'bg-zinc-900/50 border-white/5 opacity-60 cursor-not-allowed'}`}
                                                        >
                                                            <div className="flex justify-between items-center mb-2">
                                                                <span className={`text-2xl font-black transition-colors ${isBookable ? 'text-white group-hover:text-red-500' : 'text-zinc-500'}`}>
                                                                    {sessionDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${isBookable ? 'bg-red-600 text-white' : 'bg-zinc-700 text-zinc-400'}`}>
                                                                    {session.categorieNom || "2D"}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-zinc-400 mb-3 font-medium">
                                                                <MapPin size={14} className={isBookable ? "text-red-500" : "text-zinc-600"} /> {session.salleNom}
                                                            </div>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    {isBookable ? (
                                                                        <>
                                                                            <div className="flex gap-1">
                                                                                {[1, 2, 3, 4, 5].map(i => (
                                                                                    <div key={i} className={`w-3 h-1 rounded-full ${i <= 3 ? 'bg-red-600' : 'bg-zinc-800'}`}></div>
                                                                                ))}
                                                                            </div>
                                                                            <span className="text-[10px] text-zinc-500 font-black uppercase">{session.placesDisponibles} places</span>
                                                                        </>
                                                                    ) : (
                                                                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Réservation en ligne fermée</span>
                                                                    )}
                                                                </div>
                                                                {isBookable && (
                                                                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                                                        <ArrowLeft className="rotate-180 text-white" size={16} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
